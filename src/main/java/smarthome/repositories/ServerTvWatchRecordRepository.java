package smarthome.repositories;

import smarthome.models.ServerTvWatchRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ServerTvWatchRecordRepository extends MongoRepository<ServerTvWatchRecord, String> {
    List<ServerTvWatchRecord> findByEPN(String epn);
    List<ServerTvWatchRecord> findAll();
}