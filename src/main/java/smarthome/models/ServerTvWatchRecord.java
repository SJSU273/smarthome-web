package smarthome.models;

import java.util.Date;

/**
 * Created by yellowstar on 7/28/15.
 */
public class ServerTvWatchRecord {
    private String id; //Used by MongoDB

    //New add: EPN identify different TV client
    private String EPN;

    //The below is same as TVChannelObject
    private int thisObjectID; //
    private int thisObjectInstanceID; // Multiple = 0...n


    private int channelID;
    private String channelName;
    private Date startTime;
    private Date endTime;

    public ServerTvWatchRecord() {
    }

    public ServerTvWatchRecord(String id, int thisObjectInstanceID, int channelID, String channelName, Date startTime, Date endTime, String EPN) {
        this.id = id;
        this.thisObjectInstanceID = thisObjectInstanceID;
        this.channelID = channelID;
        this.channelName = channelName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.EPN = EPN;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setThisObjectID(int thisObjectID) {
        this.thisObjectID = thisObjectID;
    }

    public int getThisObjectID() {
        return thisObjectID;
    }

    public int getThisObjectInstanceID() {
        return thisObjectInstanceID;
    }

    public void setThisObjectInstanceID(int thisObjectInstanceID) {
        this.thisObjectInstanceID = thisObjectInstanceID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getEPN() {
        return EPN;
    }

    public void setEPN(String EPN) {
        this.EPN = EPN;
    }

    @Override
    public String toString() {
        return "ServerTvWatchRecord{" +
                "id='" + id + '\'' +
                ", EPN='" + EPN + '\'' +
                ", thisObjectID=" + thisObjectID +
                ", thisObjectInstanceID=" + thisObjectInstanceID +
                ", channelID=" + channelID +
                ", channelName='" + channelName + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
