import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteTaskMutation,
  useFetchLeadQuery,
  useFetchLeadStatusQuery,
  useFetchTaskQuery,
  useUpdateUserMutation,
  useFetchUserQuery,
  useFetchDynamicFieldsByModuleQuery,
} from "../../features/allApi";
import { GiConsoleController } from "react-icons/gi";
import { Button, Popconfirm, Tag } from "antd";
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
  TeamOutlined,
  TagOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { ToggleLeft, Trash } from "lucide-react";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import { Refetch_Model, TaskPage, TaskString } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";
import TaskKanban from "./kanban/TaskKanban";
import { useDispatch } from "react-redux";
import { getUser } from "../../features/authfunctions/userLogin";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
import ExportCsvButton from '../../components/common/ExportCsvButton';
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";
import TaskViewModal from "./components/TaskViewModal";
const modelName = "Task";

const Task = () => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { data: systemUsersData } = useFetchUserQuery({ type: "userType=System" });
  const systemUsersById = useMemo(() => {
    const list = systemUsersData?.data;
    if (!Array.isArray(list)) return {};
    return list.reduce((acc, item) => {
      if (item?._id) acc[item._id] = item;
      return acc;
    }, {});
  }, [systemUsersData]);
  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };
  const [deleteTask, GetTaskResponse] = useDeleteTaskMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { task_filter, task_string, task_page,refetch_model } = useSelector(
    (state) => state.remaining
  );
  const [kanban, setKanban] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleView = (record) => {
    setSelectedTask(record || null);
    setViewOpen(true);
  };

  const closeView = () => {
    setSelectedTask(null);
    setViewOpen(false);
  };

  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchTaskQuery({
    lead: "",

    filterString: task_string ? `&search=${task_string}` : "",
    filterObj: toQueryString(task_filter),
    page: task_page&&!user?.taskKanban ? `&page=${task_page}` : "",
  });

  // Fetch dynamic fields for task module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "task" });

  const columns = [
    {
      title: <span>Sr. No.</span>,

      dataIndex: "_id",
      width: "70px",
      fixed: "left", // Fixed to the left
      key: "_id",
      render: (_id, _, index) => {
        return <span>{task_page * 10 - 10 + index + 1}</span>;
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
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.title}</div>
          <div className="customAge">{record?.description}</div>
        </div>
      ), //
    },
    {
      title: (
        <span>
          <SolutionOutlined /> Stage
        </span>
      ),
      dataIndex: ["taskStages"],
      key: ["taskStages"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },
    {
      title: (
        <span>
          <TeamOutlined /> Assigned To
        </span>
      ),
      dataIndex: ["assignedTo", "name"],
      key: ["assignedTo", "name"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
      render: (text, record) => {
        const raw = record?.assignedTo;
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const names = list
          .map((assignee) => {
            if (!assignee) return null;
            if (typeof assignee === "string") {
              const u = systemUsersById[assignee];
              return u?.name || u?.username || assignee;
            }
            return assignee?.name || assignee?.username || assignee?._id || null;
          })
          .filter(Boolean);

        if (names.length === 0) return <div className="text-[#010101] font-medium">-</div>;

        return (
          <div className="text-[#010101] font-medium">
            {names.map((name, idx) => (
              <React.Fragment key={`${name}-${idx}`}>
                {name}
                <br />
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
    {
      title: (
        <span>
          <UserOutlined /> Created By
        </span>
      ),
      dataIndex: ["createdBy", "name"],
      key: ["createdBy", "name"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },

    {
      title: (
        <span>
          <InfoCircleOutlined /> Description
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
      title: "Action",
      key: "edit",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EyeOutlined
            className="edit-button"
            onClick={() => handleView(record)}
            title="View Task"
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
        </div>
      ),
    },
  ];

  // Generate dynamic field columns
  const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'task');
  
  // Merge static columns with dynamic columns
  const mergedColumns = mergeColumnsWithDynamicFields(columns, dynamicColumns);

  const handleCreate = () => {
    navigate("create");
  };
  const dispatch= useDispatch()

  useEffect(() => {
    if(modelName===refetch_model){
      refetch()
      dispatch(Refetch_Model(''))
    }

      }, [refetch_model]);
  const [updateUser, GetUpdateUserResponse] = useUpdateUserMutation();
const handleKanbanView=()=>{
  const struct={_id:user?._id,taskKanban:!user?.taskKanban}
  updateUser(struct)
}
useEffect(() => {
if(GetUpdateUserResponse?.isSuccess){
  dispatch(getUser());

}
}, [GetUpdateUserResponse]);

  const taskRows = Array.isArray(data?.content) ? data.content : [];

  return (
    <>
      <ModelRealtimeListener eventNames={["task_updated", "task_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />
      <EResponse
        error={GetUpdateUserResponse?.error?.data?.message}
        Response={GetUpdateUserResponse}
        type={"update"}
        // cancel={dispatch(getUser())}
      />
      <div className="feature-table-layout">
        <ModuleHeader
          filterObj={task_filter}
          filterString={task_string}
          dispatchSearchFun={TaskString}
          filter={true}
          handleCreate={handleCreate}
          title={"Task"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
        />
        {console.log(user?.taskKanban)}
        <Button style={{marginBottom:"10px"}} onClick={() => handleKanbanView()}>
          View {!user?.taskKanban ? <>Kanban</> : <>Table</>}
        </Button>

        {user?.taskKanban&&data?.content?.length>0 ? (

          <TaskKanban dataMain={data} fetch={fetch} isLoading={isLoading}/>
        ) : (
          <>
            {data ? (
              <SimpleTable
                pagination={true}
                dispatchFun={TaskPage}
                count={data?.totalElements}
                page={task_page}
                data={data?.content}
                columns={mergedColumns}
                size={"small"}
                x={1500}
              />
            ) : (
              <LoadingHV />
            )}
          </>
        )}
      </div>

      <TaskViewModal
        open={viewOpen}
        onClose={closeView}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        taskRows={taskRows}
        user={user}
      />
    </>
  );
};

export default Task;
