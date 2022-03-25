--사용정보
create table api_call_info (
   id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
   api_code varchar(16),
   profile_code varchar(16),
   at_lat double not null,
   at_lng double not null,
   to_lat double not null,
   to_lng double not null,
   ascent int not null,
   descent int not null,
   distance int not null,
   duration int not null,
   request_count int not null,
   track_count int not null,
   create_by varchar(32),
   create_date timestamp,
   last_modified_by varchar(32),
   last_modified_date timestamp,
   primary key (id)
);

--사용자 정보, 로그인이 없으므로 IP를 사용
create table client_info (
    client_ip varchar(32) not null,
    api_code varchar(16),
    profile_code varchar(16),
    accumulate_count int not null,
    accumulate_distance int not null,
    create_by varchar(32),
    create_date timestamp,
    last_modified_by varchar(32),
    last_modified_date timestamp,
    primary key (client_ip)
);