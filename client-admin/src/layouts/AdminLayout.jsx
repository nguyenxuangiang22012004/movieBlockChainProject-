import React from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import Sidebar from '../components/Sidebar';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/admin/login');
  };
  return (
    <>
      <HeaderAdmin />
      <Sidebar onLogout={handleLogout} />
      <main className="main">
        <Outlet /> 
      </main>
    </>
  );
}

export default AdminLayout;