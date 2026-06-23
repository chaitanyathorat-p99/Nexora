import React from "react";
import CustomModel from "../../../atoms/model/CustomModel";

const MeetingCardPopUp = ({ meeting, performCancel }) => {
    const {
        title ,
        dueDate ,
        desc,
        outcome,
        platForm,
        meetingType,
        meetingLink,
        meetingDone,
        meetingNote,
        createdBy,  // Assuming this is an object with user details
        assignedTo,  // Assuming this is an object with user details
        fromData,
    } = meeting || {};

    console.log("From Data", fromData);

    const styles = {
        card: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            width: '400px',
            height: "350px",
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
            <CustomModel performCancel={performCancel} width={"40vw"} marginTop={"1rem"} height={"60vh"}>
                <div style={styles.card}>
                    {fromData && fromData.length > 0 ? (
                        <>
                            <h1>Deleted Meeting Details:</h1>
                            <ul>
                                {fromData.map((data, index) => {
                                    // Destructure and omit unwanted fields
                                    const { _id, lead, meetingDone, meetingNote, meetingLink, createdBy, assignedTo, companyMaster, createdAt, updatedAt, __v, ...filteredData } = data.value;

                                    return (
                                        <li key={index}>
                                            {Object.entries(filteredData).map(([field, value]) => (
                                                <div key={field}>
                                                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {value || 'N/A'}
                                                </div>
                                            ))}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h1>Meeting Timeline Details</h1>
                            <h2 style={styles.header}>{title}</h2>
                            <p style={styles.description}>{desc}</p>
                            <div style={styles.details}>
                                <p><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Platform:</strong> {platForm}</p>
                                <p><strong>Meeting Type:</strong> {meetingType}</p>
                                {meetingLink && <p><strong>Meeting Link:</strong> <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a></p>}
                                <p><strong>Meeting Done:</strong> {meetingDone ? "Yes" : "No"}</p>
                                {meetingNote && <p><strong>Meeting Note:</strong> {meetingNote}</p>}
                                <p><strong>Outcome:</strong> {outcome || "N/A"}</p>
                            </div>
                        </>
                    )}
                </div>
            </CustomModel>
        </div>
    );
};

export default MeetingCardPopUp;
