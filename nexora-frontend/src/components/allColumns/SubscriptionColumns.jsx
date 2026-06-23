import React from "react";
import HActionButtons from "../common/HActionButtons";
import { Tag } from "antd";
import { formatDistance } from "date-fns";
import moment from "moment";
import { UserOutlined, TeamOutlined, DollarOutlined, CalendarOutlined, CheckCircleOutlined, ApartmentOutlined, SolutionOutlined } from "@ant-design/icons";

export const SubscriptionColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  user,
  modelName,
  popUp,
  selectLead,
  subscription_page,
  columns,
}) => {
  const defaultColumns = [
    {
      title: <span><SolutionOutlined /> Plan</span>,
      dataIndex: "planName",
      key: "planName",
      width: 150,
      fixed: "left",
      render: (_, record) => {
        return (
          <div className="flex justify-between font-semibold">
            <span>{record?.planName}</span>
          </div>
        );
      },
      sortBy: "planName",
    },
    {
      title: <span><ApartmentOutlined /> Company</span>,
      dataIndex: "company",
      key: "company",
      render: (_, record) => {
        return <div>{record?.company?.name || "-"}</div>;
      },
      width: 150,
    },
    {
      title: <span><UserOutlined /> User</span>,
      dataIndex: "user",
      key: "user",
      render: (_, record) => {
        return <div>{record?.user?.name || "-"}</div>;
      },
      width: 150,
    },
    {
      title: <span><CheckCircleOutlined /> Status</span>,
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const statusColors = {
          trial: "blue",
          active: "green",
          past_due: "orange",
          cancelled: "red",
          expired: "grey",
        };
        
        return (
          <Tag color={statusColors[record?.status] || "default"}>
            {record?.status?.toUpperCase().replace("_", " ")}
          </Tag>
        );
      },
      width: 120,
      sortBy: "status",
    },
    {
      title: <span><CalendarOutlined /> Billing Cycle</span>,
      dataIndex: "billingCycle",
      key: "billingCycle",
      render: (_, record) => (
        <div className="capitalize">{record?.billingCycle || "-"}</div>
      ),
      width: 120,
    },
    {
      title: <span><CalendarOutlined /> Start Date</span>,
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => (
        <div>
          {record?.startDate
            ? moment(record.startDate).format("DD MMM YYYY")
            : "-"}
        </div>
      ),
      width: 120,
    },
    {
      title: <span><CalendarOutlined /> End Date</span>,
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => (
        <div>
          {record?.endDate
            ? moment(record.endDate).format("DD MMM YYYY")
            : "-"}
        </div>
      ),
      width: 120,
    },
    {
      title: <span><CheckCircleOutlined /> Auto-Renew</span>,
      dataIndex: "isAutoRenew",
      key: "isAutoRenew",
      render: (_, record) => (
        <Tag color={record?.isAutoRenew ? "green" : "red"}>
          {record?.isAutoRenew ? "Yes" : "No"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: <span><CalendarOutlined /> Created</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => (
        <div>
          {record?.createdAt
            ? formatDistance(new Date(record.createdAt), new Date(), {
                addSuffix: true,
              })
            : "-"}
        </div>
      ),
      width: 150,
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <HActionButtons
          record={record}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          user={user}
          modelName={modelName}
        />
      ),
      width: 100,
    },
  ];

  return defaultColumns.filter((col) => !columns || columns?.includes(col.key));
}; 