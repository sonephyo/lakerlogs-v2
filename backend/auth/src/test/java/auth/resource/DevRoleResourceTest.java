package auth.resource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class DevRoleResourceTest {
    @Test
    void emptyAllowlistDeniesEveryAccount() {
        assertFalse(DevRoleResource.isAllowedEmail(Optional.empty(), "dev@example.com"));
        assertFalse(DevRoleResource.isAllowedEmail(Optional.of(" , "), "dev@example.com"));
        assertFalse(DevRoleResource.isAllowedEmail(Optional.of("dev@example.com"), null));
    }

    @Test
    void allowlistRequiresAnExactEmailAndHandlesWhitespace() {
        Optional<String> emails = Optional.of(" Dev@Example.com, other@example.com ");
        assertTrue(DevRoleResource.isAllowedEmail(emails, "dev@example.com"));
        assertTrue(DevRoleResource.isAllowedEmail(emails, "other@example.com"));
        assertFalse(DevRoleResource.isAllowedEmail(emails, "example.com"));
        assertFalse(DevRoleResource.isAllowedEmail(emails, "attackerdev@example.com"));
    }

    @Test
    void disabledEndpointsDoNotReachTheDatabase() {
        DevRoleResource resource = new DevRoleResource();
        assertEquals(404, resource.availability("cookie").getStatus());
        assertEquals(404, resource.switchRole(Map.of("role", "instructor"),
            "cookie", "http://localhost:3000").getStatus());
    }

    @Test
    void missingOrForeignOriginCannotMutateRoles() {
        DevRoleResource resource = enabledResource();
        assertEquals(403, resource.switchRole(Map.of("role", "instructor"), "cookie", null).getStatus());
        assertEquals(403, resource.switchRole(Map.of("role", "instructor"),
            "cookie", "https://foreign.example").getStatus());
    }

    @Test
    void invalidRoleAndMissingSessionCannotReachTheDatabase() {
        DevRoleResource resource = enabledResource();
        assertEquals(400, resource.switchRole(Map.of("role", "admin"),
            "cookie", resource.allowedOrigin).getStatus());
        assertEquals(400, resource.switchRole(null, "cookie", resource.allowedOrigin).getStatus());
        assertEquals(403, resource.switchRole(Map.of("role", "instructor"),
            null, resource.allowedOrigin).getStatus());
        assertEquals(403, resource.availability(null).getStatus());
    }

    private DevRoleResource enabledResource() {
        DevRoleResource resource = new DevRoleResource();
        resource.enabled = true;
        resource.allowedOrigin = "http://localhost:3000";
        resource.emails = Optional.of("dev@example.com");
        return resource;
    }
}
