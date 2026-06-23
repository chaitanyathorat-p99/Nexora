import React from "react";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Tooltip } from "antd";
import { checkAccess } from "../../atoms/static";

const HActionButtons = ({ 
  record, 
  handleEdit, 
  handleDelete, 
  handleView, 
  user, 
  modelName
}) => {
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {handleView && (
        <Tooltip title="View" placement="left" overlayClassName="customTooltip">
          <EyeOutlined className="view-button" onClick={() => handleView(record)} />
        </Tooltip>
      )}

      {checkAccess(user, modelName, "update") && handleEdit && (
        <Tooltip title="Edit" placement="left" overlayClassName="customTooltip">
          <EditOutlined className="edit-button" onClick={() => handleEdit(record)} />
        </Tooltip>
      )}
      
      {checkAccess(user, modelName, "delete") && handleDelete && (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record)}
        >
          <Tooltip title="Delete" placement="left" overlayClassName="customTooltip">
            <DeleteOutlined className="delete-button" />
          </Tooltip>
        </Popconfirm>
      )}
    </div>
  );
};

export default HActionButtons; 