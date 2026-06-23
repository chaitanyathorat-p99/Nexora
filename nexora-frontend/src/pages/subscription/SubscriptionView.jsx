import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Descriptions, Tag, Divider, Row, Col, Progress, Tooltip, Statistic } from "antd";
import { ArrowLeftOutlined, EditOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const SubscriptionView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscription = location.state?.subscription;

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "trial":
        return "blue";
      case "past_due":
        return "orange";
      case "cancelled":
        return "red";
      case "expired":
        return "gray";
      default:
        return "default";
    }
  };

  const calculateProgress = (used, max) => {
    if (!max || max === 0) return 0;
    return Math.min(Math.round((used / max) * 100), 100);
  };

  if (!subscription) {
    return (
      <Card className="shadow-md">
        <div className="text-center p-8">
          <div className="text-lg font-medium text-gray-500 mb-4">Subscription not found</div>
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Back to Subscriptions
          </Button>
        </div>
      </Card>
    );
  }

  const daysLeft = subscription.endDate ? 
    moment(subscription.endDate).diff(moment(), 'days') : 0;

  return (
    <div className="subscription-view-container">
      <Card className="main-card shadow-md">
        <div className="view-header">
          <div className="header-content">
            <Tag color={getStatusColor(subscription.status)} className="status-tag">
              {subscription.status?.toUpperCase().replace("_", " ")}
            </Tag>
            <h1 className="view-title">
              {subscription.company?.name || 'Company'} - {subscription.planName || subscription.plan?.name}
            </h1>
          </div>
          <div className="button-group">
            <Button 
              type="default" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              style={{ marginRight: '10px' }}
            >
              Back
            </Button>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/subscriptions/create/${subscription._id}`)}
            >
              Edit
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Billing Cycle" 
                value={subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Auto Renewal" 
                value={subscription.isAutoRenew ? "Enabled" : "Disabled"}
                valueStyle={{ color: subscription.isAutoRenew ? '#52c41a' : '#ff4d4f' }}
                prefix={subscription.isAutoRenew ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Start Date" 
                value={subscription.startDate ? moment(subscription.startDate).format('DD MMM YYYY') : 'N/A'} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Expires In" 
                value={daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                valueStyle={{ color: daysLeft > 30 ? '#52c41a' : daysLeft > 0 ? '#faad14' : '#ff4d4f' }} 
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Subscription Details" className="details-card">
              <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: '500' }}>
                {subscription.user && (
                  <Descriptions.Item label="User">
                    {subscription.user.name || '-'}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="End Date">
                  {subscription.endDate ? moment(subscription.endDate).format('DD MMM YYYY') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Trial">
                  <Tag color={subscription.isTrial ? 'blue' : 'default'}>
                    {subscription.isTrial ? 'Trial Subscription' : 'Regular Subscription'}
                  </Tag>
                </Descriptions.Item>
                {subscription.gracePeriodEndsAt && (
                  <Descriptions.Item label="Grace Period Ends">
                    {moment(subscription.gracePeriodEndsAt).format('DD MMM YYYY')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Created On">
                  {moment(subscription.createdAt).format('DD MMM YYYY, hh:mm A')}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {moment(subscription.updatedAt).format('DD MMM YYYY, hh:mm A')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {(subscription.plan || subscription.planDetails) && (
            <Col xs={24} lg={12}>
              <Card title="Plan Information" className="plan-card">
                <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: '500' }}>
                  <Descriptions.Item label="Plan">
                    {subscription.planName || subscription.plan?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tier">
                    <Tag color={
                      subscription.plan?.tier === 'premium' ? 'gold' : 
                      subscription.plan?.tier === 'pro' ? 'purple' : 
                      subscription.plan?.tier === 'basic' ? 'blue' : 'green'
                    }>
                      {subscription.plan?.tier?.toUpperCase() || '-'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    {subscription.plan?.price ? (
                      <div>
                        <div>Monthly: ₹{subscription.plan.price.monthly?.toLocaleString()}</div>
                        <div>Yearly: ₹{subscription.plan.price.yearly?.toLocaleString()}</div>
                      </div>
                    ) : '-'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          )}
        </Row>

        {subscription.usage && (
          <>
            <Divider style={{ margin: '24px 0' }}>
              <div className="section-title">Usage Statistics</div>
            </Divider>
            <Row gutter={[24, 24]} className="usage-row">
              <Col xs={24} sm={12} lg={6}>
                <Card title="Contacts" className="usage-card">
                  <Tooltip title={`${subscription.usage.contactsUsed || 0} / ${subscription.plan?.limits?.maxContacts || 'Unlimited'}`}>
                    <Progress 
                      type="dashboard"
                      percent={calculateProgress(
                        subscription.usage.contactsUsed, 
                        subscription.plan?.limits?.maxContacts
                      )} 
                      status={
                        calculateProgress(
                          subscription.usage.contactsUsed, 
                          subscription.plan?.limits?.maxContacts
                        ) >= 90 ? 'exception' : 'active'
                      }
                    />
                  </Tooltip>
                  <div className="usage-label">
                    {subscription.usage.contactsUsed || 0} / {subscription.plan?.limits?.maxContacts || 'Unlimited'}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card title="Users" className="usage-card">
                  <Tooltip title={`${subscription.usage.usersUsed || 0} / ${subscription.plan?.limits?.maxUsers || 'Unlimited'}`}>
                    <Progress 
                      type="dashboard"
                      percent={calculateProgress(
                        subscription.usage.usersUsed,
                        subscription.plan?.limits?.maxUsers
                      )} 
                      status={
                        calculateProgress(
                          subscription.usage.usersUsed, 
                          subscription.plan?.limits?.maxUsers
                        ) >= 90 ? 'exception' : 'active'
                      }
                    />
                  </Tooltip>
                  <div className="usage-label">
                    {subscription.usage.usersUsed || 0} / {subscription.plan?.limits?.maxUsers || 'Unlimited'}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card title="Emails" className="usage-card">
                  <Tooltip title={`${subscription.usage.emailsSent || 0} / ${subscription.plan?.limits?.emailLimitPerMonth || 'Unlimited'}`}>
                    <Progress 
                      type="dashboard"
                      percent={calculateProgress(
                        subscription.usage.emailsSent,
                        subscription.plan?.limits?.emailLimitPerMonth
                      )}
                      status={
                        calculateProgress(
                          subscription.usage.emailsSent, 
                          subscription.plan?.limits?.emailLimitPerMonth
                        ) >= 90 ? 'exception' : 'active'
                      }
                    />
                  </Tooltip>
                  <div className="usage-label">
                    {subscription.usage.emailsSent || 0} / {subscription.plan?.limits?.emailLimitPerMonth || 'Unlimited'}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card title="Storage (MB)" className="usage-card">
                  <Tooltip title={`${subscription.usage.storageUsedMB || 0} / ${subscription.plan?.limits?.storageMB || 'Unlimited'}`}>
                    <Progress 
                      type="dashboard"
                      percent={calculateProgress(
                        subscription.usage.storageUsedMB,
                        subscription.plan?.limits?.storageMB
                      )}
                      status={
                        calculateProgress(
                          subscription.usage.storageUsedMB, 
                          subscription.plan?.limits?.storageMB
                        ) >= 90 ? 'exception' : 'active'
                      }
                    />
                  </Tooltip>
                  <div className="usage-label">
                    {subscription.usage.storageUsedMB || 0} MB / {subscription.plan?.limits?.storageMB || 'Unlimited'} MB
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {(subscription.razorpayOrderId || 
         subscription.razorpaySubscriptionId || 
         subscription.razorpayCustomerId || 
         subscription.razorpayAccountId) && (
          <>
            <Divider style={{ margin: '24px 0' }}>
              <div className="section-title">Payment Information</div>
            </Divider>
            <Card className="payment-card">
              <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
                {subscription.razorpayOrderId && (
                  <Descriptions.Item label="Order ID">
                    {subscription.razorpayOrderId}
                  </Descriptions.Item>
                )}
                {subscription.razorpaySubscriptionId && (
                  <Descriptions.Item label="Subscription ID">
                    {subscription.razorpaySubscriptionId}
                  </Descriptions.Item>
                )}
                {subscription.razorpayCustomerId && (
                  <Descriptions.Item label="Customer ID">
                    {subscription.razorpayCustomerId}
                  </Descriptions.Item>
                )}
                {subscription.razorpayAccountId && (
                  <Descriptions.Item label="Account ID">
                    {subscription.razorpayAccountId}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </>
        )}

        <style jsx>{`
          .subscription-view-container {
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
          .header-content {
            display: flex;
            flex-direction: column;
          }
          .status-tag {
            margin-bottom: 8px;
            font-size: 13px;
            padding: 2px 8px;
          }
          .view-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
          }
          .button-group {
            display: flex;
          }
          .stats-row, .usage-row {
            margin-bottom: 24px;
          }
          .stat-card, .usage-card {
            height: 100%;
            text-align: center;
          }
          .details-card, .plan-card, .payment-card {
            height: 100%;
          }
          .section-title {
            font-size: 16px;
            font-weight: 500;
            color: #555;
          }
          .usage-label {
            text-align: center;
            margin-top: 12px;
            font-size: 14px;
            color: #666;
          }
        `}</style>
      </Card>
    </div>
  );
};

export default SubscriptionView; 