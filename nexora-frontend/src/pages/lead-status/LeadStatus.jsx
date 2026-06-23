import React, { useMemo } from "react";
import {
  useDeleteLeadStatusMutation,
  useFetchLeadStatusQuery,
} from "../../features/allApi";
import { GiConsoleController } from "react-icons/gi";
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
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import { LeadStatusString } from "../../features/remainingSlice";
import useLeadStatusOptions from "../../utils/useLeadStatusOptions";
const modelName = "Lead-Status";


const LeadStatus = () => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [deleteTask, GetTaskResponse] = useDeleteLeadStatusMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };
  const { lead_status_filter, lead_status_string } = useSelector(
    (state) => state.remaining
  );
  const {
    data: scopedLeadStatus,
    isLoading: isScopedLoading,
    isFetching: isScopedFetching,
  } = useFetchLeadStatusQuery({
    // Keep this unfiltered; search is applied client-side on merged data.
    filterString: "",
  });

  const {
    leadStatusOptions,
    isLoading: isMergedLoading,
    isFetching: isMergedFetching,
  } = useLeadStatusOptions();

  const data = useMemo(() => {
    const scoped = Array.isArray(scopedLeadStatus) ? scopedLeadStatus : [];
    const merged = Array.isArray(leadStatusOptions) ? leadStatusOptions : [];

    const byId = new Map();
    [...scoped, ...merged].forEach((item) => {
      if (item?._id && !byId.has(item._id)) {
        byId.set(item._id, item);
      }
    });

    const searched = String(lead_status_string || "").trim().toLowerCase();
    const rows = Array.from(byId.values());

    const filtered = searched
      ? rows.filter((item) => String(item?.name || "").toLowerCase().includes(searched))
      : rows;

    return filtered.sort((a, b) => {
      const aPlace = Number(a?.place ?? Number.MAX_SAFE_INTEGER);
      const bPlace = Number(b?.place ?? Number.MAX_SAFE_INTEGER);
      if (aPlace !== bPlace) {
        return aPlace - bPlace;
      }
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
  }, [scopedLeadStatus, leadStatusOptions, lead_status_string]);

  const columns = [
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
          <UserOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
    },

    {
      title: (
        <span>
          <HomeOutlined /> Place
        </span>
      ),
      dataIndex: ["place"],
      key: "place",
    },
    {
      title: (
        <span>
          <HomeOutlined /> Description
        </span>
      ),
      dataIndex: ["description"],
      key: "description",
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
      title: "Edit",
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
          {(checkAccess(user, modelName, "delete") || hasFeature(user, modelName)) && (
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
  const handleCreate = () => {
    navigate("create");
  };

  return (
    <>
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className="feature-table-layout">
        <ModuleHeader
          search={true}
          dispatchSearchFun={LeadStatusString}
          filterObj={lead_status_filter}
          filterString={lead_status_string}
          handleCreate={handleCreate}
          title={"Lead Status"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
        />
        {(isScopedLoading || isScopedFetching || isMergedLoading || isMergedFetching) ? (
          <LoadingHV />
        ) : (
          <SimpleTable data={data} columns={columns} size={"small"} />
        )}
      </div>
    </>
  );
};

export default LeadStatus;
