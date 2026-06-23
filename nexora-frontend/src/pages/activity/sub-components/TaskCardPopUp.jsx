import React from "react";
import CustomModel from "../../../atoms/model/CustomModel";

const TaskCardPopUp = ({ task, performCancel }) => {
    console.log("TaskCardPopUp", task);

    const {
        title = "No title",
        description = "No description available",
        dueDate = null,
        outcome = "N/A",
        taskStages = "Unknown",
        assignedTo = {},
        assignedBy = {},
        createdBy = {},
        taskStatus = "Pending",
        fromData,
    } = task || {};

    console.log("Task From Data", fromData);
    const styles = {
        card: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            width: '450px',
            height: "400px",
            margin: '20px auto',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            fontSize: '1.5em',
            marginBottom: '10px',
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: '#333',
        },
        description: {
            fontSize: '1em',
            color: '#666',
            marginBottom: '10px',
        },
        details: {
            marginTop: '10px',
        },
        button: {
            display: 'block',
            width: '100%',
            padding: '10px',
            marginTop: '20px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            fontSize: '1em',
        },
    };

    return (
        <div>
            <CustomModel performCancel={performCancel} width={"40vw"} marginTop={"1rem"} height={"65vh"}>
                <div style={styles.card}>
                    {fromData && fromData.length > 0 ? (
                        <>
                            <h1>Deleted Meeting Details:</h1>
                            <ul>
                                {fromData.map((data, index) => (
                                    <li key={index}>
                                        {Object.entries(data.value).map(([field, value]) => (
                                            <div key={field}>
                                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {value || 'N/A'}
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h1>Task Details</h1>
                            <h2 style={styles.header}>{title}</h2>
                            <p style={styles.description}>{description}</p>
                            <div style={styles.details}>
                                <p><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>
                                <p><strong>Task Status:</strong> {taskStatus ? "Completed" : "Pending"}</p>
                                <p><strong>Outcome:</strong> {outcome || "N/A"}</p>
                            </div>
                        </>

                    )}
                </div>
            </CustomModel>
        </div>
    );
};

export default TaskCardPopUp;
