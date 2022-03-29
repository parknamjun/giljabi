package kr.giljabi.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

/**
 * request, response 로그
 * @author eahn.park@gmail.com
 * @date 2022.03.29
 *
 */
@Aspect
@Component
@Slf4j
public class LoggerAspect {

    @Pointcut("within(kr.giljabi.api.controller..*)")
    public void loggerPointCut() {
    }

    @Around("loggerPointCut()")
    public Object methodLogger(ProceedingJoinPoint pjp) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        String controllerName = pjp.getSignature().getDeclaringType().getSimpleName();
        String methodName = pjp.getSignature().getName();

        long startAt = System.currentTimeMillis();

        log.info("===== REQUEST Start Request URL : {} ===========================", request.getRequestURI());
        log.info("Controller : {}", controllerName);
        log.info("method : {}", methodName);
        //log.info("Request URL : {}", request.getRequestURI());
        log.info("Http Method : {}", request.getMethod());
        log.info("params : {}", getParams(request));
        log.info("===== REQUEST End Request URL : {} ===========================", request.getRequestURI());

        Object result = pjp.proceed();

        ObjectMapper objectMapper = new ObjectMapper();
        String resultJson = objectMapper.writeValueAsString(result);

        long endAt = System.currentTimeMillis();

        log.info("===== RESPONSE Start Request URL : {} ===========================", request.getRequestURI());
        log.info("Response : {}", resultJson);
        log.info("Time Required : {}ms", endAt - startAt);
        log.info("===== RESPONSE End Request URL : {} ===========================", request.getRequestURI());

        return result;
    }

    /**
     * request 에 담긴 정보를 JSONObject 형태로 반환한다.
     * @return JSONObject
     */
    private static String getParams(HttpServletRequest request) {
        JSONObject jsonObject = new JSONObject();

        Enumeration<String> params = request.getParameterNames();

        while (params.hasMoreElements()) {
            String param = params.nextElement();
            jsonObject.put(param, request.getParameter(param));
        }

        return jsonObject.toString()
                .replace("\\", "")
                .replace("\"[", "[")
                .replace("]\"", "]");
    }

}

