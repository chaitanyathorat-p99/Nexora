import React, { useState } from 'react';
import CallCardPopUp from './CallCardPopUp';
import MeetingCardPopUp from './MeetingCardPopUp';
import DealPopUpView from './DealPopUpView';
import TaskCardPopUp from './TaskCardPopUp';
import NotesCardPopUp from './NotesCardPopUp';

// Define multiple components
const ComponentA = () => (
  <div>
    <h3>Component A</h3>
    <p>This is content for Component A.</p>
  </div>
);

const ComponentB = () => (
  <div>
    <h3>Component B</h3>
    <p>This is content for Component B.</p>
  </div>
);

const ComponentC = () => (
  <div>
    <h3>Component C</h3>
    <p>This is content for Component C.</p>
  </div>
);

const ShowPopUp = ({visibleComponent,getId,performCancel}) => {
  // State to track which component to display

  // Switch statement to render the correct component
  const renderComponent = () => {
    switch (visibleComponent) {
      case 'Call':
        return <CallCardPopUp callData={getId} performCancel={performCancel}/>;
      case 'Meeting':
        return <MeetingCardPopUp meeting={getId} performCancel={performCancel} />;
      case 'Deal':
        return <DealPopUpView dealData={getId} performCancel={performCancel} />;
      case 'Task':
        return <TaskCardPopUp task={getId} performCancel={performCancel} />;
      case 'Notes':
          return <NotesCardPopUp notes={getId} performCancel={performCancel} />;
      default:
        return null;
    }
  };

  return (
    <div>

      <div className="popup">
        {renderComponent()}
      </div>
    </div>
  );
};

export default ShowPopUp;
