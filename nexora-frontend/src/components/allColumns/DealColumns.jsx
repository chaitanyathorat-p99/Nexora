import {
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    FileAddOutlined,
    FileTextOutlined,
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
    ShoppingOutlined,
    FileDoneOutlined,
    BankOutlined,
} from "@ant-design/icons";
import { Popconfirm, Tag, Tooltip } from "antd";
import moment from "moment";
import { checkAccess, filterDealsByAmount, hasFeature } from "../../atoms/static";
import { visibilityConfig, visibilityConfigArrangement } from "../../atoms/State";
import { ForLead } from "../../atoms/StaticColumnDisplay";
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";

export const DealColumns = ({
  deal_page,
  handleEdit,
  handleDelete,
  user,
  modelName,
  columns,
  insideLead,
  QuotationView,
  dynamicFields,
}) => {
  const allColumns = [
      {
        title: <span>Sr. No.</span>,
        dataIndex: "_id",
        width: "70px",
        fixed: "left",
        key: "_id",
        render: (_id, _, index) => {
          return (
            <>
              {insideLead ? (
                <span>{deal_page * 10 - 10 + index + 1}</span>
              ) : (
                <span>{index + 1}</span>
              )}
            </>
          );
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
            <div className=" font-medium" style={{color:"var(--color-primary)",cursor:"pointer"}} onClick={()=>QuotationView(record)}>
              {record?.lead?.firstName}
            </div>
        ),
      },
      {
        title: (
          <span>
            <TagOutlined /> Deal Type
          </span>
        ),
        dataIndex: "dealType",
        key: "dealType",
        width: "120px",
      },
      {
        title: (
          <span>
            <FileDoneOutlined /> Deal Stages
          </span>
        ),
        dataIndex: "dealStages",
        key: "dealStages",
        width: "220px",
      },
      {
          title: (
            <span>
              <DollarOutlined /> Lead Value
            </span>
          ),
          dataIndex: ["lead","leadValue"],
          key: "lead.leadValue",
          width: "120px",
        },
        {
          title: (
            <span>
              <MailOutlined /> Email
            </span>
          ),
          dataIndex: ["lead","email"],
          key: "lead.email",
          width: "220px",
        },
        {
          title: (
            <span>
              <PhoneOutlined /> Mobile
            </span>
          ),
          dataIndex: ["lead","info", "mobile"],
          key: "info.mobile",
          width: "120px",
        },
        {
          title: (
            <span>
              <EnvironmentOutlined /> City
            </span>
          ),
          dataIndex: ["lead","info", "city"],
          key: "info.city",
          width: "120px",
    
          render: (text, record) => (
            <div>
              <div className="text-[#010101] font-medium">{record?.lead?.info?.city}</div>
              <div className="customAge">{record?.lead?.info?.country}</div>
            </div>
          ),
        },
        {
          title: (
            <span>
              <GlobalOutlined /> Source
            </span>
          ),
          dataIndex: ["lead","info", "source"],
          key: "info.source",
          width: "120px",
    
          render: (text, record) => (
            <Tooltip
              title="Source of the lead"
              placement="left"
              overlayClassName="customTooltip"
            >
              <span> {record?.lead?.info?.source}</span>
            </Tooltip>
          ),
        },
        {
          title: (
            <span>
              <HomeOutlined /> Address
            </span>
          ),
          dataIndex: ["lead","info", "address"],
          key: "info.address",
          width: "120px",
        },
      {
        title: (
          <span>
            <BankOutlined /> Currency Type
          </span>
        ),
        dataIndex: "currencyType",
        key: "currencyType",
        width: "120px",
      },
      {
        title: (
          <span>
            <DollarOutlined /> Deal Value
          </span>
        ),
        dataIndex: "dealValue",
        key: "dealValue",
        width: "120px",
      },
      // {
      //   title: (
      //     <span>
      //       <HomeOutlined /> Total With Discount
      //     </span>
      //   ),
      //   dataIndex: "totalWithDiscount",
      //   key: "totalWithDiscount",
      // },
      {
        title: (
          <span>
            <CalendarOutlined /> Created At
          </span>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        width: "120px",
        render: (createdAt) => new Date(createdAt).toLocaleString(),
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
        render: (updatedAt) => new Date(updatedAt).toLocaleString(),
      },
      {
        title: "Action",
        key: "edit",
        width: "120px",
        fixed: "right",
        render: (_, record) => (
          <div style={{ display: "flex", gap: "5px" }}>
            {(checkAccess(user, "Deal", "update") || hasFeature(user, modelName)) && (
              <EditOutlined
                className="edit-button"
                onClick={() => handleEdit(record)}
              />
            )}
            {(checkAccess(user, "Deal", "delete")|| hasFeature(user, modelName)) && (
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


  
    // Generate dynamic field columns
    const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'deal');
    
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
  