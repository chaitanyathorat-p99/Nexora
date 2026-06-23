import React from "react";
import HActionButtons from "../common/HActionButtons";
import { Tag } from "antd";
import { formatNumberToIndianRupee } from "../../utils/functions";
import { formatDistance } from "date-fns";
import { UserOutlined, StarOutlined, DollarOutlined, CalendarOutlined, TeamOutlined, DatabaseOutlined, CheckCircleOutlined } from "@ant-design/icons";

export const PlanColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  user,
  modelName,
  popUp,
  selectLead,
  plan_page,
  columns,
}) => {
  const defaultColumns = [
    {
      title: <span><StarOutlined /> Name</span>,
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
      render: (_, record) => {
        return (
          <div className="flex justify-between font-semibold">
            <span>{record?.name}</span>
          </div>
        );
      },
      sortBy: "name",
    },
    {
      title: <span><TeamOutlined /> Tier</span>,
      dataIndex: "tier",
      key: "tier",
      render: (_, record) => {
        const tierColors = {
          free: "green",
          basic: "blue",
          pro: "purple",
          enterprise: "gold",
        };
        
        return (
          <Tag color={tierColors[record?.tier] || "default"}>
            {record?.tier?.toUpperCase()}
          </Tag>
        );
      },
      width: 100,
      sortBy: "tier",
    },
    {
      title: <span><DollarOutlined /> Monthly Price</span>,
      dataIndex: "price",
      key: "price.monthly",
      render: (_, record) => (
        <div>
          {record?.price?.monthly ? formatNumberToIndianRupee(record.price.monthly) : "-"}
        </div>
      ),
      width: 120,
    },
    {
      title: <span><DollarOutlined /> Yearly Price</span>,
      dataIndex: "price",
      key: "price.yearly",
      render: (_, record) => (
        <div>
          {record?.price?.yearly ? formatNumberToIndianRupee(record.price.yearly) : "-"}
        </div>
      ),
      width: 120,
    },
    {
      title: <span><UserOutlined /> Max Users</span>,
      dataIndex: "limits",
      key: "limits.maxUsers",
      render: (_, record) => (
        <div>{record?.limits?.maxUsers || "-"}</div>
      ),
      width: 100,
    },
    {
      title: <span><DatabaseOutlined /> Storage (MB)</span>,
      dataIndex: "limits",
      key: "limits.storageMB",
      render: (_, record) => (
        <div>{record?.limits?.storageMB || "-"}</div>
      ),
      width: 120,
    },
    {
      title: <span><CheckCircleOutlined /> Status</span>,
      dataIndex: "isActive",
      key: "isActive",
      render: (_, record) => (
        <Tag color={record?.isActive ? "green" : "red"}>
          {record?.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      width: 100,
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