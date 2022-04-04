package kr.giljabi.api.response;

import kr.giljabi.api.utils.ErrorCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class Response {
    private int status;
    private String message;
    private Object data;

    /**
     * 정상 응답에서 사용
     * @param data
     */
    public Response(Object data) {
        this.status = ErrorCode.STATUS_SUCCESS.getStatus();
        this.message = ErrorCode.STATUS_SUCCESS.getMessage();
        this.data = data;
    }

    /**
     * 에러응답에서 사용
     * @param status
     * @param message
     */
    public Response(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public Response(ErrorCode errorCode) {
        this.status = errorCode.getStatus();
        this.message = errorCode.getMessage();
    }

}
