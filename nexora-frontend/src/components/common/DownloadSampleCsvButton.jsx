import React from 'react';
import { Button, message, Tooltip } from 'antd';
import { MdDownload } from 'react-icons/md';
import axios from 'axios';
import { url } from './api';

const newurl=url
const sampleFiles = {
  users: 'import-users.csv',
  deals: 'import-deals.csv',
  products: 'import-products.csv',
  tickets: 'import-tickets.csv',
  tasks: 'import-tasks.csv',
  'user-roles': 'import-user-roles.csv',
  'lead-status': 'import-lead-status.csv',
  'leads': 'import-leads.csv',
  'product-types': 'import-product-types.csv',
  'industry-types': 'import-industry-types.csv',
  'type-of-buyers': 'import-type-of-buyers.csv',
};

// Modules that support dynamic fields - use dynamic sample files
const dynamicFieldModules = ['calls', 'meetings', 'tasks', 'deals', 'products', 'tickets', 'leads'];

const DownloadSampleCsvButton = ({ module }) => {
  const handleDownload = async () => {
    let fileName;
    
    // Check if this module supports dynamic fields
    if (dynamicFieldModules.includes(module)) {
      // Use dynamic sample file for modules with dynamic fields
      fileName = `Import sample file for-${module}.csv`;
    } else {
      // Use static sample file for other modules
      fileName = sampleFiles[module];
    }
    
    if (!fileName) {
      message.error('No sample file for this module');
      return;
    }

    try {
      const response = await axios.get(
        `${newurl}/api/common-api/import-sample/${fileName}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // set file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      message.error('Failed to download sample CSV');
    }
  };

  return (
    <Tooltip title={ 
      `Download sample CSV file for ${module}`
    }>
      <Button type="primary" icon={<MdDownload />} onClick={handleDownload} style={{ marginLeft: 8 }}>
        {/* {dynamicFieldModules.includes(module) ? 'Download Sample CSV (with Dynamic Fields)' : 'Download Sample CSV'} */}
      </Button>
    </Tooltip>
  );
};

export default DownloadSampleCsvButton;
