import React from "react";
import KanbanTaskBox from "./KanbanTaskBox";
import { Droppable } from "react-beautiful-dnd";

const KanbanTaskColumn = ({ columnName, data, handleOpen, deleteTask }) => {
  return (
    <>
      <Droppable droppableId={columnName}>
        {(provided, snapshot) => (
          <>
            <div
              style={{
                background: snapshot.isDraggingOver ? "lightblue" : "", // Highlight color when dragging over
                padding: "8px",
                minHeight: "100px",
                transition: "background-color 0.3s ease",
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div style={{ flex: "1" }}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <p>{columnName}</p>
                  <p
                    style={{
                      width: "30px",
                      borderRadius: "360px",
                      height: "30px",
                      background: "var(--dot)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    {data?.length}
                  </p>
                </div>
                {data?.map((item, index) => (
                  <KanbanTaskBox
                    key={item?._id}
                    taskData={item}
                    index={index}
                    handleOpen={handleOpen}
                    deleteTask={deleteTask}
                  />
                ))}
              </div>
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
      <div
        style={{
          // background: "red",
          border: "0.5px solid lightgrey",
          // width: "100px",
        }}
      ></div>
    </>
  );
};

export default KanbanTaskColumn;
