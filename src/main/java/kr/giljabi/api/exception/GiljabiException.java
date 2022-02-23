package kr.giljabi.api.exception;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public class GiljabiException extends Exception {
    private int status;
    private String message;

    public GiljabiException(int status, String message) {
        super();
        this.status = status;
        this.message = message;
    }
}
