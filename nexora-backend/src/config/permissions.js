/**
 * Centralized RBAC Permission Registry
 *
 * Format: "resource:action"
 * Special: "*" means full unrestricted access
 *
 * Ownership-scoped permissions use the "_own" suffix.
 * These are enforced at the service/controller layer via row-level filtering.
 *
 * Module Access Matrix (from requirements):
 * ┌──────────────┬─────────────┬──────────────────┬──────────────────┐
 * │ Module       │ Super Admin │ Admin            │ Employee         │
 * ├──────────────┼─────────────┼──────────────────┼──────────────────┤
 * │ Users        │ Full        │ Employee-only    │ Self-only        │
 * │ Leads        │ Full        │ Full             │ Assigned only    │
 * │ Deals        │ Full        │ Full             │ Assigned only    │
 * │ Tasks        │ Full        │ Full             │ Assigned only    │
 * │ Meetings     │ Full        │ Full             │ Own only         │
 * │ Calls        │ Full        │ Full             │ Own only         │
 * │ Tickets      │ Full        │ Full             │ Own only         │
 * │ Products     │ Full        │ Full             │ Read/limited     │
 * │ Settings     │ Full        │ Limited (no del) │ No access        │
 * │ Dashboard    │ Global      │ Team             │ Personal         │
 * │ Audit Logs   │ Yes         │ No               │ No               │
 * │ Security Logs│ Yes         │ No               │ No               │
 * │ RBAC Config  │ Yes         │ No               │ No               │
 * └──────────────┴─────────────┴──────────────────┴──────────────────┘
 */

export const PERMISSIONS = {
  // ─── Super Admin ──────────────────────────────────────────────────────────
  // Wildcard grants access to every permission check, including audit logs,
  // security logs, and RBAC config which are super_admin-exclusive.
  super_admin: ["*"],

  // ─── Admin ────────────────────────────────────────────────────────────────
  admin: [
    // Users — employee-only management (cannot touch super_admin accounts)
    "user:create_employee",
    "user:read",
    "user:update_employee",
    "user:deactivate_employee",

    // Leads — full access
    "lead:create",
    "lead:read",
    "lead:update",
    "lead:delete",
    "lead:assign",

    // Deals — full access
    "deal:create",
    "deal:read",
    "deal:update",
    "deal:delete",
    "deal:update_stage",

    // Tasks — full access
    "task:create",
    "task:read",
    "task:update",
    "task:delete",
    "task:assign",

    // Meetings — full access
    "meeting:create",
    "meeting:read",
    "meeting:update",
    "meeting:delete",

    // Calls — full access
    "call:create",
    "call:read",
    "call:update",
    "call:delete",

    // Tickets — full access
    "ticket:create",
    "ticket:read",
    "ticket:update",
    "ticket:delete",
    "ticket:reassign",

    // Products — full access
    "product:create",
    "product:read",
    "product:update",
    "product:delete",

    // Settings — limited (read/create/update only; no system-level delete)
    "settings:read",
    "settings:create",
    "settings:update",
    // NOTE: "settings:delete" is intentionally omitted — super_admin only

    // Dashboard — team-level view
    "dashboard:team",

    // Chatbot
    "chatbot:access",

    // Audit/Security logs and RBAC config — super_admin only (not listed here)
  ],

  // ─── Employee ─────────────────────────────────────────────────────────────
  employee: [
    // Users — self-only (read/update own profile; enforced in service layer)
    "user:read_own",
    "user:update_own",

    // Leads — assigned only (row-level enforced in service layer)
    "lead:create",
    "lead:read_own",
    "lead:update_own",

    // Deals — assigned only
    "deal:read_own",
    "deal:update_stage_own",

    // Tasks — assigned only
    "task:read_own",
    "task:update_own",
    "task:toggle_subtask_own",

    // Meetings — own only
    "meeting:create",
    "meeting:read_own",
    "meeting:update_own",

    // Calls — own only
    "call:create",
    "call:read_own",
    "call:update_own",

    // Tickets — own only
    "ticket:create",
    "ticket:read_own",
    "ticket:update_own",

    // Products — read only (limited access)
    "product:read",

    // Settings — no access (not listed)
    // NOTE: employees cannot read or write settings

    // Dashboard — personal only
    "dashboard:personal",

    // Chatbot
    "chatbot:access",
  ],
};

/**
 * Check whether a role has a given permission.
 * Super admin always returns true.
 *
 * Matching rules (in order):
 *   1. Wildcard "*"        — full access (super_admin)
 *   2. Exact match         — "lead:update"
 *   3. Own variant         — "lead:update_own" satisfies a check for "lead:update"
 *      (ownership is enforced separately at the service layer)
 *   4. Dashboard hierarchy — "dashboard:team" satisfies "dashboard:personal"
 *      (higher-scope dashboard access implies lower-scope access)
 *
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  if (rolePerms.includes("*")) return true;
  if (rolePerms.includes(permission)) return true;

  // Allow "_own" variant to satisfy the base permission check.
  // The actual ownership enforcement happens in the service layer.
  const ownVariant = `${permission}_own`;
  if (rolePerms.includes(ownVariant)) return true;

  // Dashboard scope hierarchy: global > team > personal
  // A role with a higher-scope dashboard permission can access lower scopes.
  const dashboardHierarchy = ["dashboard:global", "dashboard:team", "dashboard:personal"];
  const permIndex = dashboardHierarchy.indexOf(permission);
  if (permIndex !== -1) {
    // Check if the role has any dashboard permission with equal or higher scope
    return dashboardHierarchy
      .slice(0, permIndex + 1)
      .some((p) => rolePerms.includes(p));
  }

  return false;
};

/**
 * Role hierarchy levels (higher = more authority).
 * Used for preventing privilege escalation.
 */
export const ROLE_HIERARCHY = {
  super_admin: 3,
  admin: 2,
  employee: 1,
};

/**
 * Returns true if actorRole has strictly higher authority than targetRole.
 */
export const isHigherRole = (actorRole, targetRole) => {
  return (ROLE_HIERARCHY[actorRole] || 0) > (ROLE_HIERARCHY[targetRole] || 0);
};

/**
 * Returns the dashboard scope for a given role.
 *   super_admin → "global"  (all data across the org)
 *   admin       → "team"    (all data within their team/org, no personal filter)
 *   employee    → "personal" (only their own records)
 *
 * Used by the dashboard service/repository to apply the correct data filter.
 *
 * @param {string} role
 * @returns {"global"|"team"|"personal"}
 */
export const getDashboardScope = (role) => {
  if (role === "super_admin") return "global";
  if (role === "admin") return "team";
  return "personal";
};
