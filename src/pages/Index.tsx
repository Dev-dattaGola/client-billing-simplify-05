
import React from 'react';
import LandingPage from './LandingPage';

const Index = () => {
  // Render the landing page directly without any conditional logic
  // that might cause re-renders
  return <LandingPage />;
};

export default React.memo(Index);
