
/**
 * Routes that don't require authentication to access.
 */
export const publicRoutes = ["/"];

/**
 * Routes used for authentication
 */
export const authRoutes = ["/"];

/**
 * Prefix for api calls used for authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Route to redirect to once logged in
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const DEFAULT_LOGOUT_REDIRECT = "/";
