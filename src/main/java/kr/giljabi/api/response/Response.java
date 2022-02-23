package kr.giljabi.api.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Response {
    private static final short STATUS_SUCCESS = 200;
    private static final short STATUS_FAILURE = -1;

    private short status;
    private String message;
    private Object data;

    public Response(short status, String message) {
        this.status = status;
        this.message = message;
    }

    public static Response of() {
        return new Response(STATUS_SUCCESS, "정상 처리 되었습니다.");
    }

    public static Response of(Exception e) {
        return new Response(STATUS_FAILURE, e.getMessage());
    }

    public Response addObject(Object data) {
        this.data = data;
        return this;
    }

}
