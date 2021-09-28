package kr.giljabi.api.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
public class GiljabiException extends RuntimeException {
    private int status;
    private String code;
    private String message;

    public GiljabiException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public GiljabiException(int status, ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.status = status;
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }
}
