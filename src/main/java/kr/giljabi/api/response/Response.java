package kr.giljabi.api.response;

import kr.giljabi.api.exception.ErrorCode;
import kr.giljabi.api.exception.GiljabiException;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Response {
    private static final short STATUS_SUCCESS = 200;
    private static final short STATUS_FAILURE = -1;

    private final short status;

    private String message;
    private Object data;

    private Response(short status) {
        this.status = status;
    }

    private Response(short status, String message) {
        this(status);
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
