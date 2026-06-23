import { mockLeads } from "./leads";
import { mockDeals } from "./deals";
import { mockTasks } from "./tasks";
import { mockEmployees } from "./employees";
import { mockProducts } from "./products";
import { mockTickets } from "./tickets";
import { mockCalls } from "./calls";
import { mockLeadStatuses } from "./leadStatuses";
import { mockMeetings } from "./meetings";
import { mockUserRoles } from "./userRoles";
import { mockIndustryTypes } from "./industryTypes";
import { mockTypeOfBuyers } from "./typeOfBuyers";
import { mockProductTypes } from "./productTypes";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

const state = {
  leads: deepClone(mockLeads),
  deals: deepClone(mockDeals),
  tasks: deepClone(mockTasks),
  users: deepClone(mockEmployees),
  products: deepClone(mockProducts),
  tickets: deepClone(mockTickets),
  leadStatuses: deepClone(mockLeadStatuses),

  // Lightweight placeholders for other modules
  notes: [],
  ratings: [],
  companies: [],
  companyMasters: [],
  quotations: [],
  meetings: deepClone(mockMeetings),
  calls: deepClone(mockCalls),
  userRoles: deepClone(mockUserRoles),
  industryTypes: deepClone(mockIndustryTypes),
  typeOfBuyers: deepClone(mockTypeOfBuyers),
  productTypes: deepClone(mockProductTypes),
  plans: [],
  subscriptions: [],
  featuresMaster: [],
  limits: [],
  enquiries: [],
  dynamicFields: [],
  emailTemplates: [],
  columns: [],

  // Non-RTK modules
  emailTokens: [],

  // AI agent
  aiSessions: [],
};

export const mockDb = {
  getState() {
    return state;
  },

  list(collection) {
    return state[collection] ? [...state[collection]] : [];
  },

  findById(collection, id) {
    const items = state[collection] || [];
    return items.find((x) => x?._id === id || x?.id === id) || null;
  },

  create(collection, payload, { idPrefix } = {}) {
    const items = state[collection];
    if (!Array.isArray(items)) throw new Error(`Unknown collection: ${collection}`);

    const newItem = {
      _id: payload?._id || makeId(idPrefix || collection.slice(0, -1)),
      ...payload,
      createdAt: payload?.createdAt || nowIso(),
      updatedAt: payload?.updatedAt || nowIso(),
    };

    items.unshift(newItem);
    return newItem;
  },

  update(collection, id, patch) {
    const items = state[collection];
    if (!Array.isArray(items)) throw new Error(`Unknown collection: ${collection}`);

    const idx = items.findIndex((x) => x?._id === id);
    if (idx === -1) return null;

    items[idx] = { ...items[idx], ...patch, _id: items[idx]._id, updatedAt: nowIso() };
    return items[idx];
  },

  remove(collection, id) {
    const items = state[collection];
    if (!Array.isArray(items)) throw new Error(`Unknown collection: ${collection}`);

    const idx = items.findIndex((x) => x?._id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    return true;
  },
};
