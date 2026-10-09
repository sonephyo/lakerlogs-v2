# Development role switcher

Switch your own signed-in account between student, instructor, and co-instructor from the sidebar while running `npm run dev`. The tool updates the database and returns a new session token, so no MongoDB editing or logout is needed.

## Enable locally

Add these settings to the auth service's local environment, for example `backend/auth/src/main/liberty/config/server.env`:

```dotenv
DEV_ROLE_SWITCH_ENABLED=true
DEV_ROLE_SWITCH_EMAILS=your-account@oswego.edu
DEV_ROLE_SWITCH_ORIGIN=http://localhost:3000
```

Use the actual Google account you sign in with. The email list accepts comma-separated accounts. Restart the auth service after changing its environment. When using another local frontend port, update the origin to match; the auth service's CORS configuration must also allow that address.

No frontend environment flag is needed. The panel appears only in Next.js development mode after the backend confirms that your session is allowlisted. Disabled tools return 404; unapproved accounts cannot use them.

## Use

1. Start the frontend and auth service, then sign in normally.
2. Find **Development role** above the profile/logout controls in the sidebar.
3. Choose a role and select **Switch role**.
4. The app reloads into the student home or instructor dashboard with fresh session data.

The role changes persist in the connected database. Existing class membership, team choices, and class standing remain unchanged. A student still needs class membership, a team, and class standing to use all student screens; this tool does not create those records. An instructor without a class can use the existing class creation flow.

The tool applies the exact selected role, updates the enrolled class roster, and adds or removes the account from the class's instructor list. Switching to student can leave a class without an instructor, so use disposable development data when testing class ownership scenarios.

## Boundaries

The backend defaults to disabled and requires an allowlisted account's valid refresh session. Role changes also require the configured browser origin. Requests never accept an arbitrary target account: they act on the session owner. Keep this configuration in your local environment and leave it disabled on shared or production deployments. Hiding the frontend panel is not the backend access control.

The tool changes roles only. Use existing profile and class screens for team, standing, enrollment, and class dates. If the session refresh fails after a database update, sign in again to pick up the persisted role.
