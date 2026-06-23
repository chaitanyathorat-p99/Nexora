import React, { useState, useEffect } from "react";
import { Button, Upload, message, Typography, Space } from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { url } from "../../components/common/api";

const { Text } = Typography;

const MultipleFileUpload = ({ label, name, handleChange, values, onFileUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(values[name] || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUploadedFiles(values[name] || []);
  }, [values[name]]);

  const handleFileChange = async ({ fileList }) => {
    const files = fileList.map((file) => file.originFileObj).filter(Boolean);

    if (!files.length) {
      message.warning("Please select files first.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("directory", "Marketing");

    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/upload/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      // Assume response.data is an array of file objects with a 'location' property
      const uploadedUrls = response.data.map((file) => file.location);
      const newFiles = [...uploadedFiles, ...uploadedUrls];
      setUploadedFiles(newFiles);
      onFileUpload(newFiles);
      setError(null);
      message.success("Files uploaded successfully!");
    } catch (err) {
      console.error("Upload Error:", err);
      setError("File upload failed. Please try again.");
      message.error("Some files failed to upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Upload
        multiple
        customRequest={() => {}} // Prevent default upload
        showUploadList={false}
        beforeUpload={() => false} // Prevent automatic upload
        onChange={handleFileChange}
      >
        <Button
          icon={<UploadOutlined />}
          loading={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {label || "Upload Files"}
        </Button>
      </Upload>

      {uploadedFiles.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {uploadedFiles.map((fileUrl, index) => (
            <Space key={index} align="center">
              <Button
                icon={<EyeOutlined />}
                onClick={() => window.open(fileUrl, "_blank")}
                className="rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:text-slate-900"
              >
                View File
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteFile(index)}
                className="rounded-md"
              />
            </Space>
          ))}
        </div>
      )}

      {error && (
        <Text type="danger" style={{ textAlign: "center" }}>
          {error}
        </Text>
      )}
    </div>
  );
};

export default MultipleFileUpload;
