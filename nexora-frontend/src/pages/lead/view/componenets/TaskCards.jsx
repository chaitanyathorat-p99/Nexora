import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, List } from "antd";
import moment from "moment";
import React from "react";
import { Checkbox as AntCheckbox } from 'antd';
import styled from "styled-components";
import { FcExpired } from "react-icons/fc";
const TaskCards = ({ lead2, dataSource, onTaskStatusChange, selectedData, outComeShow, handleOutcome, setOutcome, outcome, setSelectedData, completed }) => {
  const DarkCheckbox = styled(AntCheckbox)`
  .ant-checkbox-inner {
    background-color: #fff;
    border-color: #000;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #000;
    border-color: #000;
  }

  .ant-checkbox-checked::after {
    border-color: #fff;
  }

  &:hover .ant-checkbox-inner {
    border-color: #555;
  }
`;
  const isOverdue = (dueDate) => moment().isAfter(dueDate);
  return (
    <div
      style={{ height: "400px", overflowY: "auto" }}
      className="custom-scrollbar"
    >
      <List

        dataSource={dataSource}
        renderItem={(task) => (
          <>
            <List.Item
              style={{  background: selectedData === task?._id
                ? "#d2eded"
                : !completed && isOverdue(task?.dueDate)
                  ? "#f1e8e8" // Background color for overdue tasks
                  : "", // Default background color if neither condition is met
              paddingLeft: "20px",
            }}
              actions={[
                <DarkCheckbox
                  checked={task.taskStatus}
                  onChange={() => {
                    if (selectedData === task._id) {
                      setSelectedData()
                    } else {
                      onTaskStatusChange(task._id, !task.taskStatus)
                    }
                  }}
                >
                  {/* Completed */}
                </DarkCheckbox>
              ]}
            >
              <List.Item.Meta
                avatar={!completed && isOverdue(task?.dueDate) ? <FcExpired style={{ fontSize: "25px" }} /> : <UserOutlined style={{ fontSize: "25px" }} />}
                title={<a href="https://ant.design">{task?.title}</a>}
                description={
                  <>
                    {task?.taskStatus ? (
                      <p>
                        <s>{task?.description}</s>
                      </p>
                    ) : (
                      <p>{task?.description}</p>
                    )}
                    {!completed && isOverdue(task?.dueDate) && (
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        This task has been overdue
                      </p>
                    )}
                    {task?.outcome ? <>Outcome : {task?.outcome}</> : null}
                    <p>
                      Assigned to {task?.assignedTo?.name} &bull; Added{" "}
                      {moment(task?.createdAt).format("DD MMM YYYY")}
                    </p>
                  </>
                }
              />
            </List.Item>
            {outComeShow && selectedData === task?._id && <>
              <Input
                required
                placeholder="Enter task outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Button style={{ marginBottom: "20px" }} type="primary" icon={<ArrowRightOutlined />} onClick={handleOutcome}>
                Submit
              </Button>
            </>}
          </>
        )}
      />



    </div>
  );
};

export default TaskCards;
