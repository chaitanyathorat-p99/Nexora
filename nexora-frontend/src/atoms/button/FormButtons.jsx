import React from 'react';
import { Popconfirm } from 'antd';

const FormButtons = ({ 
  onSubmit, 
  onCancel, 
  isLoading, 
  isUpdate = false,
  submitText = "Submit",
  cancelText = "Cancel"
}) => {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <Popconfirm
        title="Are you sure you want to cancel?"
        description="Unsaved changes will be lost."
        onConfirm={onCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <button
          type="button"
          className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium leading-6 text-white shadow-sm transition-colors duration-150 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {cancelText}
        </button>
      </Popconfirm>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium leading-6 text-white shadow-sm transition-colors duration-150 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : isUpdate ? "Update" : submitText}
      </button>
    </div>
  );
};

export default FormButtons; 