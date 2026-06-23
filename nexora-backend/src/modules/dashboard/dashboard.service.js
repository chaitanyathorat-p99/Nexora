import * as DashboardRepo from "./dashboard.repository.js";

export const getDashboardSummary = async (user) => {
  const rawData = await DashboardRepo.getAggregatedStats(user);

  const { totalDeals, wonDeals } = rawData.financials;

  const winRate =
    totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(2) : "0.00";

  return {
    ...rawData,
    metrics: {
      winRate: `${winRate}%`,
      avgDealValue:
        totalDeals > 0
          ? (rawData.financials.totalRevenue / (wonDeals || 1)).toFixed(2)
          : 0,
    },
  };
};
