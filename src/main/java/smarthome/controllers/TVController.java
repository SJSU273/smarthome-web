package smarthome.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import smarthome.models.ServerTvWatchRecord;
import smarthome.repositories.ServerTvWatchRecordRepository;

import java.util.List;

/**
 * Created by yellowstar on 7/28/15.
 */
@RestController
public class TVController {
    private String serverUrl = "http://localhost:8081";
    private int id = 10;
    private RestTemplate restTemplate = new RestTemplate();
    @Autowired
    ServerTvWatchRecordRepository serverTvWatchRecordRepository;
    @RequestMapping(value="tv/{epn}/records", method= RequestMethod.GET)
    public List<ServerTvWatchRecord> getRecords(@PathVariable("epn") String endpointClientName) {
        return serverTvWatchRecordRepository.findByEPN(endpointClientName);
    }

    @RequestMapping(value="tv/records", method= RequestMethod.GET)
    public List<ServerTvWatchRecord> getAllRecords() {
        return serverTvWatchRecordRepository.findAll();
    }

    @RequestMapping(value="tv/{epn}/observe", method=RequestMethod.POST)
    public String observe(@PathVariable("epn") String epn) {
        String request = serverUrl + "/tv/" + id + "/observe";
        String response = restTemplate.postForObject(request, null, String.class);
        return response;
    }

    @RequestMapping(value="tv/{epn}/observe", method=RequestMethod.DELETE)
    public void cancelObserve(@PathVariable("epn") String epn) {
        System.out.println("Delete observe call");
        String request = serverUrl + "/tv/" + id + "/observe";
        restTemplate.delete(request);
        return;
    }

    @RequestMapping(value="tv/{epn}/lock", method=RequestMethod.POST)
    public String lock(@PathVariable("epn") String epn) {
        String request = serverUrl + "/tv/" + id + "/lock";
        String response = restTemplate.postForObject(request, null, String.class);
        return response;
    }

    @RequestMapping(value="tv/{epn}/lock", method=RequestMethod.DELETE)
    public void unlock(@PathVariable("epn") String epn) {
        String request = serverUrl + "/tv/" + id + "/lock";
        restTemplate.delete(request);
        return;
    }

    @RequestMapping(value="tv/{epn}/records/current", method=RequestMethod.GET)
    public ServerTvWatchRecord getCurrentRecord(@PathVariable("epn") String epn) {
        String request = "http://localhost:8082/tv/" + epn + "/records/current";
        return restTemplate.getForObject(request,ServerTvWatchRecord.class);
    }
}
