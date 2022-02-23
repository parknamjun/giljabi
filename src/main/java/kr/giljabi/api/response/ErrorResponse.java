package kr.giljabi.api.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    private int status;
    private String code;
    private String message;
    private Object data;

    public ErrorResponse(int status, String code, String message){
        this.status = status;
        this.message = message;
    }

    public static ErrorResponse of(int status, String code, String message) {
        return new ErrorResponse(status, code, message);
    }

}
