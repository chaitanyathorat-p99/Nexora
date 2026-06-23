import React, { useState } from "react";
import { Card, Tabs } from "antd";

import TabPane from "antd/es/tabs/TabPane";
import { useSelector } from "react-redux";
import {
  useFetchTaskQuery,
} from "../../../features/allApi";
import OverviewComponent from "./OverviewComponent";

const DealView = ({ deal }) => {
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
 
  // const {
  //   data: task,
  //   isLoading: task_isLoading,
  //   isFetching: task_fetch,
  //   error: task_error,
  // } = useFetchTaskQuery({ lead: `deal=${deal?._id}` ,


  //   filterString:"",
  //   filterObj:"",
  //   page:""

  // });

  const [activeTab, setActiveTab] = useState("1");

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
              <OverviewComponent data={deal} />
            </>
          </TabPane>
          {/* <TabPane tab="Activity" key="3">
          <div style={{ maxWidth: "800px" }}>
            </div>
          </TabPane> */}
       
        </Tabs>
      </Card>
    </div>
  );
};

export default DealView;
