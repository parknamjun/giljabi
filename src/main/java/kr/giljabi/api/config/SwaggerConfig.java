package kr.giljabi.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import java.util.ArrayList;
import java.util.List;


//@Profile({"local"})
@Configuration
@EnableSwagger2
public class SwaggerConfig {

  @Bean
  public Docket api() {
    /*
    List<Parameter> global = new ArrayList();
    global.add(new ParameterBuilder().name("Authorization").
        description("Access Token ex) Bearer ${token}").parameterType("header").
        required(false).modelRef(new ModelRef("string")).build());
*/
    return new Docket(DocumentationType.SWAGGER_2)
        //.globalOperationParameters(global)
        .select()
        .apis(RequestHandlerSelectors.any())
        .paths(PathSelectors.ant("/api/**"))
        .build().apiInfo(ApiInfoBuilder());
  }

  private ApiInfo ApiInfoBuilder() {
    return new ApiInfoBuilder()
            .title("길잡이 ")
            .description("API 상세소개 및 사용법 등")
            .version("1.0")
            .build();
  }
}
