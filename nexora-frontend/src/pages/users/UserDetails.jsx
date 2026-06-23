import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserQuery, useGetUserSubscriptionsQuery } from "../../features/allApi";
import { Card, Descriptions, Table, Tag, Typography } from "antd";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";

const { Title } = Typography;

const UserDetails = () => {
  const { id } = useParams();
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery({ _id: id });
  const { data: subscriptions, isLoading: isSubscriptionLoading } = useGetUserSubscriptionsQuery(id);

  const subscriptionColumns = [
    {
      title: "Plan Name",
      dataIndex: ["plan", "name"],
      key: "planName",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={
          status === "active" ? "green" : 
          status === "trial" ? "blue" :
          status === "past_due" ? "orange" :
          status === "cancelled" ? "red" :
          "gray"
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Billing Cycle",
      dataIndex: "billingCycle",
      key: "billingCycle",
      render: (cycle) => cycle?.toUpperCase() || "N/A",
    },
    {
      title: "Auto Renew",
      dataIndex: "isAutoRenew",
      key: "isAutoRenew",
      render: (isAutoRenew) => (
        <Tag color={isAutoRenew ? "green" : "red"}>
          {isAutoRenew ? "YES" : "NO"}
        </Tag>
      ),
    },
  ];

  if (isUserLoading || isSubscriptionLoading) {
    return <LoadingHV />;
  }

  const user = userData?.data;
  const subscriptionRows = subscriptions?.data ?? subscriptions ?? [];

  return (
    <div style={{ padding: "20px" }}>
      <ModuleHeader title="User Details" />
      
      <Card style={{ marginBottom: "20px" }}>
        <Title level={4}>
          <UserOutlined /> User Information
        </Title>
        <Descriptions bordered>
          <Descriptions.Item label="Username">
            {user?.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined /> {user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile">
            <PhoneOutlined /> {user?.mobileNo}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <TagOutlined />{" "}
            <Tag color={user?.isActive ? "green" : "red"}>
              {user?.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <ClockCircleOutlined />{" "}
            {new Date(user?.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Title level={4}>Subscriptions</Title>
        <Table
          dataSource={subscriptionRows}
          columns={subscriptionColumns}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default UserDetails; 