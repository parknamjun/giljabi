package kr.giljabi.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .requestMatchers(request -> "127.0.0.1".equals(request.getRemoteAddr()) || "::1".equals(request.getRemoteAddr()))
                .permitAll()
                .anyRequest().authenticated()
                .and()
                .csrf().disable();
    }
}