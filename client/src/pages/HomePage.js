import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";
import BloodRequestForm from "../components/BloodRequestForm";
import DonationRequestForm from "../components/DonationRequestForm";
import "./HomePage.css";

const HomePage = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [ donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Fetch blood records
  const getBloodRecords = async () => {
    try {
      const response = await API.get("/inventory/get-inventory");
      if (response?.data?.success) {
        setData(response.data.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch blood requests
  const getBloodRequests = async () => {
    try {
      const user = await API.get("/auth/current-user");
      const response = await API.get("/request");
      if (response?.status === 200) {
        const filteredRequests = response.data.filter(request => request.walletAddress !== user.data.user.WalletAddress);
        setRequests(filteredRequests);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch blood donations requests
  const getBloodDonationRequests = async () => {
    try{
      const user = await API.get("/auth/current-user");
      const donations = await API.get("/donation/getdonations", user.data.user._id);
      console.log(donations.data);
      if(donations?.status === 200){
        setDonations(donations.data);
      }
    }catch (error){
      console.error(error);
    }
  }

  useEffect(() => {
    getBloodRecords();
    getBloodRequests();
    getBloodDonationRequests();
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDonateClick = (request) => {
    setSelectedRequest(request);
    setShowDonationForm(true);
  };

  const handleCloseDonationForm = () => {
    setShowDonationForm(false);
    setSelectedRequest(null);
  };

  const handleAcknowledgeClick = async ( selecteddonationid ) => {
    try{
      const response = await API.post(`/donation/acknowledge/${selecteddonationid}`);
      if(response?.data?.success){
        alert(response.data.message);
        getBloodDonationRequests();
      }
      window.location.reload();
    }catch (error){
      console.error(error);
    }
  }

  return (
    <Layout>
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4
              className="add-inventory"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-plus text-success"></i> Add Inventory
            </h4>

            <button onClick={handleButtonClick} className="btn btn-primary">
              Request Blood
            </button>
          </div>

          <h4>Blood Inventory</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Donor Email</th>
                <th scope="col">Time & Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr key={record._id}>
                  <td>{record.bloodGroup}</td>
                  <td>{record.inventoryType}</td>
                  <td>{record.quantity} (ML)</td>
                  <td>{record.email}</td>
                  <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="mt-4">Blood Requests</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Units Required</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Wallet Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((request) => (
                <tr key={request._id}>
                  <td>{request.bloodType}</td>
                  <td>{request.quantity} (Units)</td>
                  <td>{request.email}</td>
                  <td>{request.phone}</td>
                  <td>{request.walletAddress}</td>
                  <td>
                    <button
                      onClick={() => handleDonateClick(request)}
                      className="btn btn-success"
                    >
                      Donate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="mt-4">Blood Donation Requests</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Blood Type</th>
                <th scope="col">Units Required</th>
                <th scope="col">Donor Wallet Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations?.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.bloodType}</td>
                  <td>{donation.quantity} (Units)</td>
                  <td>{donation.donor}</td>
                  <td>
                    <button
                      onClick={() => handleAcknowledgeClick( donation._id )}
                      className="btn btn-success"
                    >
                      Acknowledge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showForm && (
            <div className="custom-modal" onClick={handleCloseForm}>
              <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={handleCloseForm}>
                  &times;
                </span>
                <BloodRequestForm />
              </div>
            </div>
          )}

          {showDonationForm && selectedRequest && (
            <div className="custom-modal" onClick={handleCloseDonationForm}>
              <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={handleCloseDonationForm}>
                  &times;
                </span>
                <DonationRequestForm receiverWalletAddress={selectedRequest.walletAddress} />
              </div>
            </div>
          )}

          <Modal />
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
