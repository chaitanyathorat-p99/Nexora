import React, { useEffect } from "react";
import {
  useDeleteDynamicFieldMutation,
  useFetchDynamicFieldsQuery,
  useToggleDynamicFieldMutation,
} from "../../features/allApi";
import { Popconfirm, Tag, Switch, Button, Select, Input, Space, Card, Row, Col, Typography, Tooltip } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess } from "../../atoms/static";
import { useSelector, useDispatch } from "react-redux";
import { hasFeature, toQueryString } from "../../atoms/State";
// Redux actions for dynamic fields pagination/filter/search
import { DynamicFieldsPage, DynamicFieldsString, DynamicFieldsFilter } from "../../features/remainingSlice";

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const modelName = "Dynamic-Fields";

const DynamicFields = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteField, deleteResponse] = useDeleteDynamicFieldMutation();
  const [toggleField, toggleResponse] = useToggleDynamicFieldMutation();
  const { user } = useSelector((state) => state.user);
  // Redux state for pagination, filter, search
  const { dynamic_fields_filter, dynamic_fields_string, dynamic_fields_page } = useSelector((state) => state.remaining);

  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };

  const handleDelete = (record) => {
    deleteField(record);
  };

  const handleToggle = (record) => {
    toggleField(record);
  };

  const handleCreate = () => {
    navigate("create");
  };

  // API query with Redux state
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useFetchDynamicFieldsQuery({
    filterString: dynamic_fields_string ? `search=${dynamic_fields_string}` : "",
    filterObj: toQueryString(dynamic_fields_filter),
    page: dynamic_fields_page ? `page=${dynamic_fields_page}` : "",
  });

  // Table columns (same as before)
  const columns = [
    {
      title: "Field Name",
      dataIndex: "fieldName",
      key: "fieldName",
      // No width property, let table auto-balance
      render: (text, record) => (
        <Tooltip title={record.displayName} placement="topLeft">
          <span style={{ fontWeight: "bold" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "fieldType",
      key: "fieldType",
      render: (text) => (
        <Tag color={getFieldTypeColor(text)}>{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Module",
      dataIndex: "moduleType",
      key: "moduleType",
      render: (text) => (
        <Tag color={getModuleTypeColor(text)}>{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Required",
      dataIndex: "isRequired",
      key: "isRequired",
      render: (text) => (
        <Tag color={text ? "red" : "default"}>{text ? "Yes" : "No"}</Tag>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   render: (text, record) => (
    //     <Switch
    //       checked={text}
    //       onChange={() => handleToggle(record)}
    //       checkedChildren={<EyeOutlined />}
    //       unCheckedChildren={<EyeInvisibleOutlined />}
    //     />
    //   ),
    // },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (user) => user ? `${user.name}` : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this field?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter/search UI handlers
  const handleFilterChange = (key, value) => {
    dispatch(DynamicFieldsFilter({ ...dynamic_fields_filter, [key]: value }));
  };
  const handleSearch = (value) => {
    dispatch(DynamicFieldsString(value));
  };
  const handlePageChange = (page) => {
    dispatch(DynamicFieldsPage(page));
  };

  const getFieldTypeColor = (fieldType) => {
    const colors = {
      text: "blue",
      number: "green",
      email: "purple",
      phone: "orange",
      date: "cyan",
      datetime: "magenta",
      select: "geekblue",
      multiselect: "volcano",
      textarea: "lime",
      boolean: "red",
      url: "gold",
      currency: "green",
      percentage: "blue",
    };
    return colors[fieldType] || "default";
  };

  const getModuleTypeColor = (moduleType) => {
    const colors = {
      lead: "blue",
      deal: "green",
      company: "purple",
      task: "orange",
      meeting: "cyan",
      call: "magenta",
      product: "volcano",
      user: "lime",
      ticket: "red",
      enquiry: "gold",
    };
    return colors[moduleType] || "default";
  };

  if (isLoading) {
    return <LoadingHV />;
  }

  return (
    <>
      <EResponse response={deleteResponse} />
      <EResponse response={toggleResponse} />
      <ModuleHeader
        title="Dynamic Fields"
        subtitle="Manage custom fields for different modules"
        handleCreate={handleCreate}
        createButtonText="Create Field"
        createButtonIcon={<PlusOutlined />}
        filterObj={dynamic_fields_filter}
        filterString={dynamic_fields_string}
        dispatchSearchFun={DynamicFieldsString}
        filter={true}
        search={true}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />

      {data ? (
      <SimpleTable
        columns={columns}
        data={data?.content || []}
        loading={isLoading || isFetching}
        pagination={true}
        dispatchFun={DynamicFieldsPage}
        count={data?.totalElements || 0}
        page={dynamic_fields_page || 1}
      />): (
        <LoadingHV />
      )}
    </>
  );
};

export default DynamicFields; 