package com.condoncorp.photo_king_backend.config;

import com.condoncorp.photo_king_backend.service.CustomUserDetailsService;
import com.condoncorp.photo_king_backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationEventPublisher;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.authorization.SpringAuthorizationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.messaging.access.intercept.AuthorizationChannelInterceptor;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.security.messaging.context.AuthenticationPrincipalArgumentResolver;
import org.springframework.security.messaging.context.SecurityContextChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;


/**
 * Following the section 'Disable CSRF within WebSockets' at this link:
 * https://docs.spring.io/spring-security/reference/servlet/integrations/websocket.html
 */
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ApplicationContext applicationContext;
    private final AuthorizationManager<Message<?>> authorizationManager;
    private final JwtChannelInterceptor jwtChannelInterceptor;

    public WebSocketConfig(JwtChannelInterceptor jwtChannelInterceptor, ApplicationContext applicationContext, AuthorizationManager<Message<?>> authorizationManager) {
        this.applicationContext = applicationContext;
        this.authorizationManager = authorizationManager;
        this.jwtChannelInterceptor = jwtChannelInterceptor;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        AuthorizationChannelInterceptor authz = new AuthorizationChannelInterceptor(authorizationManager);
        AuthorizationEventPublisher publisher = new SpringAuthorizationEventPublisher(applicationContext);
        authz.setAuthorizationEventPublisher(publisher);
        registration.interceptors(jwtChannelInterceptor, new SecurityContextChannelInterceptor(), authz);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket").setAllowedOriginPatterns("*");
    }
}
