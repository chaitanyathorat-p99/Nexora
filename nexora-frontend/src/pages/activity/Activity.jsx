import React, { useState } from "react";
import DateTag from "./sub-components/DateTag";
import {
  ActivityContainer,
  ActivityContent,
  ChangesList,
  ChangeItem,
} from "./ActivityStyle";
import PencilIcon from "./sub-components/PencilIcon";
import NoteIcon from "./sub-components/NoteIcon";
import { getLabel, IDateOnly, ITime } from "../../atoms/State";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useFetchActivityQuery } from "../../features/allApi";
import LoadingHV from "../../atoms/loading/LoadingHV";
import ShowPopUp from "./sub-components/ShowPopUp";

const Activity = ({ lead }) => {
  const [visibleDetails, setVisibleDetails] = useState({});
  const {
    data: activityData = [],
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchActivityQuery({ lead: lead?._id });
  const [visibleComponent, setVisibleComponent] = useState(""); // default to 'A'
const [getId, setGetId] = useState("");
const performCancel=()=>{
  setGetId()
  setVisibleComponent()
}
  const toggleDetails = (id) => {
    console.log("ID", id);
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sort and group activities by date
  const groupedActivities = activityData
    ? activityData.reduce((acc, activity) => {
        const date = new Date(activity?.updatedAt).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
      }, {})
    : {}; // Default to an empty object if activityData is undefined

  const sortedDates = activityData
    ? Object.keys(groupedActivities).sort((a, b) => new Date(b) - new Date(a))
    : []; // Default to an empty array if activityData is undefined
  return (
    <>
      {isLoading ? (
        <LoadingHV />
      ) : (
        <>
          {sortedDates.map((date) => (
            <div key={date}>
              <div style={{ position: "relative", left: "2rem", zIndex: "1" }}>
                <DateTag date={date} />
              </div>
              {groupedActivities[date].map((activity) => (
                <ActivityContainer key={activity?._id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <div
                      style={{
                        width: "2px",
                        background: "#ccc",
                        height: "100%",
                        position: "absolute",
                        left: "95px",
                        zIndex: 0,
                      }}
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        left: "0rem",
                        top: "51px",
                        color: "#212427",
                      }}
                    >
                      {ITime(activity?.createdAt)}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "2rem",
                        left: "4rem",
                        zIndex: 1,
                      }}
                    >
                      {activity?.module === "Lead" ? (
                        <NoteIcon />
                      ) : (
                        <PencilIcon />
                      )}
                    </div>
                    <ActivityContent
                      style={{
                        flexGrow: 1,
                        marginLeft: "7rem",
                        marginTop: "2rem",
                      }}
                    >
                      {/* Activity Title with onClick event */}

                      <span
                        style={{
                          cursor: "pointer",
                          color: "var(--color-primary)",
                        }}
                        // onClick={() => handleShowCompany(activity?.relatedId)}
                        onClick={() => {
                          if (activity?.module !== "Lead") {
                            console.log("lion");
                            if (activity?.action === "deleted") {
                              setGetId(activity?.changes[0]?.From)
                              setVisibleComponent(activity?.module);
                            } else {
                              if (activity?.relatedId) {
                               setGetId(activity?.relatedId)
                                setVisibleComponent(activity?.module);
                              } else {
                                message.error("This Record Must be Deleted");
                              }
                            }
                          }

                          console.log("tiger");
                        }}
                      >
                        {activity?.module} {activity?.action}
                      </span>
                      <br />
                      <span style={{ fontSize: "10px", color: "#212427" }}>
                        {activity?.createdBy?.name}{" "}
                        {IDateOnly(activity?.createdAt)}
                      </span>
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            color: "var(--color-primary)",
                          }}
                          onClick={() => toggleDetails(activity?._id)}
                        >
                          {activity?.action === "deleted" ||
                          activity?.action === "created"||(activity?.action==="revision") ? null : (
                            <>
                              {visibleDetails[activity?._id]
                                ? "Hide Details ▲"
                                : "Show Details ▼"}
                            </>
                          )}
                        </div>
                        {visibleDetails[activity?._id] && (
                          <>
                            <ChangesList>
                              {activity?.changes?.map((change, idx) =>
                                !change?.field.includes("product") ? (
                                  <ChangeItem key={idx}>
                                    <span style={{ color: "black" }}>
                                      <b>{getLabel(change?.field)}</b> was{" "}
                                      <b>updated</b> from{" "}
                                      <b>
                                        "
                                        {change?.From?.name
                                          ? change?.From?.name
                                          : change?.From}
                                        "
                                      </b>{" "}
                                      to{" "}
                                      <b>
                                        "
                                        {change?.To?.name
                                          ? change?.To?.name
                                          : change?.To}
                                        "
                                      </b>
                                    </span>
                                  </ChangeItem>
                                ) : (
                                  <>
                                    <ChangeItem key={idx}>
                                      {change?.To === "Deleted" ? (
                                        <span style={{ color: "black" }}>
                                          <b>{getLabel(change?.field)}</b> was{" "}
                                          <b>removed</b>
                                        </span>
                                      ): change?.From==="New Item"?
                                      
                                      <>
                                        <span style={{ color: "black" }}>
                                          <b>{getLabel(change?.field)}</b> was{" "}
                                          <b>added</b>
                                        </span>
                                      </>
                                      : (
                                        <span style={{ color: "black" }}>
                                          <b>{getLabel(change?.field)}</b> was{" "}
                                          <b>updated</b> from{" "}
                                          <b>
                                            "
                                            {change?.From?.name
                                              ? change?.From?.name
                                              : change?.From}
                                            "
                                          </b>{" "}
                                          to{" "}
                                          <b>
                                            "
                                            {change?.To?.name
                                              ? change?.To?.name
                                              : change?.To}
                                            "
                                          </b>
                                        </span>
                                      )}
                                    </ChangeItem>
                                  </>
                                )
                              )}
                            </ChangesList>
                            {activity?.relatedId === null &&
                              activity?.module !== "Lead" && (
                                <div style={{ padding: "10px", color: "red" }}>
                                  This record has been deleted.
                                </div>
                              )}
                          </>
                        )}
                      </>
                    </ActivityContent>
                  </div>
                </ActivityContainer>
              ))}
            </div>
          ))}
          <ShowPopUp visibleComponent={visibleComponent} getId={getId} performCancel={performCancel}/>
        </>
      )}
    </>
  );
};

export default Activity;
