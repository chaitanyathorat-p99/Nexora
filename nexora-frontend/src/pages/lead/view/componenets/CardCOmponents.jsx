import React, { useState } from "react";
import TaskCards from "./TaskCards";
import { Button, Card, DatePicker, Form, Input, message } from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { IDate, IDateOnly } from "../../../../atoms/State";
import { useCreateTaskMutation } from "../../../../features/allApi";
import EResponse from "../../../../atoms/response/EResponse";
import SmallSubHeaders from "../../../../components/moduleHeaders/SmallSubHeaders";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const CardCOmponents = ({
  lead,
  moduleData,
  module,
  user,
  update,
  create,
  createResponse,
  updateResponse,
}) => {
  const [taskAdd, setTaskAdd] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [outcome, setOutcome] = useState("");

  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [selectedData, setSelectedData] = useState();
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDescription || !taskDueDate) {
      message.error("All fields are required!");
      return;
    }
    // Implement the logic to add the task
    console.log("Task to add:", {
      title: taskTitle,
      description: taskDescription,
    });
    // Clear the input fields and close the add task section
    if (lead?.assignedTo?._id) {
      const structure = {
        title: taskTitle,
        description: taskDescription,
        lead: lead?._id, // Sample ObjectId for Lead
        taskStatus: false,
        dueDate: taskDueDate,
        outcome: "Pending",
        assignedTo: [lead?.assignedTo?._id],
        assignedBy: user?._id,
        createdBy: user?._id,
      };
      console.log(structure);
      create(structure);
    } else {
      message.error("Cant Create No assigned To for the lead");
    }
  };
  const performCancel = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate(null);
    setTaskAdd(false);
    setOutComeShow(false);
    setOutcome("");
    setSelectedData();
  };
  const [outComeShow, setOutComeShow] = useState(false);
  const onTaskStatusChange = (data, status) => {
    if (status === true) {
      setOutComeShow(true);
      setSelectedData(data);
    } else {
      const structure = {
        _id: data,
        taskStatus: status,
      };
      update(structure);
    }
  };
  const handleOutcome = () => {
    const structure = {
      _id: selectedData,
      taskStatus: true,
      taskStages:"Completed",
      outcome: outcome,
    };
    update(structure);
  };
  return (
    <Card style={{ flex: 1, position: "static" }}>
      <EResponse
        Response={createResponse}
        type={"create"}
        cancel={performCancel}
      />
      <EResponse
        Response={updateResponse}
        type={"update"}
        cancel={performCancel}
      />

      <div>
        <Button
          style={{ margin: "20px" }}
          type="primary"
          icon={<UserOutlined />}
          onClick={() => {
            if (lead?.assignedTo?._id) {
              setTaskAdd(!taskAdd);
            } else {
              message.error("Assign User To Lead");
            }
          }}
        >
          Add
        </Button>
        {taskAdd && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <Form onSubmit={handleAddTask}>
              <Input
                required
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <TextArea
                required
                placeholder="Enter task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <DatePicker
                showTime
                required
                placeholder="Select due date"
                value={taskDueDate ? dayjs(taskDueDate) : null}
                onChange={(date) =>
                  setTaskDueDate(date ? date.toISOString() : null)
                }
                style={{ marginBottom: "10px" }}
              />
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleAddTask}
              >
                Submit
              </Button>
            </Form>
          </div>
        )}

<SmallSubHeaders title={`Open Tasks (${moduleData?.filter((item) => !item.taskStatus)?.length} left)`} />


        <TaskCards
        setSelectedData={setSelectedData}
          setOutcome={setOutcome}
          outcome={outcome}
          outComeShow={outComeShow}
          handleOutcome={handleOutcome}
          selectedData={selectedData}
          moduleData={moduleData}
          dataSource={moduleData?.filter((item) => !item.taskStatus)}
          onTaskStatusChange={onTaskStatusChange}
        />
      </div>
      <div>
        <SmallSubHeaders title={"Closed Tasks"} />

        <TaskCards
        completed={true}
          moduleData={moduleData}
          dataSource={moduleData?.filter((item) => item.taskStatus)}
          onTaskStatusChange={onTaskStatusChange}
        />
      </div>
    </Card>
  );
};

export default CardCOmponents;
