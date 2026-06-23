import { FireOutlined, HomeOutlined, MailOutlined, PhoneOutlined, StarOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import './leadcomponent.css'

const LeadProfileCard = ({lead}) => {
  return (
    <Card style={{ width: '300px',position:"static" }} className='lead-profile-card'>
    <div style={{ textAlign: 'center' }}>
      <img src="https://via.placeholder.com/100" alt="Profile" style={{ borderRadius: '50%' }} />
      <h2>{lead?.name || `${lead?.firstName || ""} ${lead?.lastName || ""}`.trim()}</h2>
      <p>{lead?.createdBy?.name} @Nexora</p>
      <div>
        <StarOutlined style={{ color: '#fadb14' }} />
        <StarOutlined style={{ color: '#fadb14' }} />
        <StarOutlined style={{ color: '#fadb14' }} />
        <StarOutlined style={{ color: '#fadb14' }} />
        <StarOutlined />
      </div>
      <div style={{ marginTop: '10px' }}>
        <FireOutlined style={{ color: 'red' }} /> 128
      </div>
    </div>
    <div>
      <h3>Contact Information</h3>
      <p><MailOutlined /> {lead?.email}</p>
      <p><PhoneOutlined /> {lead?.mobile || lead?.info?.mobile}</p>
      <p><HomeOutlined /> {lead?.address || lead?.info?.address}</p>
      <p><HomeOutlined /> {lead?.city || lead?.info?.city}, {lead?.country || lead?.info?.country}</p>
    </div>
  </Card>
  )
}

export default LeadProfileCard
