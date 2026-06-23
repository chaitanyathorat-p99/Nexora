import React, { useMemo, useState } from "react";
import { Button, Card, Col, Popconfirm, Row, Tooltip, Dropdown } from "antd";
import { Draggable } from "react-beautiful-dnd";
import MainTask from "../../form/MainTask";
import PencilButtonEdit from "../../../../atoms/button/PencilButtonEdit";
import CustomModel from "../../../../atoms/model/CustomModel";
import {
  ClockCircleFilled,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import "./Kanban.css";
import {
  getRandomColor,
  IDateDesign,
  IDateOnly,
} from "../../../../atoms/State";
import { Timer } from "lucide-react";
import { RxTrash } from "react-icons/rx";
import moment from "moment/moment";

const KanbanTaskBox = ({ taskData, index, handleOpen, deleteTask }) => {
  const normalizedAssignees = useMemo(() => {
    const raw = taskData?.assignedTo;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
      .map((assignee) => {
        if (!assignee) return null;
        if (typeof assignee === "string") {
          return { _id: assignee, name: assignee };
        }
        return {
          _id: assignee?._id || assignee?.id || assignee?.userId,
          name: assignee?.name || assignee?.username || assignee?._id || "User",
          email: assignee?.email,
        };
      })
      .filter(Boolean);
  }, [taskData?.assignedTo]);

  const dropdownItems = useMemo(() => {
    const dropdownItems = [
      {
        label: "View Card",
        key: "1",
        icon: <EyeOutlined />,
        onClick: () => {
          handleOpen(taskData?._id);
        },
      },
      {
        danger: true,
        label: "Delete card",
        key: "2",
        icon: <DeleteOutlined />,
        onClick: () => {
          deleteTask({ _id: taskData?._id });
        },
      },
    ];
    return dropdownItems;
  }, []);
  const isOverdue = (dueDate) => moment().isAfter(dueDate);
  return (
    <>
      <Draggable draggableId={taskData._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              marginBottom: "10px",
              fontSize: "10px",
              minWidth: "300px",
              borderRadius: "10px",
              padding: "10px",
              background: snapshot.isDragging ? "#f0f0f0" : "white",
              boxShadow: snapshot.isDragging
                ? "0px 3px 5px rgba(0, 0, 0, 0.2)"
                : "0px 0px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                width: "100%",
                cursor: "move",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 style={{ fontSize: "18px" }}>{taskData?.title}</h1>
                <div style={{ display: "flex", gap: "3px" }}>
                  <div>
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: dropdownItems,
                      }}
                      placement="bottom"
                      arrow={{ pointAtCenter: true }}
                    >
                      <Button
                        type="text"
                        shape="circle"
                        icon={
                          <MoreOutlined
                            style={{
                              transform: "rotate(90deg)",
                            }}
                          />
                        }
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </Dropdown>
                  </div>
                </div>
              </div>
              {/* 
              <hr />
              <p>
                <strong>Outcome:</strong> {taskData?.outcome}
              </p> */}
              <hr style={{ margin: "3px 0" }} />
              {taskData?.outcome ? (
                <p style={{ margin: "3px 0" }}>
                  <strong>Outcome:</strong> {taskData?.outcome}
                </p>) : null}
              {isOverdue(taskData?.dueDate) && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  This task has been overdue
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    border: "1px solid #ff4d4f",
                    padding: "2px 5px",
                    width: "140px",
                    display: "flex",
                    borderRadius: "6px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <Timer color="#ff4d4f" width={"15px"} />
                  </span>
                  <span>{IDateDesign(taskData?.dueDate)}</span>
                </div>
                <div style={{ display: "flex", margin: "5px 0px" }}>
                    {normalizedAssignees.map((user) => (
                    <div key={user._id}>
                      <Tooltip
                        title={
                          <>
                            <div>{user?.name}</div>
                              {user?.email ? <div>{user.email}</div> : null}
                          </>
                        }
                        placement="left"
                        overlayClassName="customTooltip"
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "teal",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "10px",
                            fontSize: "1.2em",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          {String(user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default KanbanTaskBox;
