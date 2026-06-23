/**
 * Re-export the canonical User model from the auth module.
 * This avoids duplicate model registration in Mongoose while
 * allowing the user module to import from its own path.
 */
export { default } from "../auth/user.model.js";
