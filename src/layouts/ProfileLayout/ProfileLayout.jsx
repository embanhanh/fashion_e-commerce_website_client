import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './ProfileLayout.scss';

const ProfileLayout = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-3 mb-3">
                    <Sidebar />
                </div>

                <main className="col-9 px-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
