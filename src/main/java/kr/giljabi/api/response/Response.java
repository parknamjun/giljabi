package kr.giljabi.api.response;

import kr.giljabi.api.exception.GiljabiException;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Response {
    private static final short STATUS_SUCCESS = 200;
    private static final short STATUS_FAILURE = -1;

    private final short status;
    private final String code;

    private String message;
    private Object data;

    private Response(short status, String code) {
        this.status = status;
        this.code = code;
    }

    private Response(short status, String code, String message) {
        this(status, code);
        this.message = message;
    }

    public static Response of() {
        return new Response(STATUS_SUCCESS, "OK");
    }

    public static Response of(GiljabiException e) {
        return new Response(STATUS_FAILURE, e.getCode(), e.getMessage());
    }

    public static Response of(Exception e) {
        return new Response(STATUS_FAILURE, "S999", "시스템 오류입니다.");
    }
}
