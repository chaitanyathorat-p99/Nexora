import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SolutionOutlined,
  TagOutlined,
  StarOutlined,
  TrophyOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Popconfirm, Tag, Tooltip } from "antd";
import { PlusIcon } from "lucide-react";
import moment from "moment";
import { checkAccess, filterDealsByAmount, hasFeature } from "../../atoms/static";
import { visibilityConfig, visibilityConfigArrangement } from "../../atoms/State";
import { ForLead } from "../../atoms/StaticColumnDisplay";
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";

export const LeadColumns = ({
  handleView,
  lead_page,
  handleEdit,
  selectLead,
  handleDelete,
  popUp,
  user,
  modelName,
  columns,
  dynamicFields,
}) => {
  const allColumns = [
    {
      title: <span>Sr. No.</span>,
      dataIndex: "_id",
      width: "70px",
      key: "_id",
      render: (_id, _, index) => {
        return <span>{lead_page * 10 - 10 + index + 1}</span>;
      },
    },
    {
      title: (
        <span>
          <UserOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      width: "220px",
      render: (text, record) => (
        <div>
          <div
            style={{ cursor: "pointer", color: "var(--color-primary)" }}
            className="font-medium"
            onClick={() => handleView(record)}
          >
            {record?.firstName} {record?.lastName}
          </div>
          <div className="customAge">{record?.email}</div>
        </div>
      ),
    },
    {
      title: (
        <span>
          <PhoneOutlined /> Mobile
        </span>
      ),
      dataIndex: "mobile",
      key: "mobile",
      width: "120px",
      render: (_, record) => record?.mobile || record?.info?.mobile || "-",
    },
    {
      title: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: ["email"],
      key: "email",
      width: "220px",
    },
    {
      title: (
        <span>
          <TrophyOutlined /> Percentile
        </span>
      ),
      dataIndex: ["percentile"],
      key: "percentile",
      width: "120px",
    },
    {
      title: (
        <span>
          <StarOutlined /> Score
        </span>
      ),
      dataIndex: ["score", "score"],
      key: "score.score",
      width: "120px",
    },
    {
      title: (
        <span>
          <EnvironmentOutlined /> City
        </span>
      ),
      dataIndex: "city",
      key: "city",
      width: "120px",

      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.city || record?.info?.city || "-"}</div>
          <div className="customAge">{record?.country || record?.info?.country || "-"}</div>
        </div>
      ),
    },
    {
      title: (
        <span>
          <GlobalOutlined /> Source
        </span>
      ),
      dataIndex: "source",
      key: "source",
      width: "120px",

      render: (text, record) => (
        <Tooltip
          title="Source of the lead"
          placement="left"
          overlayClassName="customTooltip"
        >
          <span> {record?.source || record?.info?.source || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <TagOutlined /> Industry Type
        </span>
      ),
      dataIndex: "industryType",
      key: "industryType.name",
      width: "120px",

      render: (text, record) => (
        <Tooltip
          title="Industry Type"
          placement="left"
          overlayClassName="customTooltip"
        >
          <span>
            {record?.industryType?.name || record?.industryType || record?.info?.industryType?.name || record?.info?.industryType || "-"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <HomeOutlined /> Address
        </span>
      ),
      dataIndex: "address",
      key: "address",
      width: "120px",
      render: (_, record) => record?.address || record?.info?.address || "-",
    },
    {
      title: (
        <span>
          <SolutionOutlined /> Weight
        </span>
      ),
      dataIndex: ["leadWeight"],
      key: "leadWeight",
      width: "120px",
    },
    {
      title: (
        <span>
          <DollarOutlined /> Value
        </span>
      ),
      dataIndex: ["leadValue"],
      key: "leadValue",
      width: "120px",
    },
    {
      title: (
        <span>
          <Tag color="blue" /> Status
        </span>
      ),
      dataIndex: "status",
      key: "status.name",
      width: "120px",

      render: (status,record) => (
        <Tooltip
          title="Current status of the lead"
          placement="left"
          overlayClassName="customTooltip"
        >
          <span>{record?.status?.name || record?.status || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: "120px",

      render: (text) => (
        <Tooltip
          title="Lead creation date"
          placement="left"
          overlayClassName="customTooltip"
        >
          <span> {moment(text).format("YYYY-MM-DD HH:mm")}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <ClockCircleOutlined /> Updated At
        </span>
      ),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "120px",

      render: (text) => (
        <Tooltip
          title="Lead updated date"
          placement="left"
          overlayClassName="customTooltip"
        >
          <span> {moment(text).format("YYYY-MM-DD HH:mm")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "edit",
      width: "110px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {popUp ? (
            <PlusIcon
              className="edit-button"
              onClick={() => selectLead(record?._id)}
            />
          ) : (
            <>
              <EyeOutlined
                className="edit-button"
                onClick={() => handleView(record)}
                title="View Lead"
              />

              {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
                <EditOutlined
                  className="edit-button"
                  onClick={() => handleEdit(record)}
                />
              )}

              {(checkAccess(user, modelName, "delete") || hasFeature(user, modelName)) && (
                <Popconfirm
                  title="Sure To Delete?"
                  onConfirm={() => handleDelete(record)}
                >
                  <DeleteOutlined className="delete-button" />
                </Popconfirm>
              )}
            </>
          )}
        </div>
      ),
    },
  ];


  
  // Generate dynamic field columns
  const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'lead');
  
  // Merge static columns with dynamic columns
  const mergedColumns = mergeColumnsWithDynamicFields(allColumns, dynamicColumns);
  
  return visibilityConfigArrangement(
    ["_id", "name", "edit"],
    modelName,
    user,
    columns,
    mergedColumns,
    ["_id","name"],
    ["edit"]
  );
};
