import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Avatar, Button, Space, Tooltip, Empty, Modal } from 'antd';
import { BellOutlined, DeleteOutlined, CheckOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  margin-right: 16px;
  margin-left: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationItem = styled(List.Item)`
  &:hover {
    background-color: #f8f9fa !important;
  }
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
`;

const NotificationList = styled(List)`
  width: 380px;
  min-height: 250px;
  max-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
`;

const StyledEmpty = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 32px 0;
  background-color: #fafafa;
  .ant-empty-image {
    height: 80px;
  }
  .ant-empty-description {
    color: #8c8c8c;
    font-size: 14px;
    margin-top: 16px;
  }
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  white-space: nowrap;
  margin-top: 4px;
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #262626;
`;

const NotificationDescription = styled.div`
  color: #595959;
  font-size: 13px;
  line-height: 1.4;
`;

const SettingsButton = styled(Button)`
  color: #8c8c8c;
  &:hover {
    color: #1890ff;
  }
  .anticon {
    font-size: 16px;
  }
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    box-shadow: 0 0 0 1px #fff;
  }
`;

const BellIconWrapper = styled.span`
  display: inline-block;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const EmptyNotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const EmptyStateDescription = styled.p`
  color: #8c8c8c;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
`;

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  
  const computeUnreadCount = (list) => list.reduce((count, n) => count + (n.read ? 0 : 1), 0);

  // Mock notification wiring (no Firebase, no network)
  useEffect(() => {
    try {
      // Check notification permission status on mount
      updatePermissionStatus();

      // Initialize empty notifications
      setNotifications([]);
      setUnreadCount(0);

      return () => {};
    } catch (error) {
      console.error('NotificationIcon: Error in notification subscription:', error);
      return () => {};
    }
  }, []);
  
  // Update permission status
  const updatePermissionStatus = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  };
  
  // Request notification permission
  const requestPermission = async () => {
    try {
      if (!('Notification' in window)) {
        setPermissionStatus('unsupported');
        return;
      }

      const nextStatus = await Notification.requestPermission();
      setPermissionStatus(nextStatus);
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };
  
  // Show notification settings
  const showNotificationSettings = () => {
    Modal.info({
      title: 'Notification Settings',
      content: (
        <div>
          <p>Current permission status: <strong>{permissionStatus}</strong></p>
          {permissionStatus === 'denied' ? (
            <>
              <p>Notifications are blocked by your browser. To enable:</p>
              <ol>
                <li>Click the lock/info icon in your browser's address bar</li>
                <li>Find "Notifications" settings</li>
                <li>Change from "Block" to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </>
          ) : permissionStatus === 'default' ? (
            <p>Click the button below to enable notifications:</p>
          ) : permissionStatus === 'granted' ? (
            <p>Notifications are enabled! You will receive alerts for new leads, tasks, calls, and meetings.</p>
          ) : (
            <p>Your browser does not support notifications.</p>
          )}
          
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <Button type="primary" onClick={requestPermission} style={{ marginTop: '10px' }}>
              Enable Notifications
            </Button>
          )}
        </div>
      ),
      onOk() {},
    });
  };
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === notification.id ? { ...n, read: true } : n));
      setUnreadCount(computeUnreadCount(next));
      return next;
    });
    
    if (notification.entityId) {
      switch (notification.type) {
        case 'lead':
          window.location.href = `/leads/${notification.entityId}`;
          break;
        case 'task':
          window.location.href = `/tasks/${notification.entityId}`;
          break;
        case 'meeting':
          window.location.href = `/meetings/${notification.entityId}`;
          break;
        case 'call':
          window.location.href = `/calls/${notification.entityId}`;
          break;
        default:
          break;
      }
    }
  };
  
  // Format relative time
  const formatRelativeTime = (timestamp) => {
    try {
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hr ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      
      return notificationTime.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };
  
  // Mark all as read
  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      setUnreadCount(0);
      return next;
    });
  };
  
  // Clear all notifications
  const clearAllNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]);
    setUnreadCount(0);
  };
  
  // Handle dropdown visibility change
  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible);
  };
  
  // Get bell color based on permission status
  const getBellColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#1890ff';
      case 'denied':
        return '#ff4d4f';
      case 'default':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };
  
  // Custom empty component
  const CustomEmptyComponent = () => (
    <StyledEmpty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <EmptyNotificationContent>
          <EmptyStateDescription>
            You don't have any notifications yet. New activities will appear here.
          </EmptyStateDescription>
          {permissionStatus !== 'granted' && (
            <Button 
              type="primary" 
              icon={<InfoCircleOutlined />} 
              onClick={showNotificationSettings}
              style={{ marginTop: '16px' }}
            >
              Enable notifications
            </Button>
          )}
        </EmptyNotificationContent>
      }
    />
  );
  
  // Dropdown content
  const notificationMenu = (
    <div onClick={e => e.stopPropagation()}>
      <NotificationHeader>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Notifications</h3>
        <Space>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <Button 
                type="text" 
                icon={<CheckOutlined />} 
                size="small" 
                onClick={markAllAsRead}
                style={{ color: '#8c8c8c' }}
              />
            </Tooltip>
          )}
          {notifications.length > 0 && (
            <Tooltip title="Clear all">
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />} 
                size="small" 
                onClick={clearAllNotifications}
              />
            </Tooltip>
          )}
        </Space>
      </NotificationHeader>
      {notifications.length > 0 ? (
        <NotificationList
          dataSource={notifications}
          renderItem={item => (
            <NotificationItem 
              onClick={() => handleNotificationClick(item)}
              style={{ 
                backgroundColor: item.read ? 'white' : '#f0f8ff',
                cursor: 'pointer'
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: item.read ? '#f0f0f0' : '#1890ff',
                      color: item.read ? '#8c8c8c' : 'white',
                      marginLeft: 12 // Add left margin to the avatar
                    }}
                  >
                    {item.icon}
                  </Avatar>
                }
                title={<NotificationTitle>{item.title}</NotificationTitle>}
                description={
                  <>
                    <NotificationDescription>{item.description}</NotificationDescription>
                    <NotificationTime>{formatRelativeTime(item.timestamp)}</NotificationTime>
                  </>
                }
              />
            </NotificationItem>
          )}
        />
      ) : (
        <NotificationList>
          <CustomEmptyComponent />
        </NotificationList>
      )}
    </div>
  );
  
  return (
    <NotificationContainer>
      <Dropdown 
        overlay={notificationMenu} 
        trigger={['click']} 
        arrow
        placement="bottomRight"
        open={dropdownVisible}
        onOpenChange={handleDropdownVisibleChange}
      >
        <StyledBadge 
          count={unreadCount} 
          size="small"
          style={{ 
            color: 'white',
            backgroundColor: unreadCount > 0 ? '#ff4d4f' : 'transparent'
          }}
        >
          <BellIconWrapper>
            <BellOutlined style={{ 
              fontSize: '20px', 
              color: getBellColor(),
            }} />
          </BellIconWrapper>
        </StyledBadge>
      </Dropdown>
      <Tooltip title="Notification Settings">
        <SettingsButton 
          type="text" 
          icon={<SettingOutlined />} 
          size="small"
          onClick={showNotificationSettings}
        />
      </Tooltip>
    </NotificationContainer>
  );
};

export default NotificationIcon;