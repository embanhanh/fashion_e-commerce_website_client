import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaUser,
    FaBagShopping,
    FaRegHeart,
    FaLocationDot,
    FaCreditCard,
    FaRegBell,
    FaGear,
    FaCircleUser,
} from "react-icons/fa6";
import './Sidebar.scss';

function Sidebar() {
    const menuItem = [
        {
            path: "/user/account/profile",
            name: "Thông tin cá nhân",
            icon: <FaCircleUser />
        },
        {
            path: "/user/account/orders",
            name: "Đơn hàng",
            icon: <FaBagShopping />
        },
        {
            path: "/user/account/wishlists",
            name: "Danh sách yêu thích",
            icon: <FaRegHeart />
        },
        {
            path: "/user/account/addresses",
            name: "Địa chỉ",
            icon: <FaLocationDot />
        },        
        {
            path: "/user/account/notifications",
            name: "Thông báo",
            icon: <FaRegBell />
        },        
    ];

    return (
        <nav className="sidebar-nav">
            <div>
                <span>o day chua hinh</span>
            </div>
            <div className="d-flex flex-column bg-light d-inline-flex ">
                <ul className="nav nav-pills flex-column mb-auto ">
                    {menuItem.map((item, index) => (
                        <li key={index} className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "sidebar-nav-link active" : "sidebar-nav-link"
                                }
                                to={item.path}
                                end
                            >
                                <span className="icon-container">{item.icon}</span>
                                <span className="d-block">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Sidebar;
