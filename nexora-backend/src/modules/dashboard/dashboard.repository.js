import Deal from "../deal/deal.model.js";
import Lead from "../lead/lead.model.js";
import Task from "../task/task.model.js";
import mongoose from "mongoose";
import { getDashboardScope } from "../../config/permissions.js";

/**
 * Build a $match stage based on the user's dashboard scope.
 *
 *   global   (super_admin) — no filter, sees all org data
 *   team     (admin)       — no ownership filter, sees all records
 *                            (can be extended to filter by department later)
 *   personal (employee)    — only records assigned to or created by the user
 */
const buildOwnershipMatch = (user) => {
  const scope = getDashboardScope(user.role);

  if (scope === "personal") {
    const userId = new mongoose.Types.ObjectId(user._id);
    return {
      $or: [
        { assignedTo: userId },
        { createdBy: userId },
      ],
    };
  }

  // "global" and "team" — no row-level filter
  return {};
};

export const getAggregatedStats = async (user) => {
  const ownershipMatch = buildOwnershipMatch(user);

  const dealPipeline = [
    ...(Object.keys(ownershipMatch).length ? [{ $match: ownershipMatch }] : []),
    {
      $facet: {
        financials: [
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $cond: [{ $eq: ["$dealStages", "Won"] }, "$dealValue", 0],
                },
              },
              pipelineValue: {
                $sum: {
                  $cond: [
                    { $not: { $in: ["$dealStages", ["Won", "Lost"]] } },
                    "$dealValue",
                    0,
                  ],
                },
              },
              totalDeals: { $sum: 1 },
              wonDeals: {
                $sum: {
                  $cond: [{ $eq: ["$dealStages", "Won"] }, 1, 0],
                },
              },
            },
          },
        ],
        dealStages: [{ $group: { _id: "$dealStages", count: { $sum: 1 } } }],
      },
    },
  ];

  const stats = await Deal.aggregate(dealPipeline);

  const leadMatch = Object.keys(ownershipMatch).length
    ? [{ $match: ownershipMatch }]
    : [];

  const leadCounts = await Lead.aggregate([
    ...leadMatch,
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const taskMatch =
    getDashboardScope(user.role) === "personal"
      ? [
          {
            $match: {
              $or: [
                { assignedTo: new mongoose.Types.ObjectId(user._id) },
                { createdBy: new mongoose.Types.ObjectId(user._id) },
              ],
            },
          },
        ]
      : [];

  const taskCounts = await Task.aggregate([
    ...taskMatch,
    { $group: { _id: "$taskStages", count: { $sum: 1 } } },
  ]);

  return {
    financials: stats[0]?.financials[0] || {
      totalRevenue: 0,
      pipelineValue: 0,
      totalDeals: 0,
      wonDeals: 0,
    },
    dealStages: stats[0]?.dealStages || [],
    leadStatus: leadCounts,
    taskStages: taskCounts,
  };
};
