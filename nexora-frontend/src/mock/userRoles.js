// Seed user roles for the mocked `/api/user-roles` endpoints.
// The UI expects `name`, `permissions`, and `createdAt`.

const MODULES = [
  "Lead",
  "Meeting",
  "Call",
  "Task",
  "Product",
  "Deal",
  "TICKET",
  "User-Role",
  "System-User",
  "Client-User",
  "Lead-Status",
  "Product-Type",
  "Industry-Type",
  "Type of Buyer",
];

const createPermission = (modelName, read, write, create, update, del, special = false) => ({
  modelName,
  read,
  write,
  create,
  update,
  delete: del,
  special,
});

const fullAccessPermissions = MODULES.map((modelName) =>
  createPermission(
    modelName,
    true,
    true,
    true,
    true,
    true,
    ["Lead", "Meeting", "Call", "Task"].includes(modelName)
  )
);

const companyOwnerPermissions = [
  createPermission("Lead", true, true, true, true, true, true),
  createPermission("Meeting", true, true, true, true, true, true),
  createPermission("Call", true, true, true, true, true, true),
  createPermission("Task", true, true, true, true, true, true),
  createPermission("Product", true, true, true, true, true),
  createPermission("Deal", true, true, true, true, true),
  createPermission("TICKET", true, true, true, true, true),
  createPermission("User-Role", true, true, true, true, false),
  createPermission("System-User", true, true, true, true, false),
  createPermission("Client-User", true, true, true, true, false),
  createPermission("Lead-Status", true, true, true, true, true),
  createPermission("Product-Type", true, true, true, true, true),
  createPermission("Industry-Type", true, true, true, true, true),
  createPermission("Type of Buyer", true, true, true, true, true),
];

const employeePermissions = [
  createPermission("Lead", true, true, true, true, false, true),
  createPermission("Meeting", true, true, true, true, false, true),
  createPermission("Call", true, true, true, true, false, true),
  createPermission("Task", true, true, true, false, false, true),
  createPermission("Deal", true, false, false, true, false),
  createPermission("Product", true, false, false, false, false),
  createPermission("TICKET", true, true, true, true, false),
];

export const mockUserRoles = [
  {
    _id: "role_super_admin",
    name: "SuperAdmin",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    permissions: fullAccessPermissions,
  },
  {
    _id: "role_company_owner",
    name: "CompanyOwnerAdmin",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    permissions: companyOwnerPermissions,
  },
  {
    _id: "role_employee",
    name: "Employee",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    permissions: employeePermissions,
  },
];
