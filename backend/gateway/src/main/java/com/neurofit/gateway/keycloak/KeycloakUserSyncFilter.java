package com.neurofit.gateway.keycloak;

import com.neurofit.gateway.dto.RegisterRequest;
import com.neurofit.gateway.service.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(KeycloakUserSyncFilter.class);

    @Override
    public @NonNull Mono<Void> filter(
            @NonNull ServerWebExchange serverWebExchange,
            @NonNull WebFilterChain webFilterChain) {

        String userId = serverWebExchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = serverWebExchange.getRequest().getHeaders().getFirst("Authorization");

        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null && registerRequest != null) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if (!exist) {
                            // register user
                            if (registerRequest != null) {
                                return userService.registerUser(registerRequest)
                                        .then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exist, skipping sync.");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = serverWebExchange.getRequest().mutate()
                                .header("X-User_ID", finalUserId)
                                .build();
                        return webFilterChain.filter(serverWebExchange.mutate().request(mutatedRequest).build());
                    }));

        }
        return webFilterChain.filter(serverWebExchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();

            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claimsSet.getStringClaim("email"));
            registerRequest.setKeycloakId(claimsSet.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claimsSet.getStringClaim("given_name"));
            registerRequest.setLastName(claimsSet.getStringClaim("family_name"));

            return registerRequest;

        } catch (Exception e) {
            logger.error("Failed to parse JWT for user extraction (token redacted)", e);
            return null;
        }
    }
}
