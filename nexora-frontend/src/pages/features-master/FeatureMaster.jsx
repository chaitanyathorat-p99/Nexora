import React from "react";
import { useDeleteFeatureMasterMutation, useFetchFeaturesMasterQuery } from "../../features/allApi";
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
  TagOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess } from "../../atoms/static";
import { useSelector } from "react-redux";
import { FeaturesMasterString } from "../../features/remainingSlice";
import ExportCsvButton from '../../components/common/ExportCsvButton';

const modelName = "Features-Master";

const FeatureMaster = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { features_master_string, features_master_filter } = useSelector((state) => state.remaining);

  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };

  const [deleteFeature, deleteFeatureResponse] = useDeleteFeatureMasterMutation();

  const handleDelete = (record) => {
    deleteFeature(record._id);
  };

  const {
    data: features,
    isLoading,
    isFetching,
    error,
  } = useFetchFeaturesMasterQuery({
    filterString: features_master_string ? `&search=${features_master_string}` : "",
    filterObj: features_master_filter ? features_master_filter : "",
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
          <TagOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.name}</div>
          <div className="customAge">{record?.description}</div>
        </div>
      ),
    },
    {
      title: (
        <span>
          <SolutionOutlined /> Description
        </span>
      ),
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <div className="customAge">{record?.description}</div>
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
          {checkAccess(user, modelName, "update") && (
            <EditOutlined className="edit-button" onClick={() => handleEdit(record)} />
          )}
          {checkAccess(user, modelName, "delete") && (
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
      <EResponse Response={deleteFeatureResponse} type={"delete"} />
      <ModuleHeader
        search={true}
        // filter={true}
        filterString={features_master_string}
        filterObj={features_master_filter}
        dispatchSearchFun={FeaturesMasterString}
        handleCreate={handleCreate}
        title={"Feature Master"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {features ? (
        <SimpleTable data={features} columns={columns} size={"small"} x={800} />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default FeatureMaster;
