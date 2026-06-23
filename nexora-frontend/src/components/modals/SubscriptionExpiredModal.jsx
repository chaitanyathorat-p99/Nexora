import React from 'react';
import CustomModel from '../../atoms/model/CustomModel';
import { useSelector } from 'react-redux';
import { nexturl} from '../common/api';

const SubscriptionExpiredModal = ({ isOpen, message, onClose }) => {
  const userToken = useSelector((state) => state.user.userToken);

  if (!isOpen) return null;

  const handleRenewClick = () => {
    // Construct the SSO URL similar to the Upgrade Plan button
    const ssoUrl = `${nexturl}/sso-login?token=${encodeURIComponent(userToken)}`;

    // Redirect the user to the SSO URL
    window.location.href = ssoUrl;

    onClose(); // Close the modal immediately on click
  };

  return (
    <CustomModel performCancel={onClose} width={"400px"} height={"auto"}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px', color: '#ff4d4f' }}>Subscription Expired</h3>
        <p style={{ marginBottom: '25px' }}>{message}</p>
        <button
          onClick={handleRenewClick}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Renew Subscription
        </button>
      </div>
    </CustomModel>
  );
};

export default SubscriptionExpiredModal; 