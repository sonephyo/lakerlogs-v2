package auth.resource;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.Arrays;

import org.bson.Document;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import auth.service.AuthService;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Explicitly enabled, self-service role switching for allowlisted development accounts. */
@Path("/auth/dev/role")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
public class DevRoleResource {
    static final Set<String> ROLES = Set.of("student", "instructor", "co-instructor");

    @Inject @ConfigProperty(name = "dev.role.switch.enabled", defaultValue = "false")
    boolean enabled;

    @Inject @ConfigProperty(name = "dev.role.switch.emails")
    Optional<String> emails;

    @Inject @ConfigProperty(name = "dev.role.switch.origin", defaultValue = "http://localhost:3000")
    String allowedOrigin;

    @Inject
    AuthService authService;

    @Inject
    AuthResource authResource;

    private Response error(int status, String message) {
        return Response.status(status).entity(Map.of("message", message))
            .header("Cache-Control", "no-store").build();
    }

    static boolean isAllowedEmail(Optional<String> emails, String email) {
        return email != null && Arrays.stream(emails.orElse("").split(","))
            .map(String::trim).filter(value -> !value.isEmpty())
            .anyMatch(value -> value.equalsIgnoreCase(email));
    }

    private Document currentUser(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new SecurityException("Sign in before using development tools.");
        }
        Document session = authService.validateRefreshToken(refreshToken);
        String email = session.getString("email");
        if (!isAllowedEmail(emails, email)) {
            throw new SecurityException("This account is not allowed to use development tools.");
        }
        Document user = authService.getUserByEmail(email);
        if (user == null) throw new SecurityException("Account no longer exists.");
        return user;
    }

    @GET
    public Response availability(@CookieParam("refresh_token") String refreshToken) {
        if (!enabled) return error(404, "Development role switching is disabled.");
        try {
            Document user = currentUser(refreshToken);
            return Response.ok(Map.of("role", user.getString("role")))
                .header("Cache-Control", "no-store").build();
        } catch (SecurityException e) {
            return error(403, e.getMessage());
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response switchRole(Map<String, String> body,
            @CookieParam("refresh_token") String refreshToken,
            @HeaderParam("Origin") String origin) {
        if (!enabled) return error(404, "Development role switching is disabled.");
        // Require the configured browser origin even when a valid cookie is present.
        if (allowedOrigin == null || !allowedOrigin.equals(origin)) {
            return error(403, "Development tools require the configured local origin.");
        }
        String role = body == null ? null : body.get("role");
        if (role == null || !ROLES.contains(role)) return error(400, "Choose a valid role.");
        try {
            Document user = currentUser(refreshToken);
            authService.changeDevelopmentRole(user.getString("email"), role);
            // Reuse the normal token issuer and rotate the refresh cookie.
            return Response.fromResponse(authResource.refresh(refreshToken))
                .header("Cache-Control", "no-store").build();
        } catch (SecurityException e) {
            return error(403, e.getMessage());
        }
    }
}
