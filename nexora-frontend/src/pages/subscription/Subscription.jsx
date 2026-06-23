import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Popconfirm, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SolutionOutlined, ApartmentOutlined, UserOutlined, CheckCircleOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { useFetchSubscriptionsQuery, useDeleteSubscriptionMutation } from "../../features/allApi";
import { SubscriptionString, SubscriptionFilter, Refetch_Model, SubscriptionPage } from "../../features/remainingSlice";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import LoadingHV from '../../atoms/loading/LoadingHV';
import { checkAccess, hasFeature } from "../../atoms/static";
import EResponse from "../../atoms/response/EResponse";
import SimpleTable from "../../components/tables/SimpleTable";
import { toQueryString } from "../../atoms/State";

const Subscription = () => {
  const modelName = "Subscription";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { subscription_string, subscription_filter, subscription_page, refetch_model } = useSelector((state) => state.remaining);
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, refetch } = useFetchSubscriptionsQuery({
    filterString: subscription_string ? `&search=${subscription_string}` : "",
    filterObj: subscription_filter ? subscription_filter : {},
    page: subscription_page ? `&page=${subscription_page}` : "",
  });

  const [deleteSubscription, deleteResponse] = useDeleteSubscriptionMutation();

  useEffect(() => {
    if (modelName === refetch_model) {
      refetch();
      dispatch(Refetch_Model(''));
    }
  }, [refetch_model, refetch, dispatch]);

  const handleView = (record) => {
    navigate(`view/${record._id}`, { state: { subscription: record } });
  };

  const handleEdit = (record) => {
    navigate(`create/${record._id}`);
  };

  const handleDelete = async (record) => {
    try {
      await deleteSubscription(record).unwrap();
      messageApi.success("Subscription deleted successfully");
    } catch (error) {
      messageApi.error(error?.data?.message || "Failed to delete subscription");
    }
  };

  const handleCreate = () => {
    navigate("create");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "trial":
        return "blue";
      case "past_due":
        return "orange";
      case "cancelled":
        return "red";
      case "expired":
        return "gray";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: <span>Sr. No.</span>,
      dataIndex: "_id",
      width: "70px",
      fixed: "left",
      key: "_id",
      render: (_id, _, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: <span><ApartmentOutlined /> Company</span>,
      dataIndex: ["company", "name"],
      key: "company",
      render: (name, record) => (
        <span 
          className="clickable-text" 
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => handleView(record)}
        >
          {name}
        </span>
      ),
    },
    {
      title: <span><SolutionOutlined /> Plan</span>,
      dataIndex: ["plan", "name"],
      key: "plan",
    },
    {
      title: <span><CheckCircleOutlined /> Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: <span><CalendarOutlined /> Billing Cycle</span>,
      dataIndex: "billingCycle",
      key: "billingCycle",
      render: (cycle) => cycle.charAt(0).toUpperCase() + cycle.slice(1),
    },
    {
      title: <span><CalendarOutlined /> Start Date</span>,
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: <span><CalendarOutlined /> End Date</span>,
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: <span><Tag color="blue" /> Trial</span>,
      dataIndex: "isTrial",
      key: "isTrial",
      render: (isTrial) => (
        <Tag color={isTrial ? "blue" : "default"}>
          {isTrial ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: <span><CheckCircleOutlined /> Auto Renew</span>,
      dataIndex: "isAutoRenew",
      key: "isAutoRenew",
      render: (isAutoRenew) => (
        <Tag color={isAutoRenew ? "green" : "default"}>
          {isAutoRenew ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {checkAccess(user, modelName, "update") && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
          {checkAccess(user, modelName, "delete") && (
            <Popconfirm
              title="Sure To Delete?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined className="delete-button" />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <EResponse Response={deleteResponse} type={"delete"} />
      <ModuleHeader
        search={true}
        // filter={true}
        filterObj={subscription_filter}
        filterString={subscription_string}
        dispatchSearchFun={SubscriptionString}
        handleCreate={handleCreate}
        title={"Subscription"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {console.log(data?.data?.content)}
      {data ? (
        <SimpleTable
          data={data?.data?.content}
          columns={columns}
          size={"small"}
          x={1500}
          pagination={true}
          dispatchFun={(page) => dispatch(SubscriptionPage(page))}
          count={data?.data?.totalElements}
          page={subscription_page}
        />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default Subscription; 