import React from 'react';
import MultiSelectDropdown from '../../../atoms/select/MultiSelectDropdown';
import MultiSelectStatus from '../../../atoms/select/MultiSelectStatus';
import TagsInput from '../../../atoms/input/TagsInput';
import { sourceArray, statesInIndia } from '../../../atoms/State';


const RenderFieldComponent = ({ values }) => {
  const renderComponent = () => {
    switch (values?.field) {
      case 'info.state':
        return (
          <MultiSelectDropdown
            name="compareTo"
            array={statesInIndia}
            mainLabel="Compare To"
            label="State"
          />
        );

      case 'info.source':
        return (
          <MultiSelectDropdown
            name="compareTo"
            array={sourceArray}
            mainLabel="Compare To"
            label="Source"
          />
        );

      case 'status._id':
        return (
          <MultiSelectStatus
            name="compareTo"
            mainLabel="Compare To"
            label="Status"
          />
        );

      default:
        return (
          <TagsInput
            name="compareTo"
            placeholder="Add a tag and press Enter"
          />
        );
    }
  };

  return <>{renderComponent()}</>;
};

export default RenderFieldComponent;
