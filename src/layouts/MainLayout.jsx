import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function Mainlayout() {
    return (
        <>
            <div className=" d-flex" style={{ justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ width: '80%', backgroundColor: '#fff' }}>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                        <div className="container">
                            <Link className="navbar-brand" to="/">
                                Brand
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/home">
                                            Home
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <main>
                        <Outlet />
                    </main>
                    <footer>Main Layout Footer</footer>
                </div>
            </div>
        </>
    )
}

export default Mainlayout
