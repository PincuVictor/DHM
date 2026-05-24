import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackgroundAnimation from './BackgroundAnimation';

const Layout = () => {
    return (
        <div className="layout">
            <BackgroundAnimation />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
