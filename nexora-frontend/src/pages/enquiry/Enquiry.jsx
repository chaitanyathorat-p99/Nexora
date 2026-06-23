import React from "react";
import { useDeleteEnquiryMutation, useFetchEnquiriesQuery } from "../../features/allApi";
import { Popconfirm, Tag } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess, hasFeature } from "../../atoms/static";
import { useSelector } from "react-redux";
import { EnquiryString, EnquiryPage } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";

const modelName = "Enquiry";

const Enquiry = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { enquiry_string, enquiry_filter, enquiry_page } = useSelector((state) => state.remaining);

  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };

  const [deleteEnquiry, deleteEnquiryResponse] = useDeleteEnquiryMutation();

  const handleDelete = (record) => {
    deleteEnquiry({ _id: record._id });
  };

  const {
    data: enquiries,
    isLoading,
    isFetching,
    error,
  } = useFetchEnquiriesQuery({
    filterString: enquiry_string ? `search=${enquiry_string}` : "",
    filterObj: toQueryString(enquiry_filter),
    page: enquiry_page ? `page=${enquiry_page}` : "",
  });

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
          <UserOutlined /> Full Name
        </span>
      ),
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.fullName}</div>
          <div className="customAge">{record?.instituteName}</div>
        </div>
      ),
    },
    {
      title: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <span>
          <PhoneOutlined /> Phone
        </span>
      ),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: (
        <span>
          <InfoCircleOutlined /> Job Title
        </span>
      ),
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Subscribed",
      dataIndex: "subscribed",
      key: "subscribed",
      render: (subscribed) => (
        <Tag color={subscribed ? "green" : "red"}>
          {subscribed ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: (
        <span>
          <ClockCircleOutlined /> Created At
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
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <EditOutlined className="edit-button" onClick={() => handleEdit(record)} />
          )}
          {(checkAccess(user, modelName, "delete") || hasFeature(user, modelName)) && (
            <Popconfirm title="Sure To Delete?" onConfirm={() => handleDelete(record)}>
              <DeleteOutlined className="delete-button" />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("create");
  };

  return (
    <>
      <EResponse Response={deleteEnquiryResponse} type={"delete"} />
      <ModuleHeader
        search={true}
        // filter={true}
        filterString={enquiry_string}
        filterObj={enquiry_filter}
        dispatchSearchFun={EnquiryString}
        handleCreate={handleCreate}
        title={"Enquiry"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {enquiries ? (
        <SimpleTable
          data={enquiries.content}
          columns={columns}
          size={"small"}
          x={1100}
          pagination={true}
          page={enquiry_page}
          dispatchFun={EnquiryPage}
          count={enquiries.totalItems}
        />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default Enquiry; 