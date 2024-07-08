import React from "react";
import { BiDonateBlood, BiUserCircle } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/Header.css"; // Import custom CSS for additional styling

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand h1">
          <BiDonateBlood color="red" /> Blood Bank App
        </div>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <p className="nav-link mb-0 d-flex align-items-center">
                <BiUserCircle className="me-2" />
                Welcome {user?.name || user?.hospitalName || user?.organisationName}
                &nbsp;
                <span className="badge bg-secondary">{user?.role}</span>
              </p>
            </li>
            {location.pathname === "/" ||
              location.pathname === "/donar" ||
              location.pathname === "/hospital" ? (
              <li className="nav-item mx-3">
                <Link to="/analytics" className="nav-link">
                  Analytics
                </Link>
              </li>
              ) : (
               <li className="nav-item mx-3">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
            )}
            <li className="nav-item mx-3">
              <button className="btn btn-lg btn-danger logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
