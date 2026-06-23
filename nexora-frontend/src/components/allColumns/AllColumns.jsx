import { ClockCircleOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, FileTextOutlined, HomeOutlined, InfoCircleOutlined, PhoneOutlined, UserOutlined, MailOutlined, TeamOutlined, DollarOutlined, CalendarOutlined, EnvironmentOutlined, SolutionOutlined, TagOutlined, CheckCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import { Popconfirm, Tag, Tooltip } from "antd";
import { PlusIcon } from "lucide-react";
import { BiRegistered } from "react-icons/bi";
import { checkAccess, hasFeature } from "../../atoms/static";
import moment from "moment";

const isSuperAdminUser = (user) => {
  const roleName = String(user?.role?.name || "").toUpperCase().replace(/\s+/g, "_");
  const roleId = String(user?.role?._id || user?.role || "");
  return roleName === "SUPER_ADMIN" || roleId === "role_super_admin";
};

export const TypeOfBuyerColumns = ({ handleEdit, handleDelete, user, modelName }) => [
    {
      title: <span>Sr. No.</span>,
  
      dataIndex: "_id",
      width: "70px",
      fixed: "left", // Fixed to the left
      key: "_id",
      render: (_id, _, index) => {
        return <span>{index + 1}</span>;
      },
    },
  
    {
      title: (
        <span>
          <TeamOutlined /> Type Of Buyer
        </span>
      ),
      dataIndex: ["name"],
      key: ["name"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },
    {
      title: (
        <span>
          <SolutionOutlined /> Description
        </span>
      ),
      dataIndex: ["description"],
      key: ["desc"],
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Action",
      key: "edit",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {(checkAccess(user, modelName, "update") || isSuperAdminUser(user)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
  
          {(checkAccess(user, modelName, "delete") || isSuperAdminUser(user)) && (
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
  
  export const SegmentColumns = ({ handleEdit, handleDelete, user, modelName }) => [
    {
      title: <span>Sr. No.</span>,
  
      dataIndex: "_id",
      width: "70px",
      fixed: "left", // Fixed to the left
      key: "_id",
      render: (_id, _, index) => {
        return <span>{index + 1}</span>;
      },
    },
  
    {
      title: (
        <span>
          <UserOutlined /> Industry Type
        </span>
      ),
      dataIndex: ["name"],
      key: ["name"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },
    {
      title: (
        <span>
          <UserOutlined /> Description
        </span>
      ),
      dataIndex: ["description"],
      key: ["desc"],
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Action",
      key: "edit",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {(checkAccess(user, modelName, "update") || isSuperAdminUser(user)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
  
          {(checkAccess(user, modelName, "delete") || isSuperAdminUser(user)) && (
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
  
  export const ReportColumn = ({ user, modelName }) => [
    {
      title: <span>Sr. No.</span>,
  
      dataIndex: "_id",
      width: "70px",
      fixed: "left", // Fixed to the left
      key: "_id",
      render: (_id, _, index) => {
        return <span>{index + 1}</span>;
      },
    },
  
    {
      title: (
        <span>
          <FileTextOutlined /> Industry Type
        </span>
      ),
      dataIndex: ["industryTypeName"],
      key: ["industryTypeName"],
    },
    {
      title: (
        <span>
          <BarChartOutlined /> Lead Count
        </span>
      ),
      dataIndex: ["leadCount"],
      key: ["leadCount"],
    },
    // {
    //   title: (
    //     <span>
    //       <UserOutlined /> Created By
    //     </span>
    //   ),
    //   dataIndex: ["createdBy","name"],
    //   key: ["createdBy","name"],
    //   // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
  
    // },
  ];
  
  export const LeadRatioColumns = ({ user, modelName, data }) => {
    // Static columns for Type of Buyer and Lead Count
    const staticColumns = [
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
        title: (
          <span>
            <TeamOutlined /> Type Of Buyer
          </span>
        ),
        dataIndex: "typeOfBuyerName",
        key: "typeOfBuyerName",
      },
      {
        title: (
          <span>
            <BarChartOutlined /> Lead Count
          </span>
        ),
        dataIndex: "leadCount",
        key: "leadCount",
      },
    ];
  
    // Collect unique statuses across all records for dynamic columns
    const uniqueStatuses = [];
    data?.forEach((record) => {
      record.ratios.forEach((ratio) => {
        if (!uniqueStatuses.find((status) => status.status === ratio.status)) {
          uniqueStatuses.push({
            status: ratio.status,
            statusName: ratio.statusName,
          });
        }
      });
    });
  
    // Dynamic columns for each unique status with corresponding ratioCount
    const ratioColumns = uniqueStatuses.map((status) => ({
      title: (
        <span>
          <UserOutlined /> {status.statusName}
        </span>
      ),
      key: `ratio-${status.status}`,
      render: (_, record) => {
        // Find the ratio for the current status in the record's ratios
        const foundRatio = record.ratios.find((r) => r.status === status.status);
        return (
          <span className="text-[#010101] font-medium">
            {foundRatio ? foundRatio.ratioCount : "N/A"}
          </span>
        );
      },
    }));
  
    // Combine static and dynamic columns
    return [...staticColumns, ...ratioColumns];
  };
  
  export const QuotationStatusRatioColumns = ({ user, modelName, data }) => {
    // Static columns for Type of Buyer and Lead Count
    const staticColumns = [
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
        title: (
          <span>
            <FileTextOutlined /> Amount Range
          </span>
        ),
        dataIndex: "amountRange",
        key: "amountRange",
      },
      {
        title: (
          <span>
            <BarChartOutlined /> Quotation Count
          </span>
        ),
        dataIndex: "totalQuotations",
        key: "totalQuotations",
      },
    ];
  
    // Collect unique statuses across all records for dynamic columns
    const uniqueStatuses = [];
    data?.forEach((record) => {
      record.ratios.forEach((ratio) => {
        if (!uniqueStatuses.find((status) => status.statusId === ratio.statusId)) {
          uniqueStatuses.push({
            statusId: ratio.statusId,
            statusName: ratio.statusName,
          });
        }
      });
    });
  
    // Dynamic columns for each unique status with corresponding ratioCount
    const ratioColumns = uniqueStatuses.map((status) => ({
      title: (
        <span>
          <UserOutlined /> {status.statusName}
        </span>
      ),
      key: `ratio-${status.statusId}`,
      render: (_, record) => {
        // Find the ratio for the current status in the record's ratios
        const foundRatio = record.ratios.find((r) => r.statusId === status.statusId);
        return (
          <span className="text-[#010101] font-medium">
            {foundRatio ? foundRatio.ratioCount : "N/A"}
          </span>
        );
      },
    }));
  
    // Combine static and dynamic columns
    return [...staticColumns, ...ratioColumns];
  };
  
  
  export const QuotationProductRatioColumns = ({ user, modelName, data }) => {
    // Static columns for Amount Range and Quotation Count
    const staticColumns = [
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
        title: (
          <span>
            <FileTextOutlined /> Amount Range
          </span>
        ),
        dataIndex: "amountRange",
        key: "amountRange",
      },
      {
        title: (
          <span>
            <BarChartOutlined /> Quotation Count
          </span>
        ),
        dataIndex: "totalQuotations",
        key: "totalQuotations",
      },
    ];
  
    // Collect unique product types across all records for dynamic columns
    const uniqueProductTypes = [];
    data?.forEach((record) => {
      record.productTypeRatios.forEach((ratio) => {
        if (!uniqueProductTypes.find((type) => type.productType === ratio.productType)) {
          uniqueProductTypes.push({
            productType: ratio.productType,
          });
        }
      });
    });
  
    // Dynamic columns for each unique product type with corresponding ratioCount
    const ratioColumns = uniqueProductTypes.map((product) => ({
      title: (
        <span>
          <UserOutlined /> {product.productType}
        </span>
      ),
      key: `ratio-${product.productType}`,
      render: (_, record) => {
        // Find the ratio for the current product type in the record's productTypeRatios
        const foundRatio = record.productTypeRatios.find((r) => r.productType === product.productType);
        return (
          <span className="text-[#010101] font-medium">
            {foundRatio ? foundRatio.ratioCount : "N/A"}
          </span>
        );
      },
    }));
  
    // Combine static and dynamic columns
    return [...staticColumns, ...ratioColumns];
  };
  
  export const UserWiseCallStatsColumns = () => [
    {
      title: <span>Sr. No.</span>,
      dataIndex: 'srNo',
      width: '70px',
      fixed: 'left',
      key: 'srNo',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: <span><TeamOutlined /> User</span>,
      dataIndex: 'user',
      key: 'user',
      // Optionally, render user name if available
    },
    {
      title: <span><BarChartOutlined /> Total Calls</span>,
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: <span><ClockCircleOutlined /> Pending Calls</span>,
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      title: <span><CheckCircleOutlined /> Done Calls</span>,
      dataIndex: 'done',
      key: 'done',
    },
    {
      title: <span><ClockCircleOutlined /> Overdue Calls</span>,
      dataIndex: 'overdue',
      key: 'overdue',
    },
    {
      title: <span><ClockCircleOutlined /> On Time Calls</span>,
      dataIndex: 'onTime',
      key: 'onTime',
    },
  ];
  
  export const UserWiseMeetingStatsColumns = () => [
    {
      title: <span>Sr. No.</span>,
      dataIndex: 'srNo',
      width: '70px',
      fixed: 'left',
      key: 'srNo',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: <span><TeamOutlined /> User</span>,
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: <span><BarChartOutlined /> Total Meetings</span>,
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: <span><ClockCircleOutlined /> Pending Meetings</span>,
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      title: <span><CheckCircleOutlined /> Done Meetings</span>,
      dataIndex: 'done',
      key: 'done',
    },
    {
      title: <span><ClockCircleOutlined /> Overdue Meetings</span>,
      dataIndex: 'overdue',
      key: 'overdue',
    },
    {
      title: <span><ClockCircleOutlined /> On Time Meetings</span>,
      dataIndex: 'onTime',
      key: 'onTime',
    },
  ];
  
  export const ProductTypeColumns = ({ handleEdit, handleDelete, user, modelName }) => [
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
      title: <span><TagOutlined /> Name</span>,
      dataIndex: ["name"],
      key: ["name"],
    },
    {
      title: <span><SolutionOutlined /> Description</span>,
      dataIndex: ["desc"],
      key: ["desc"],
    },
    {
      title: <span><ClockCircleOutlined /> Created At</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Action",
      key: "edit",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
          {(checkAccess(user, modelName, "delete")|| hasFeature(user, modelName)) && (
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
  
  