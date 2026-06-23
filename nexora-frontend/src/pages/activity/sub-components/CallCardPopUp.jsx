import React from "react";
import CustomModel from "../../../atoms/model/CustomModel";

const CallCardPopUp = ({ callData, performCancel }) => {
    const {
        title = "",
        dueDate = null,
        desc = "",
        outcome = "",
        callDone = false,
        callNote = "",
        createdBy = {},  // Assuming this is an object with user details
        assignedTo = {},  // Assuming this is an object with user details
        fromData,
    } = callData || {};

    console.log("From Data of Call", fromData);

    const styles = {
        card: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            width: '400px',
            height: "450px",
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
            <CustomModel performCancel={performCancel} width={"40vw"} marginTop={"1rem"} height={"80vh"}>
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
                            <h1>Call Timeline Details</h1>
                            <h2 style={styles.header}>{title}</h2>
                            <p style={styles.description}>{desc}</p>
                            <div style={styles.details}>
                                <p><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Call Done:</strong> {callDone ? "Yes" : "No"}</p>
                                <p><strong>Call Note:</strong> {callNote}</p>
                                <p><strong>Outcome:</strong> {outcome || "N/A"}</p>
                            </div>
                        </>
                    )}
                </div>
            </CustomModel>
        </div>
    );
};

export default CallCardPopUp;
