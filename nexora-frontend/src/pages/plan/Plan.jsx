import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Popconfirm, message, Tooltip, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, StarOutlined, TeamOutlined, DollarOutlined, CalendarOutlined, DatabaseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  useFetchPlansQuery,
  useDeletePlanMutation,
} from "../../features/allApi";
import { PlanString, PlanFilter, Refetch_Model, PlanPage } from "../../features/remainingSlice";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import LoadingHV from "../../atoms/loading/LoadingHV";
import { checkAccess, hasFeature } from "../../atoms/static";
import EResponse from "../../atoms/response/EResponse";
import SimpleTable from "../../components/tables/SimpleTable";
import { toQueryString } from "../../atoms/State";

const Plan = () => {
  const modelName = "Plan";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { plan_string, plan_filter, plan_page, refetch_model } = useSelector(
    (state) => state.remaining
  );
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, refetch } = useFetchPlansQuery({
    filterString: plan_string ? `search=${plan_string}` : "",
    filterObj:toQueryString(plan_filter),
    page: plan_page ? `page=${plan_page}` : "",
  });

  const [deletePlan, deleteResponse] = useDeletePlanMutation();

  useEffect(() => {
    if (modelName === refetch_model) {
      refetch();
      dispatch(Refetch_Model(""));
    }
  }, [refetch_model, refetch, dispatch]);

  const handleView = (record) => {
    navigate(`view/${record._id}`, { state: { plan: record } });
  };

  const handleEdit = (record) => {
    navigate(`create/${record._id}`);
  };

  const handleDelete = async (record) => {
    try {
      await deletePlan(record).unwrap();
      messageApi.success("Plan deleted successfully");
    } catch (error) {
      messageApi.error(error?.data?.message || "Failed to delete plan");
    }
  };

  const handleCreate = () => {
    navigate("create");
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
      title: <span><StarOutlined /> Name</span>,
      dataIndex: "name",
      key: "name",
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
      title: <span><TeamOutlined /> Tier</span>,
      dataIndex: "tier",
      key: "tier",
      render: (tier) => tier.charAt(0).toUpperCase() + tier.slice(1),
    },
    {
      title: <span><DollarOutlined /> Price</span>,
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div>
          <div>Monthly: ₹{price.monthly.toLocaleString()}</div>
          <div>Yearly: ₹{price.yearly.toLocaleString()}</div>
        </div>
      ),
    },
    {
      title: <span><CalendarOutlined /> Duration Options</span>,
      dataIndex: "durationOptions",
      key: "durationOptions",
      render: (options) => options.join(", "),
    },
    {
      title: <span><InfoCircleOutlined /> Features</span>,
      key: "features",
      render: (_, record) => (
        <div style={{ maxWidth: "250px" }}>
          <Space direction="vertical" size="small">
            {record.features?.length > 0 && (
              <div>
                <div style={{ fontWeight: "500", marginBottom: "4px" }}>Custom Features:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {record.features.map((feature, idx) => (
                    <Tag key={idx} color="blue">{feature}</Tag>
                  ))}
                </div>
              </div>
            )}
            
            {record.featuresMasterIds?.length > 0 && (
              <div>
                <div style={{ fontWeight: "500", marginBottom: "4px" }}>Feature Master:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {record.featuresMasterIds.map((feature) => (
                    <Tag key={feature._id} color="green">
                      <Tooltip title={feature.description}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {feature.name}
                          {feature.description && <InfoCircleOutlined style={{ marginLeft: 4 }} />}
                        </span>
                      </Tooltip>
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: <span><DatabaseOutlined /> Limits</span>,
      key: "limits",
      render: (_, record) => (
        <div>
          {/* Limit reference if available */}
          {record.limitId && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ fontWeight: "500", marginBottom: "4px" }}>Predefined Limit:</div>
              <Tooltip 
                title={
                  <>
                    <div>{record.limitId.description || 'No description'}</div>
                    {record.limitId.featurelimit && Object.entries(record.limitId.featurelimit).map(([key, value]) => (
                      <div key={key}><b>{key}:</b> {value}</div>
                    ))}
                  </>
                }
              >
                <Tag color="purple">
                  {record.limitId.name} <InfoCircleOutlined />
                </Tag>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: <span><CheckCircleOutlined /> Status</span>,
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Active" : "Inactive"}
        </span>
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
        filterObj={plan_filter}
        filterString={plan_string}
        dispatchSearchFun={PlanString}
        handleCreate={handleCreate}
        title={"Plan"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {data ? (
        <SimpleTable
          data={data?.data?.content}
          columns={columns}
          size={"small"}
          x={1000}
          pagination={true}
          dispatchFun={(page) => dispatch(PlanPage(page))}
          count={data?.data?.totalElements}
          page={plan_page}
        />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default Plan;
