import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaSearch, FaBell } from 'react-icons/fa';

const Navbar = ({ unreadNotifications }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <FaGraduationCap className="brand-icon" />
            <span>EduSocial</span>
          </Link>
          
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for educational content..." 
              className="search-input"
            />
          </div>
          
          <div className="nav-right">
            <div className="user-avatar">
              <div className="avatar">G</div>
              <span className="username">Guest</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;