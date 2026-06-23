import React, { useState } from "react";
import {
  useCreateNoteMutation,
  useFetchLeadStatusQuery,
  useFetchNoteQuery,
  useUpdateLeadMutation,
  useFetchDynamicFieldsByModuleQuery,
} from "../../../features/allApi";
import EResponse from "../../../atoms/response/EResponse";
import { Button, Flex, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ArrowBigDown, Pencil } from "lucide-react";
import { BiPaperPlane, BiSolidPaperPlane } from "react-icons/bi";
import { FaPaperPlane, FaSave } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import StepIndicator from "../../../components/steps/StepIndicator";
import MainNotes from "./notes/MainNotes";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import "./CRMOverview.css";
import { useSelector } from "react-redux";
import EditButtonOverView from "../../../atoms/overview/EditButtonOverView";
import StatusComponent from "./componenets/StatusComponent";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";

const OverviewComponent = ({ data }) => {
  const formattedDate = new Date(data?.createdAt).toLocaleDateString();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const [editThe, setEditThe] = useState();

  const moduleType = "lead"; // Make this dynamic if needed in the future
  // Fetch dynamic fields for lead module
  const {
    data: dynamicFields,
    isLoading: dynamicFieldsLoading,
  } = useFetchDynamicFieldsByModuleQuery({ moduleType });

  const {
    data: notes,
    isLoading: notes_isLoading,
    isFetching: notes_fetch,
  } = useFetchNoteQuery({ lead: data?._id });
  const [updateLead, GetUpdateLeadResponse] = useUpdateLeadMutation();
  const [createNote, GetCreateNoteResponse] = useCreateNoteMutation();


  const [noteWriten, setNoteWriten] = useState("");
  const onChange = (e) => {
    setNoteWriten(e.target.value);
  };
  const handleSendNote = () => {
    console.log(noteWriten);
    if (noteWriten.length > 0) {
      const structure = {
        description: noteWriten,
        lead: data?._id,
        createdBy: user?._id,
      };
      createNote(structure);
    } else {
      message.error("Please write the note");
    }
  };

  return (
    <div style={styles.container}>

      <EResponse
        error={GetCreateNoteResponse?.error?.data?.message}
        Response={GetCreateNoteResponse}
        type={"create"}
        cancel={() => setNoteWriten("")}
      />

      <h2 style={styles.sectionTitle}>Overview</h2>
      <hr />
      <div style={styles.lifecycleContainer}>
        {/* <div style={styles.lifecycleStageContainer}> */}
        {/* <span style={styles.lifecycleStage}>Lifecycle stage:</span> */}
        {/* <span style={styles.lifecycleStageValue}>{data?.user?.userType}</span> */}
        {/* </div> */}
        <StatusComponent styles={styles} updateLead={updateLead} GetUpdateLeadResponse={GetUpdateLeadResponse} data={data} />
      </div>
      <div style={styles.tags}>Click to add tags</div>
      <div style={{ display: "flex" }}>
        <div style={styles.detailsContainer}>
          {/* <EditButtonOverView toUpdate={data?._id} saveTo={"address"} editThe={editThe} setEditThe={setEditThe} style={styles.detailItem} label={"Location"} data={`${data?.info?.address},${data?.info?.city},${data?.info?.country}`} /> */}
          <div>
            <EditButtonOverView
              toUpdate={data}
              saveTo={"info.address"}
              editThe={editThe}
              setEditThe={setEditThe}
              style={styles.detailItem}
              edit={"Address"}
              label={"Address"}
              data={`${data?.address || data?.info?.address || ""}`}
            />
            <EditButtonOverView
              toUpdate={data}
              saveTo={"info.city"}
              editThe={editThe}
              setEditThe={setEditThe}
              style={styles.detailItem}
              edit={"City"}
              label={""}
              data={`${data?.city || data?.info?.city || ""}`}
            />
            <EditButtonOverView
              toUpdate={data}
              saveTo={"info.country"}
              editThe={editThe}
              setEditThe={setEditThe}
              style={styles.detailItem}
              edit={"Country"}
              label={""}
              data={data?.country || data?.info?.country}
            />
          </div>
          <EditButtonOverView
            edit={"Account"}
            toUpdate={data}
            saveTo={"firstName"}
            editThe={editThe}
            setEditThe={setEditThe}
            style={styles.detailItem}
            label={"Account"}
            data={data?.firstName}
          />
          <EditButtonOverView
            edit={"Email"}
            toUpdate={data}
            saveTo={"email"}
            editThe={editThe}
            setEditThe={setEditThe}
            style={styles.detailItem}
            label={"Email"}
            data={data?.email}
          />
          <EditButtonOverView
            edit={"Mobile"}
            toUpdate={data}
            saveTo={"info.mobile"}
            editThe={editThe}
            setEditThe={setEditThe}
            style={styles.detailItem}
            label={"Mobile"}
            data={data?.mobile || data?.info?.mobile}
          />

          <div style={styles.detailItem}>
            <strong>Created By:</strong> {data?.createdBy?.name}
          </div>
          <div style={styles.detailItem}>
            <strong>Created At:</strong> {formattedDate}
          </div>

          {/* Dynamic Fields Section */}
          {dynamicFields && dynamicFields.length > 0 && (
            <>
              <div style={styles.detailItem}>
                <strong>Additional Fields:</strong>
              </div>
              {dynamicFields.map((field) => (
                <div key={field.fieldName} style={styles.detailItem}>
                  <strong>{field.displayName}:</strong>{" "}
                  {data?.dynamicFields?.[field.fieldName] || "-"}
                </div>
              ))}
            </>
          )}
        </div>
        <div style={styles.notesContainer}>
          {/* <h3 style={styles.notesTitle}>Notes</h3> */}
          {/* {notes?.map((note, index) => (
        <div key={index} style={styles.noteItem}>
          {note}
        </div>
      ))} */}
          <div style={{ backgroundColor: "var(--note)" }}>
            <Flex vertical gap={32}>
              <TextArea
                showCount
                maxLength={250}
                value={noteWriten}
                onChange={onChange}
                //  className="custom-textarea-notes"
                placeholder="Add Notes"
                style={{
                  height: 120,
                  resize: "none",
                  background: "var(--note)",
                  outline: "none",
                  boxShadow: "none",
                  border: "none",
                }}
              />
              <Button
                loading={GetCreateNoteResponse?.isLoading}
                onClick={handleSendNote}
              >
                Save
                <FaSave />
              </Button>
            </Flex>
          </div>
          {notes_isLoading ? <LoadingHV /> : <MainNotes notes={notes} />}
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
