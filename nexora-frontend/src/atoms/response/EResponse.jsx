import React, { useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const EResponse = ({ error, Response, type, navigateTo, cancel, onSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Response?.isSuccess) {
      message.success(`${type} Successfully`);
      if (onSuccess) {
        onSuccess(Response.data);
      }
      if (cancel) {
        cancel();
      }
      if (navigateTo) {
        navigate(navigateTo);
      }
    }
  }, [Response?.isSuccess]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return null;
};

export default EResponse;
