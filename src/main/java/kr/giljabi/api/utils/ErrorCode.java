package kr.giljabi.api.utils;

import lombok.Getter;

@Getter
public enum ErrorCode {
    STATUS_SUCCESS(0, "정상 처리 되었습니다."),
    STATUS_FAILURE(-1, "알 수 없는 장애가 발생하였습니다."),
    STATUS_EXCEPTION(-2, ""),   //예외 메세지를 사용
    EMPTY_TOKEN(-3, "토큰이 없습니다.");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }

}