export const ForLead = (columns, user, title) => {
  const data = [
    {
      user: user?._id,
      name: "Lead",
      columns: [
        { arrange: 2, name: "score.score", show: true },
        { arrange: 9, name: "percentile", show: true },
        { arrange: 12, name: "email", show: true },
        { arrange: 13, name: "info.mobile", show: true },
        { arrange: 15, name: "industryType.name", show: true },
        { arrange: 17, name: "info.address", show: true },
        { arrange: 18, name: "info.city", show: true },
        { arrange: 19, name: "info.state", show: true },
        { arrange: 20, name: "info.country", show: true },
        { arrange: 21, name: "info.source", show: true },
        { arrange: 22, name: "createdAt", show: true },
        { arrange: 25, name: "status.name", show: true },
        { arrange: 29, name: "updatedAt", show: true },

        { arrange: 34, name: "leadValue", show: true },
        { arrange: 35, name: "leadWeight", show: true },
      ],
    },
    {
      user: user?._id,
      name: "Deal",
      columns: [
        { arrange: 1, name: "dealType", show: true },
        { arrange: 2, name: "dealStages", show: true },
        { arrange: 3, name: "currencyType", show: true },
        { arrange: 4, name: "dealValue", show: true },
        { arrange: 5, name: "lead.leadValue", show: true },
        { arrange: 8, name: "lead.email", show: true },
        { arrange: 9, name: "info.mobile", show: true },
        { arrange: 10, name: "info.address", show: true },
        { arrange: 11, name: "info.city", show: true },
        { arrange: 13, name: "info.source", show: true },
        { arrange: 14, name: "createdAt", show: true },
        { arrange: 15, name: "updatedAt", show: true },
      ],
    },
  ];
  return (
    columns?.filter((item) => item.name === title)[0] ||
    data.filter((item) => item.name === title)[0]
  );
};
