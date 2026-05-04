import React from 'react';
import { Outlet } from 'react-router-dom';
import './layout.css';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <main className="auth-container">
        <Outlet />
      </main>
    </div>
  );
};
