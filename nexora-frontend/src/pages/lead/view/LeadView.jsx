import React, { useState } from "react";
import { Card, List, Tag, Button, Tabs } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import CardCOmponents from "./componenets/CardCOmponents";
import TabPane from "antd/es/tabs/TabPane";
import LeadProfileCard from "./componenets/LeadProfileCard";
import { useSelector } from "react-redux";
import {
  useCreateTaskMutation,
  useFetchLeadQuery,
  useFetchTaskQuery,
  useUpdateTaskMutation,
} from "../../../features/allApi";
import EResponse from "../../../atoms/response/EResponse";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import OverviewComponent from "./OverviewComponent";
import CompanyContainer from "./company/CompanyContainer";
import Deal from "../../deal/Deal";
import DealOverview from "../../deal/DealOverview";
import CustomToolTip from "../../../atoms/tooltip/CustomToolTip";
import Meeting from "../../meeting/Meeting";
import Call from "../../call/Call";
import Activity from "../../activity/Activity";

const LeadView = ({ lead }) => {
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const {
    data: task,
    isLoading: task_isLoading,
    isFetching: task_fetch,
    error: task_error,
  } = useFetchTaskQuery({
    lead: `lead=${lead?._id}`,

    filterString: "",
    filterObj: "",
    page: "",
  });

  const [activeTab, setActiveTab] = useState("1");
  const [createTask, createTaskResponse] = useCreateTaskMutation();
  const [updateTask, updateTaskResponse] = useUpdateTaskMutation();

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {/* <LeadProfileCard lead={lead} /> */}
      <Card
        style={{ flex: 1, position: "static" }}
        className="ant-card-body--p0"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ padding: "0px 20px" }}
        >
          <TabPane tab="Overview" key="1">
            <>
              <OverviewComponent data={lead} />
            </>
          </TabPane>
          <TabPane tab="Tasks" key="2">
            {task ? (
              <CardCOmponents
                lead={lead}
                moduleData={task}
                module={"task"}
                user={user}
                create={createTask}
                update={updateTask}
                createResponse={createTaskResponse}
                updateResponse={updateTaskResponse}
              />
            ) : (
              <LoadingHV />
            )}
          </TabPane>
          <TabPane tab="Company" key="3">
            <CompanyContainer lead={lead} />
          </TabPane>
          <TabPane tab="Deals" key="4">
            {/* <CompanyContainer lead={lead}/> */}
            <div style={{ maxWidth: "1200px" }}>
              <DealOverview popUp={true} lead_id={lead?._id} />
            </div>
          </TabPane>
          <TabPane tab="Meetings" key="6">
            <div style={{ maxWidth: "1200px" }}>
              <Meeting insideLead={true} lead_id={lead?._id} />
            </div>
          </TabPane>
          <TabPane tab="Calls" key="7">
            {/* <div style={{ maxWidth: "800px" }}> */}
            <div>
              <Call insideLead={true} lead_id={lead?._id} />
            </div>
          </TabPane>
          <TabPane tab="Activity Timeline" key="8">
            <div>
              <Activity insideLead={true} lead={lead}/>
            </div>
          </TabPane>
        </Tabs>
      </Card>
      {/* <CardCOmponents lead2={lead2}/> */}
    </div>
  );
};

export default LeadView;
