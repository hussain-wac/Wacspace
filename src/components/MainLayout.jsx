// MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Layouts/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
