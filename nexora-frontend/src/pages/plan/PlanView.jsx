import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Row, Col, Button, Descriptions, Tag, Divider, Tooltip } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined, EditOutlined } from "@ant-design/icons";

const PlanView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  const handleBack = () => {
    navigate(-1);
  };

  if (!plan) {
    return (
      <Card className="shadow-md">
        <div className="text-center p-8">
          <div className="text-lg font-medium text-gray-500 mb-4">Plan not found</div>
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Back to Plans
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="plan-view-container">
      <Card className="main-card shadow-md">
        <div className="view-header">
          <div className="flex items-center">
            <Tag color={plan.tier === 'premium' ? 'gold' : plan.tier === 'pro' ? 'purple' : plan.tier === 'basic' ? 'blue' : 'green'} 
                style={{ fontSize: '14px', padding: '4px 10px', marginRight: '12px' }}>
              {plan.tier.toUpperCase()}
            </Tag>
            <h1 className="view-title">{plan.name}</h1>
          </div>
          <div className="button-group">
            <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack} 
                  style={{ marginRight: '10px' }}>
              Back
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/plan/create/${plan._id}`)}>
              Edit Plan
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]} className="content-section">
          <Col xs={24} lg={12}>
            <Card title="Plan Information" className="info-card">
              <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: '500' }}>
                <Descriptions.Item label="Status">
                  <Tag color={plan.isActive ? "success" : "error"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Monthly Price">
                  <span className="price">₹{plan.price.monthly.toLocaleString()}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Yearly Price">
                  <span className="price">₹{plan.price.yearly.toLocaleString()}</span>
                  {plan.price.yearly < (plan.price.monthly * 12) && (
                    <Tag color="green" style={{ marginLeft: '8px' }}>
                      Save {Math.round(100 - (plan.price.yearly / (plan.price.monthly * 12) * 100))}%
                    </Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Duration Options">
                  <div className="duration-tags">
                    {plan.durationOptions.map((option, idx) => (
                      <Tag key={idx} color="blue">{option}</Tag>
                    ))}
                  </div>
                </Descriptions.Item>

                 <Descriptions.Item label="Razorpay Plan Ids">
                  <span className="price">{plan?.razorpayPlanIds?.monthly?.toLocaleString()} {plan?.razorpayPlanIds?.yearly?.toLocaleString()}</span>
                </Descriptions.Item>
                
              </Descriptions>
            </Card>
          </Col>

          {plan.limitId && (
            <Col xs={24} lg={12}>
              <Card title="Resource Limits" className="limits-card">
                <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: '500' }}>
                  {plan.limitId.description && (
                    <Descriptions.Item label="Description">
                      {plan.limitId.description}
                    </Descriptions.Item>
                  )}
                  {plan.limitId.featurelimit && Object.entries(plan.limitId.featurelimit).map(([key, value]) => (
                    <Descriptions.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                      {value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Col>
          )}
        </Row>

        <Divider style={{ margin: '24px 0' }}>
          <div className="section-title">Features</div>
        </Divider>

        <Row gutter={[24, 24]}>
          {plan.features?.length > 0 && (
            <Col xs={24} lg={plan.featuresMasterIds?.length > 0 ? 12 : 24}>
              <Card title="Custom Features" className="features-card">
                <div className="features-container">
                  {plan.features.map((feature, idx) => (
                    <Tag key={idx} color="blue" className="feature-tag">{feature}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          )}

          {plan.featuresMasterIds?.length > 0 && (
            <Col xs={24} lg={plan.features?.length > 0 ? 12 : 24}>
              <Card title="Master Features" className="features-card">
                <div className="features-container">
                  {plan.featuresMasterIds.map((feature) => (
                    <Tooltip key={feature._id} title={feature.description} placement="top">
                      <Tag color="green" className="feature-tag">
                        <span className="flex items-center">
                          {feature.name}
                          {feature.description && <InfoCircleOutlined style={{ marginLeft: 6 }} />}
                        </span>
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              </Card>
            </Col>
          )}
        </Row>

        <style jsx>{`
          .plan-view-container {
            padding: 12px;
          }
          .main-card {
            background: #fff;
            border-radius: 8px;
            padding: 12px;
          }
          .view-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f0f0;
          }
          .view-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
          }
          .button-group {
            display: flex;
          }
          .content-section {
            margin-bottom: 20px;
          }
          .info-card, .limits-card, .features-card {
            height: 100%;
          }
          .price {
            font-weight: 500;
            font-size: 16px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 500;
            color: #555;
          }
          .features-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .feature-tag {
            margin-bottom: 8px;
            padding: 4px 8px;
            font-size: 13px;
          }
          .duration-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
        `}</style>
      </Card>
    </div>
  );
};

export default PlanView; 