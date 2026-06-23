import React from 'react';

/**
 * Utility functions for handling dynamic fields in tables and exports
 */

/**
 * Generates table columns for dynamic fields
 * @param {Array} dynamicFields - Array of dynamic field objects
 * @param {string} moduleType - The module type (lead, deal, task, etc.)
 * @returns {Array} Array of column configurations for the table
 */
export const generateDynamicFieldColumns = (dynamicFields, moduleType) => {
  console.log('generateDynamicFieldColumns called with:', { dynamicFields, moduleType });
  
  if (!dynamicFields || !Array.isArray(dynamicFields)) {
    console.log('No dynamic fields found or not an array:', dynamicFields);
    return [];
  }

  console.log('Raw dynamic fields:', dynamicFields);
  console.log('First dynamic field details:', dynamicFields?.[0]);
  // Filter fields - only show active fields, but don't require isExportable for table display
  const filteredFields = dynamicFields.filter(field => {
    console.log(`Checking field ${field.fieldName}:`, {
      isActive: field.isActive,
      isExportable: field.isExportable,
      field: field
    });
    return field.isActive !== false; // Only exclude if explicitly set to false
  });
  console.log('Filtered fields:', filteredFields);

  const columns = filteredFields.map(field => ({
    title: field.displayName,
    dataIndex: `dynamicFields.${field.fieldName}`, // Use the full path to access dynamic fields
    key: `dynamicFields.${field.fieldName}`,
    width: getColumnWidth(field.fieldType),
    render: (value, record) => renderDynamicFieldValue(value, field, record),
    sorter: field.isSearchable,
    filters: field.isFilterable ? generateFilters(field) : undefined,
  }));
  
  console.log('Generated dynamic columns:', columns);
  return columns;
};

/**
 * Renders dynamic field value based on field type
 * @param {any} value - The field value
 * @param {Object} field - The dynamic field configuration
 * @param {Object} record - The complete record
 * @returns {JSX.Element|string} Rendered value
 */
export const renderDynamicFieldValue = (value, field, record) => {
  console.log(`renderDynamicFieldValue called for field ${field.fieldName}:`, { value, field, record });
  
  // Try to get the value from the record's dynamicFields
  const dynamicFieldValue = record?.dynamicFields?.[field.fieldName];
  console.log(`Dynamic field value for ${field.fieldName}:`, dynamicFieldValue);
  
  // Use the value parameter if available, otherwise use the dynamic field value
  const finalValue = value || dynamicFieldValue;
  
  if (finalValue === undefined || finalValue === null || finalValue === '') {
    console.log(`No value found for field ${field.fieldName}`);
    return '-';
  }

  switch (field.fieldType) {
    case 'boolean':
      return finalValue ? 'Yes' : 'No';
    
    case 'date':
      return finalValue ? new Date(finalValue).toLocaleDateString() : '-';
    
    case 'datetime':
      return finalValue ? new Date(finalValue).toLocaleString() : '-';
    
    case 'multiselect':
      return Array.isArray(finalValue) ? finalValue.join(', ') : finalValue;
    
    case 'select':
      return finalValue;
    
    case 'currency':
      return typeof finalValue === 'number' ? `$${finalValue.toFixed(2)}` : finalValue;
    
    case 'percentage':
      return typeof finalValue === 'number' ? `${finalValue}%` : finalValue;
    
    case 'url':
      return finalValue ? (
        <a href={finalValue} target="_blank" rel="noopener noreferrer">
          {finalValue}
        </a>
      ) : '-';
    
    default:
      return finalValue;
  }
};

/**
 * Gets appropriate column width based on field type
 * @param {string} fieldType - The field type
 * @returns {string} Column width
 */
const getColumnWidth = (fieldType) => {
  switch (fieldType) {
    case 'boolean':
      return '100px';
    case 'date':
    case 'datetime':
      return '150px';
    case 'currency':
    case 'percentage':
    case 'number':
      return '120px';
    case 'url':
      return '200px';
    case 'multiselect':
      return '200px';
    default:
      return '150px';
  }
};

/**
 * Generates filters for filterable fields
 * @param {Object} field - The dynamic field configuration
 * @returns {Array} Array of filter options
 */
const generateFilters = (field) => {
  if (field.fieldType === 'select' || field.fieldType === 'multiselect') {
    return field.options?.map(option => ({ text: option, value: option })) || [];
  }
  return [];
};

/**
 * Extracts dynamic field values from a record for export
 * @param {Object} record - The record containing dynamic fields
 * @param {Array} dynamicFields - Array of dynamic field configurations
 * @returns {Object} Object with dynamic field values for export
 */
export const extractDynamicFieldsForExport = (record, dynamicFields) => {
  if (!dynamicFields || !Array.isArray(dynamicFields) || !record?.dynamicFields) {
    return {};
  }

  const exportData = {};
  
  dynamicFields
    .filter(field => field.isActive && field.isExportable)
    .forEach(field => {
      const value = record.dynamicFields[field.fieldName];
      exportData[field.displayName] = formatValueForExport(value, field);
    });

  return exportData;
};

/**
 * Formats value for export based on field type
 * @param {any} value - The field value
 * @param {Object} field - The dynamic field configuration
 * @returns {string} Formatted value for export
 */
const formatValueForExport = (value, field) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  switch (field.fieldType) {
    case 'boolean':
      return value ? 'Yes' : 'No';
    
    case 'date':
      return value ? new Date(value).toLocaleDateString() : '';
    
    case 'datetime':
      return value ? new Date(value).toLocaleString() : '';
    
    case 'multiselect':
      return Array.isArray(value) ? value.join(', ') : value;
    
    case 'currency':
      return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    
    case 'percentage':
      return typeof value === 'number' ? `${value}%` : value;
    
    default:
      return value;
  }
};

/**
 * Merges static columns with dynamic field columns
 * @param {Array} staticColumns - Static columns array
 * @param {Array} dynamicColumns - Dynamic field columns array
 * @returns {Array} Combined columns array
 */
export const mergeColumnsWithDynamicFields = (staticColumns, dynamicColumns) => {
  console.log('mergeColumnsWithDynamicFields called with:', { 
    staticColumnsLength: staticColumns?.length, 
    dynamicColumnsLength: dynamicColumns?.length 
  });
  
  if (!dynamicColumns || dynamicColumns.length === 0) {
    console.log('No dynamic columns to merge, returning static columns');
    return staticColumns;
  }

  // Insert dynamic columns before the action column
  const actionColumnIndex = staticColumns.findIndex(col => col.key === 'edit' || col.title === 'Action');
  console.log('Action column index:', actionColumnIndex);
  
  if (actionColumnIndex !== -1) {
    const merged = [
      ...staticColumns.slice(0, actionColumnIndex),
      ...dynamicColumns,
      ...staticColumns.slice(actionColumnIndex)
    ];
    console.log('Merged columns with dynamic fields inserted before action:', merged.length);
    return merged;
  }

  const merged = [...staticColumns, ...dynamicColumns];
  console.log('Merged columns appended at end:', merged.length);
  return merged;
};

/**
 * Processes data for export including dynamic fields
 * @param {Array} data - Array of records
 * @param {Array} dynamicFields - Array of dynamic field configurations
 * @returns {Array} Processed data for export
 */
export const processDataForExport = (data, dynamicFields) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(record => {
    const dynamicFieldData = extractDynamicFieldsForExport(record, dynamicFields);
    return {
      ...record,
      ...dynamicFieldData
    };
  });
}; 