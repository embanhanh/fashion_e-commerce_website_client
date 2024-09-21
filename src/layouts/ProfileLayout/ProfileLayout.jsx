import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
// import './ProfileLayout.css'; // Ensure this file has your custom styles

const ProfileLayout = () => {
    return (
        <div className="container">            
            <div className="row mb-3">
                <div className="col-12">
                    <div className="logo-container">
                        <h1 className='logo'>My Profile</h1>
                    </div>
                </div>
            </div>

            
            <div className="row ">            
                <div className="col-12 col-lg-3 col-md-4 col-sm-5 col-lg mb-3"> 
                    <Sidebar /> 
                </div>

                {/* Content on the right */}
                <main className="col-12 col-lg-9 col-md-8 col-sm px-md-4"> {/* Use col-12 for small screens */}
                    <Outlet /> {/* Render child routes here */}
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
