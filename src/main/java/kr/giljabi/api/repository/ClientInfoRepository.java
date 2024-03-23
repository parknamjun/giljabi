package kr.giljabi.api.repository;

import kr.giljabi.api.entity.ClientInfo;
//import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientInfoRepository /*extends JpaRepository<ClientInfo, String>*/ {
    ClientInfo findByClientIp(String clientIp);

}

