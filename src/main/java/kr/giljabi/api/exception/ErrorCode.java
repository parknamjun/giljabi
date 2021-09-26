package kr.giljabi.api.exception;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum ErrorCode {
    OPENROUTESERVICE_ERROR("E001", "OPENROUTESERVICE에서 오류가 발생하였습니다.")
    ;

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
