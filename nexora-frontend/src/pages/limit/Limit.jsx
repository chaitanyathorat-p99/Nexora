import React from "react";
import { useDeleteLimitMutation, useFetchLimitsQuery } from "../../features/allApi";
import { Popconfirm } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
  TagOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess, hasFeature } from "../../atoms/static";
import { useSelector, useDispatch } from "react-redux";
import { LimitFilter, LimitString, LimitPage } from "../../features/remainingSlice";
import ExportCsvButton from '../../components/common/ExportCsvButton';

const modelName = "Feature-Limit";

const Limit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { limit_string, limit_filter, limit_page } = useSelector((state) => state.remaining);

  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };

  const [deleteLimit, deleteLimitResponse] = useDeleteLimitMutation();

  const handleDelete = (record) => {
    deleteLimit(record._id);
  };

  const {
    data: limitsData,
    isLoading,
    isFetching,
    error,
  } = useFetchLimitsQuery({
    page: limit_page,
    search: limit_string,
  });

  // Extract limits and total count from response
  const limits = limitsData?.content || limitsData || [];
  const totalCount = limitsData?.totalElements || limits.length;

  const columns = [
    {
      title: <span>Sr. No.</span>,
      dataIndex: "_id",
      width: "70px",
      fixed: "left",
      key: "_id",
      render: (_id, _, index) => {
        // Calculate the correct index based on pagination
        const startIndex = limit_page ? (limit_page - 1) * 10 : 0;
        return <span>{startIndex + index + 1}</span>;
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
          <CodeOutlined /> Feature Limits
        </span>
      ),
      dataIndex: "featurelimit",
      key: "featurelimit",
      render: (featurelimit) => {
        if (!featurelimit) return "-";
        const featureLimitObj = featurelimit instanceof Map ? Object.fromEntries(featurelimit) : featurelimit;
        return (
          <div className="flex flex-col gap-1">
            {Object.entries(featureLimitObj).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm font-medium">{key}:</span> 
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        );
      },
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
      <EResponse Response={deleteLimitResponse} type={"delete"} />
      <ModuleHeader
        search={true}
        // filter={true}
        filterString={limit_string}
        filterObj={limit_filter}
        dispatchSearchFun={LimitString}
        handleCreate={handleCreate}
        title={"Limit Management"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {limits.length > 0 || !isLoading ? (
        <SimpleTable 
          data={limits} 
          columns={columns} 
          size={"small"} 
          x={800} 
          pagination={true}
          page={limit_page || 1}
          dispatchFun={LimitPage}
          count={totalCount}
        />
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default Limit; 