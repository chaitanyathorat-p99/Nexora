import React from 'react';
import axios from 'axios';
import { url } from './api';
import { Button, Tooltip } from 'antd';
import { FaFileExport } from 'react-icons/fa6';

function buildQueryString(params) {
  return Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'pagination')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

const ExportCsvButton = ({ module, filters = {} }) => {
  const handleExport = async (e) => {
    e.preventDefault(); // ✅ prevents redirect

    try {
      const queryString = buildQueryString({ ...filters, module });

      // Step 1: Ask backend to generate file
      const { data } = await axios.get(`${url}/api/common-api/export-csv?${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      // Step 2: Download the file as blob with headers
      const fileRes = await axios.get(`${url}${data.url}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      // Step 3: Trigger file download manually
      const blob = new Blob([fileRes.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `export-${module}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed!');
    }
  };

  return (
    <Tooltip title={`Export ${module.charAt(0).toUpperCase() + module.slice(1)} data to CSV`}>
      <Button
        type="primary"
        icon={<FaFileExport style={{ marginRight: 4 }} />}
        onClick={handleExport}
        style={{ margin: '8px', padding: '0 16px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
      >
        {/* Export {module.charAt(0).toUpperCase() + module.slice(1)} CSV */}
      </Button>
    </Tooltip>
  );
};

export default ExportCsvButton;
