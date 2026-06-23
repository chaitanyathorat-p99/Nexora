import React, { useEffect, useState, useRef, useCallback } from "react";
import { checkAssigned, TaskStage } from "../../../atoms/State";
import KanbanTaskColumn from "./box/KanbanTaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import KanbanTaskBox from "./box/KanbanTaskBox";
import { useDeleteTaskMutation, useUpdateTaskMutation, useFetchTaskQuery } from "../../../features/allApi";
import EResponse from "../../../atoms/response/EResponse";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import UniversalLoading from "../../../atoms/loading/UniversalLoading";
import { message } from "antd";
import CustomModel from "../../../atoms/model/CustomModel";
import MainTask from "../form/MainTask";
import { useSelector, useDispatch } from "react-redux";
import { TaskPage } from "../../../features/remainingSlice";

const TaskKanban = ({ dataMain, isLoading: isLoadingProp, fetch: fetchProp }) => {
  // Redux state for page and filters
  const { task_filter, task_string, task_page } = useSelector((state) => state.remaining);
  const dispatch = useDispatch();

  // Local state for accumulated tasks
  const [tasks, setTasks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // API call for paginated tasks
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useFetchTaskQuery({
    lead: "",
    filterString: task_string ? `&search=${task_string}` : "",
    filterObj: "", // Optionally add filters
    page: `&page=${task_page}`,
  });

  // Accumulate tasks as pages load
  useEffect(() => {
    if (data && Array.isArray(data.content)) {
      setTasks((prev) => {
        // Avoid duplicates if page is reset
        if (task_page === 1) return data.content;
        const ids = new Set(prev.map((t) => t._id));
        return [...prev, ...data.content.filter((t) => !ids.has(t._id))];
      });
      // If less than 10 returned, no more data
      setHasMore((data.content?.length ?? 0) === 10);
    }
  }, [data, task_page]);

  // Reset tasks if filter/search changes
  useEffect(() => {
    setTasks([]);
    setHasMore(true);
    // Reset to first page
    dispatch(TaskPage(1));
  }, [task_filter, task_string]);

  // Infinite scroll logic
  const loaderRef = useRef();
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isFetching) {
      dispatch(TaskPage(task_page + 1));
    }
  }, [hasMore, isFetching, task_page, dispatch]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  // Kanban logic (unchanged)
  const normalizeTaskStage = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const lower = raw.toLowerCase();
    if (lower === "to do" || lower === "todo") return "New";
    if (lower === "in progress" || lower === "in_progress" || lower === "inprogress") return "In Process";
    if (lower === "done") return "Completed";
    return raw;
  };

  const [updateLead, GetUpdateLeadResponse] = useUpdateTaskMutation();
  const [deleteTask, GetDeleteTaskResponse] = useDeleteTaskMutation();
  const [editTask, setEditTask] = useState(false);
  const [getData, setGetData] = useState();
  const performCancel = () => {
    setEditTask(false);
    setGetData();
    setGoTo();
  };
  const [play, setPlay] = useState(tasks);
  const handleOpen = (data) => {
    setGetData(data);
    setEditTask(true);
  };
  useEffect(() => {
    setPlay(tasks);
  }, [tasks]);
  const [goTo, setGoTo] = useState();
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (
      destination?.droppableId &&
      source?.droppableId &&
      destination?.droppableId !== source?.droppableId
    ) {
      if (checkAssigned(play, result?.draggableId) === 0) {
        message.error("Please Assign The User");
        setGoTo(result?.destination?.droppableId);
        handleOpen(result?.draggableId);
      } else if (destination?.droppableId === "Completed") {
        message.error("Please Enter OutCome");
        setGoTo(result?.destination?.droppableId);
        handleOpen(result?.draggableId);
      } else {
        const structure = {
          _id: result?.draggableId,
          taskStages: result?.destination?.droppableId,
        };
        setPlay(
          play?.map((item) => {
            if (item._id === structure._id) {
              return {
                ...item,
                taskStages: structure.taskStages,
              };
            }
            return item;
          })
        );
        updateLead(structure);
      }
    }
  };

  return (
    <>
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
      />
      <EResponse
        error={GetDeleteTaskResponse?.error?.data?.message}
        Response={GetDeleteTaskResponse}
        type={"delete"}
      />
      {/* {fetch && <UniversalLoading />} */}

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            minWidth: "100%",
            overflow:"auto",
            height: "100%",
            // background:"#f5f5f5",
            padding: "10px",
          }}
        >
          {TaskStage?.map((item) => (
            <KanbanTaskColumn
            deleteTask={deleteTask}
            handleOpen={handleOpen}
              key={item}
              columnName={item}
              data={play?.filter((it) => normalizeTaskStage(it?.taskStages) === item)}
            />
          ))}
        </div>
      </DragDropContext>

      {/* <DragDropContext onDragEnd={()=>{}}>
      <Droppable droppableId="kanban-board">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {play.map((task, index) => (
              <KanbanTaskBox key={task._id} taskData={task} index={index} />
            ))}
            ss{provided.placeholder}ss
          </div>
        )}
      </Droppable>
    </DragDropContext> */}
    
{editTask && (
        <CustomModel performCancel={performCancel} width={"80vw"}>
          <MainTask task_id={getData} performCancel={performCancel} goTo={goTo}/>
        </CustomModel>
      )}
      {/* Loader for infinite scroll */}
      <div ref={loaderRef} style={{ height: 40, textAlign: "center" }}>
        {(isFetching || isLoading) && hasMore && <UniversalLoading />}
        {!hasMore && <span style={{ color: '#aaa' }}>No more tasks</span>}
      </div>
    </>
  );
};

export default TaskKanban;
