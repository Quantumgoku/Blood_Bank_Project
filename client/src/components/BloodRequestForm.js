import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BloodRequestForm.css";
import API from "../services/API";

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    unitsRequired: "",
    walletAddress: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      // Submit the blood request
      const requestData = {
        email: formData.email,
        bloodType: formData.bloodGroup,
        quantity: formData.unitsRequired,
        walletAddress: formData.walletAddress,
        phone: formData.phone,
      };

      await API.post("/request/create", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blood Request Submitted Successfully");

      // Fetch hospitals and organizations with the specified blood group
      const resultResponse = await axios.post(
        "http://localhost:4000/api/v1/inventory/get-orgs-and-hospitals",
        { bloodGroup: formData.bloodGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resultResponse.data.success) {
        console.log(resultResponse.data);
        navigate("/results", {
          state: {
            organisations: resultResponse.data.organisationDetails,
            hospitals: resultResponse.data.hospitalDetails,
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error Submitting Blood Request");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="blood-request-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Units Required:</label>
          <input
            type="number"
            name="unitsRequired"
            value={formData.unitsRequired}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Wallet Address:</label>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default BloodRequestForm;
