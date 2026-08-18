import React from 'react';
import { Navigate } from 'react-router-dom';

// Dashboard is just a redirect to To-Do for this phase
export const Dashboard: React.FC = () => {
  return <Navigate to="/todo" replace />;
};
