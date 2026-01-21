import React from 'react';
import { ViewportContainer } from './ViewportContainer';
import { InfoPanel } from './InfoPanel';
import './RightPanel.css';

export const RightPanel: React.FC = () => {
  return (
    <div className="right-panel">
      <ViewportContainer />
      <InfoPanel />
    </div>
  );
};
