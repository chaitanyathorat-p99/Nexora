import React from 'react';
import { Button, notification, Tooltip } from 'antd';
import { MdUploadFile } from 'react-icons/md';
import { useImportCsvMutation } from '../../features/allApi';
import DownloadSampleCsvButton from './DownloadSampleCsvButton';

const ImportCsvButton = ({ module, onSuccess, onError, children }) => {
  const [importCsv, { isLoading }] = useImportCsvMutation();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const result = await importCsv({ file, module }).unwrap();
        
        // Build detailed success message
        let successDescription = `Imported: ${result.importedCount}, Skipped: ${result.skippedCount}`;
        
        // Add error details if there are any
        if (result.errors && result.errors.length > 0) {
          successDescription += '\n\nSkipped rows:';
          result.errors.forEach((error, index) => {
            successDescription += `\nRow ${error.row}: ${error.reason}`;
          });
        }
        
        notification.success({
          message: 'Import Successful',
          description: successDescription,
          duration: 8, // Show for longer to read all errors
        });
        if (onSuccess) onSuccess(result);
      } catch (err) {
        // Handle both API errors and validation errors
        let errorMessage = 'Import failed';
        let errorDescription = err?.data?.message || err?.error || 'Unknown error occurred';
        
        // If the error response contains errors array, show detailed errors
        if (err?.data?.errors && Array.isArray(err.data.errors)) {
          errorDescription = 'Import completed with errors:\n';
          err.data.errors.forEach((error, index) => {
            errorDescription += `Row ${error.row}: ${error.reason}\n`;
          });
        }
        
        notification.error({
          message: errorMessage,
          description: errorDescription,
          duration: 10, // Show for longer to read all errors
        });
        if (onError) onError(err);
      }
    };
    input.click();
  };

  // Check if this module supports dynamic fields
  const dynamicFieldModules = ['calls', 'meetings', 'tasks', 'deals', 'products', 'tickets', 'leads'];
  const supportsDynamicFields = dynamicFieldModules.includes(module);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip 
        title={supportsDynamicFields ? 
          `Import ${module.charAt(0).toUpperCase() + module.slice(1)} data from CSV with dynamic fields support` : 
          `Import ${module.charAt(0).toUpperCase() + module.slice(1)} data from CSV`
        }
      >
        <Button
          type="primary"
          icon={<MdUploadFile />}
          onClick={handleImport}
          loading={isLoading}
          disabled={isLoading}
          style={{ marginLeft: -13 }}
        >
          {/* {children || 'Import CSV'} */}
        </Button>
      </Tooltip>
      <DownloadSampleCsvButton module={module} />
    </div>
  );
};

export default ImportCsvButton; 