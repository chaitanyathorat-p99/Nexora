import React from 'react';
import { Card, Tabs } from 'antd';

const { TabPane } = Tabs;

const CommonTabs = ({ tabData }) => {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {/* <LeadProfileCard lead={lead} /> */}
      <Card
        style={{ flex: 1, position: "static" }}
        className="ant-card-body--p0"
      >
        <Tabs defaultActiveKey={tabData[0].key} style={{ padding: "0px 20px" }}>
          {tabData.map((tab) => (
            <TabPane tab={tab.title} key={tab.key}>
              {tab.content}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default CommonTabs;
