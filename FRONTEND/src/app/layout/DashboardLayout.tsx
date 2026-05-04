import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import './layout.css';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Topbar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
