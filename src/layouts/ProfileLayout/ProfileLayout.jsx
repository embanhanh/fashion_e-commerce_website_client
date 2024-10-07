import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './ProfileLayout.scss'; 

const ProfileLayout = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-5 col-lg mb-3">
                    <Sidebar />
                </div>

                <main className="col-lg-9 col-md-8 col-sm px-md-4"> {/* Use col-12 for small screens */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
