package kr.giljabi.api.exception;

import kr.giljabi.api.utils.ErrorCode;
import lombok.Getter;

@Getter
public class GiljabiException extends Exception {
    private int status;
    private String message;

    public GiljabiException(String message) {
        super();
        this.status = ErrorCode.STATUS_EXCEPTION.getStatus();
        this.message = message;
    }
    public GiljabiException(int status, String message) {
        super();
        this.status = status;
        this.message = message;
    }
}
