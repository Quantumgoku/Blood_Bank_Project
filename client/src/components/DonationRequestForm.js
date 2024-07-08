import React, { useState } from "react";
import "./DonationRequestForm.css";
import API from "../services/API";

const DonationRequestForm = ({ receiverWalletAddress }) => {
  const [bloodType, setBloodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [receiver, setReceiver] = useState(receiverWalletAddress || "");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationData = {
      bloodType,
      quantity,
      receiver,
      phone,
    };
    try {
      const response = await API.post("/donation/donate", donationData);
      console.log(response);
      setBloodType("");
      setQuantity("");
      setReceiver(receiverWalletAddress || "");
      setPhone("");
      alert("Donation request submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="donation-request-form">
      <h2>Donation Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Group:</label>
          <input
            type="text"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity (ML):</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Receiver Wallet Address:</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            readOnly={!!receiverWalletAddress}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Submit Donation Request</button>
      </form>
    </div>
  );
};

export default DonationRequestForm;
