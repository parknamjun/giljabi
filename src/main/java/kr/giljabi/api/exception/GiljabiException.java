package kr.giljabi.api.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
public class GiljabiException extends RuntimeException {
    private String code;

    private String message;

    public GiljabiException() {
    }

    public GiljabiException(String code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public GiljabiException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }


}
