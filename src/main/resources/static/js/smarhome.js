var smartHomeApp = angular.module('smarthome',['timer','ui.bootstrap'])
    .controller('TVController', ['$scope', '$http', '$interval','$filter','$timeout',function($scope, $http, $interval, $filter, $timeout) {
        $scope.epn = 'SONY-UN65JS9500FXZA-ZW153MRC300023V';
        $scope.observeButton = 'Observe  On';
        $scope.lockButton = 'Lock';
        $scope.screenSrc = 'img/default.jpg';
        $scope.screenSrcResume = '';
        $scope.cd = 0;
        $scope.mTime = 20;
        $scope.channelName = 'No Info';
        $scope.Math = window.Math;
        $scope.isLocked = false;
        $scope.channels = [];
        for (var i = 0; i < 10; i++) {
            $scope.channels[i] = {
                name: 'BBC-'+i,
                y:0
            };
        }
        $scope.timeRecords = [];
        for (var j = 0; j < 24; j++) {
            $scope.timeRecords[j] = {
                name: j,
                y:0
            };
        }
        $scope.loadRecords = function() {
            $http.get('/tv/records').success(function(records){
                $scope.records = $filter('orderBy')(records, 'startTime', true);
                console.log($scope.records);
                $scope.records.forEach(function(record) {
                    if (!$scope.channels) $scope.channels = [];
                    if (!$scope.channels[record.channelID]) {
                        $scope.channels[record.channelID] = {
                            name: record.channelName,
                            y: (record.endTime - record.startTime) / 1000
                        };
                    }
                    else {
                        $scope.channels[record.channelID].y += (record.endTime - record.startTime) / 1000;
                    }
                    var d = new Date(record.startTime);
                    console.log(d.getHours());
                    $scope.timeRecords[d.getHours()].y += (record.endTime - record.startTime) / 1000;
                });
                console.log($scope.channels);
                console.log($scope.timeRecords);
                $scope.createChart1();
            })
        }

        $scope.observeButtonClick = function() {
            if ($scope.observeButton === 'Observe  On') {
                $scope.observe();
            }
            else {
                $scope.cancelObservation();
            }
        }

        $scope.lockButtonClick = function() {
            console.log('<'+$scope.lockButton+'>');
            if ($scope.lockButton === 'Lock') {
                $scope.lock();
            }
            else {
                $scope.unlock();
            }
        }

        $scope.observe = function() {
            $http.post('tv/' + $scope.epn +'/observe').success(function() {
                $scope.refreshRecords = $interval($scope.pullLatestRecord, 1000);
                $scope.observeButton = 'Observe Off';
            })
        }

        $scope.cancelObservation = function() {
            console.log('cancelObservation');
            $http.delete('tv/' + $scope.epn +'/observe').success(function() {
                console.log('deleteSuccess');
                if (angular.isDefined($scope.refreshRecords)) {
                    console.log('cancel refresh');
                    console.log($scope.refreshRecords);
                    $interval.cancel($scope.refreshRecords);
                }
                console.log('reset observe button');
                $scope.refreshRecords = 'undefined';
                $scope.observeButton = 'Observe  On';
                $scope.screenSrc = 'img/default.jpg';
            }).error(function() {
                console.log('delete failure');
            });
        }

        $scope.lock = function() {
            var time = prompt("Input Seconds:");
            console.log("time=" + time);
            if (time == 0) {
                $http.post('tv/' + $scope.epn +'/lock').success(function () {
                    $scope.lockButton = 'Unlock';
                    $scope.isLocked = true;
                    //console.log($scope.screenSrc);
                   // $scope.screenSrcResume = $scope.screenSrc;
                    //console.log($scope.screenSrcResume);
                    //$scope.screenSrc = 'img/lock.jpg';
                    //console.log($scope.screenSrc);

                    //$scope.$apply();
                });
            }
            else {
                //<timer interval="1000" autostart="false" countdown="0" finish-callback="callbackTimer.finished()"></timer>
                $scope.addCountdown(time);
            }
        }

        $scope.onTimeout = function() {
            $scope.cd -- ;
            $scope.cdS = Math.ceil($scope.cd / 10);
            if ($scope.cd > 0) $timeout($scope.onTimeout, 100);
            else {
                $http.post('tv/' + $scope.epn + '/lock').success(function () {
                    $scope.lockButton = 'Unlock';
                    //$scope.screenSrcResume = $scope.screenSrc;
                    //$scope.screenSrc = 'img/lock.jpg';
                    $scope.isLocked = true;
                });
            }
        }

        $scope.addCountdown = function (time) {
            console.log("addCountdown");
            $scope.cd = time*10;
            $scope.cdS = time;
            $scope.mTimeS = time;
            $scope.mTime = time*10;
            $timeout($scope.onTimeout, 100);


            /*$scope.$broadcast('timer-add-cd-seconds', time);
            $scope.callbackTimer = {};
            $scope.callbackTimer.maxTimer = time;
            $scope.callbackTimer.finished = function () {
                $http.post('tv/' + $scope.epn + '/lock').success(function () {
                    $scope.lockButton = 'Unlock';
                    $scope.screenSrcResume = $scope.screenSrc;
                    $scope.screenSrc = 'img/lock.jpg';
                    console.log($scope.screenSrcResume);
                    console.log($scope.screenSrc);
                    //$scope.$apply();
                })
            };

            $scope.$on('timer-tick', function (event, args) {

            });*/

        }

        $scope.unlock = function() {
            $http.delete('tv/' + $scope.epn +'/lock').success(function () {
                $scope.lockButton = 'Lock';
                $scope.screenSrc = 'img/' + $scope.currentRecord.channelID + '.jpg';
                //$scope.screenSrc = $scope.screenSrcResume;
                $scope.isLocked = false;
            })
        }

        $scope.pullLatestRecord = function() {
            console.log("pullLatestRecord");
            var serverUrl = "http://localhost:8082";
            $http.get('/tv/' + $scope.epn +'/records/current').success(function(record) {
                console.log(record);
                if (!$scope.currentRecord || $scope.currentRecord.channelID != record.channelID) {
                    if ($scope.currentRecord) $scope.currentRecord.endTime = record.startTime;
                    $scope.currentRecord = record;
                    if (!$scope.records) $scope.records = [];
                    $scope.records.push(record);
                    $scope.screenSrc = 'img/' + record.channelID +'.jpg';
                    $scope.channelName = record.channelName;
                }
            })
        }

        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            if (angular.isDefined($scope.refreshRecords))
                $interval.cancel($scope.refreshRecords);
            $scope.refreshRecords = undefined;
        });

        $scope.createChart1 = function() {
            $(function() {
                $('#channelChart').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Channel Statistics'
                    },
                    subtitle: {
                        text: 'Source: Smart Home'
                    },
                    xAxis: {
                        type:'category',
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Time (seconds)'
                        }
                    },

                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Channel Watching Time',
                        data : $scope.channels

                    }]
                });

                $('#timeChart').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Watching Time Statistics'
                    },
                    subtitle: {
                        text: 'Source: Smart Home'
                    },
                    xAxis: {
                        type:'category',
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Time (seconds)'
                        }
                    },

                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Watching Time',
                        data : $scope.timeRecords

                    }]
                });
            })

        }

        $scope.createChart2 = function() {

        }

        $scope.loadRecords();

    }])