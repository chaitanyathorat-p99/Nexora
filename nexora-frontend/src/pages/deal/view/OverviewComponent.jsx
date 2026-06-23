import React, { useState } from "react";
import {
  useUpdateDealMutation,
} from "../../../features/allApi";
import EResponse from "../../../atoms/response/EResponse";
import { Button, Flex, Input, message } from "antd";
import { useSelector } from "react-redux";
import EditButtonOverView from "../../../atoms/overview/EditButtonOverView";
import StatusComponent from "./components/StatusComponent";
import ProductTable from "../../../components/tables/ProductTable";

const OverviewComponent = ({ data }) => {
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const [editThe, setEditThe] = useState();

  const [updateLead, GetUpdateLeadResponse] = useUpdateDealMutation();


  const formattedDate = new Date(data?.createdAt).toLocaleDateString();
  console.log("Deal Data", data);
  // console.log("Deal Data", dealData?.fromData)


  return (
    <div style={styles.container}>


      <h2 style={styles.sectionTitle}>Overview</h2>
      <hr />
      <div style={styles.lifecycleContainer}>
        {/* <div style={styles.lifecycleStageContainer}> */}
        {/* <span style={styles.lifecycleStageValue}>{data?.user?.userType}</span> */}
        {/* </div> */}
        <StatusComponent styles={styles} updateLead={updateLead} GetUpdateLeadResponse={GetUpdateLeadResponse} data={data} />
      </div>
      <div style={styles.tags}>Click to add tags</div>
      <div style={{ display: "flex" }}>
        <div style={styles.detailsContainer}>
          {/* <EditButtonOverView toUpdate={data?._id} saveTo={"address"} editThe={editThe} setEditThe={setEditThe} style={styles.detailItem} label={"Location"} data={`${data?.info?.address},${data?.info?.city},${data?.info?.country}`} /> */}
       
         
          <div style={styles.detailItem}>
            <strong>Deal Type:</strong> {data?.dealType}
          </div>
          <div style={styles.detailItem}>
            <strong>Created By:</strong> {data?.createdBy?.name}
          </div>
          <div style={styles.detailItem}>
            <strong>Created At:</strong> {formattedDate}
          </div>
          <div style={{gridColumn:"3 span"}}>
   <ProductTable formValue={data}/>
    

   </div>
        </div>
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    // padding: "20px",
    // border: "1px solid #ccc",
    borderRadius: "5px",
  },
  sectionTitle: {
    fontSize: "1.2em",
    marginBottom: "20px",
  },
  lifecycleContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  lifecycleStageContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  textArea: {
    width: "100%",
    minHeight: "100px",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "8px 16px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  lifecycleStage: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  lifecycleStageValue: {
    color: "var(--color-primary)",
  },
  statusContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  statusLabel: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexWrap: "wrap",
  },
  status: {
    padding: "5px 10px",
    cursor: "pointer",
    border: "1px solid var(--color-primary)",
    borderRadius: "5px",
    backgroundColor: "var(--color-primary)",
    color: "#fff",
  },
  statusConnector: {
    padding: "5px 10px",
    cursor: "pointer",

    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  tags: {
    marginBottom: "20px",
    color: "var(--color-primary)",
    cursor: "pointer",
  },
  detailsContainer: {
    flex: "5",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  detailItem: {
    padding: "0px 10px",
    // border: "1px solid #ccc",
    borderRadius: "5px",
  },
  notesContainer: {
    flex: "2",
    // paddingBottom: "20px",
  },
  notesTitle: {
    fontSize: "1.2em",
    marginBottom: "10px",
  },
  noteItem: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  "@media (max-width: 768px)": {
    detailsContainer: {
      gridTemplateColumns: "1fr",
    },
  },
};

export default OverviewComponent;
