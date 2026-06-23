import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Space, Modal, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, MailOutlined, TagOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  useGetEmailTemplatesQuery,
  useDeleteEmailTemplateMutation,
} from "../../features/allApi";
import LoadingHV from "../../atoms/loading/LoadingHV";
import { useSelector, useDispatch } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import SimpleTable from "../../components/tables/SimpleTable";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { EmailTemplatePage, EmailTemplateString } from "../../features/remainingSlice";

const modelName = "Email-Template";

const EmailTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { email_template_page, email_template_string } = useSelector(
    (state) => state.remaining
  );
  
  const { data, isLoading, isFetching } = useGetEmailTemplatesQuery({
    page: email_template_page,
    search: email_template_string,
  });
  
  const [deleteEmailTemplate] = useDeleteEmailTemplateMutation();

  const handleDelete = async (record) => {
    try {
      await deleteEmailTemplate(record._id).unwrap();
      message.success("Email template deleted successfully");
    } catch (error) {
      message.error("Failed to delete email template");
    }
  };

  const handleCreate = () => {
    navigate("/email-templates/create");
  };

  const handleEdit = (record) => {
    navigate(`/email-templates/create/${record._id}`);
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
      title: (
        <span>
          <MailOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.name}</div>
        </div>
      ),
      width: 180,
    },
    {
      title: (
        <span>
          <TagOutlined /> Type
        </span>
      ),
      dataIndex: "type",
      key: "type",
      render: (type) => <span className="text-[#010101] font-medium">{type}</span>,
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Days Before Expiration
        </span>
      ),
      dataIndex: "daysBeforeExpiration",
      key: "daysBeforeExpiration",
      render: (days) => days !== undefined ? days : '-',
    },
    {
      title: (
        <span>
          <CheckCircleOutlined /> Status
        </span>
      ),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span style={{ color: isActive ? "#52c41a" : "#ff4d4f" }}>
          {isActive ? "Active" : "Inactive"}
        </span>
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
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : '-',
    },
    {
      title: "Actions",
      key: "actions",
      width: "150px",
      render: (_, record) => (
        <Space size="middle">
          {(checkAccess(user, modelName, "update") ||
            hasFeature(user, modelName)) && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              
            </Button>
          )}
          {(checkAccess(user, modelName, "delete") ||
            hasFeature(user, modelName)) && (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading || isFetching) {
    return <LoadingHV />;
  }

  return (
    <>
      <ModuleHeader
        title="Email Templates"
        handleCreate={handleCreate}
        disabled={(checkAccess(user, modelName, "write") || hasFeature(user, modelName))}
        search={true}
        dispatchSearchFun={EmailTemplateString}
        filterString={email_template_string}
      />
      {data ? (
        <SimpleTable
          data={data?.content || data}
          columns={columns}
          rowKey="_id"
          pagination={true}
          page={email_template_page}
          dispatchFun={EmailTemplatePage}
          count={data?.totalElements || (Array.isArray(data) ? data.length : 0)}
        />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default EmailTemplate;
