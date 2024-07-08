import React from "react";
import { useLocation } from "react-router-dom";
import "./ResultsPage.css";

const ResultsPage = () => {
  const location = useLocation();
  const { organisations, hospitals } = location.state || {};

  return (
    <div className="results-page">
      <h3>Available Organizations and Hospitals</h3>
      <div className="results-section">
        <h4>Organizations And Hospitals</h4>
        <ul>
                  {organisations && organisations.map((org) => {
                      if (org.role == "organisation") {
                          return (
                              <li key={org._id}>
                                  {org.role} - {org.organisationName} - {org.email} - {org.address} - {org.phone}
                              </li>
                          );
                      }

                      if (org.role == "hospital") {
                          return (
                            <li key={org._id}>
                       {org.role} - {org.hospitalName} - {org.email} - {org.address} - {org.phone}
                     </li>  
                          );
                      }
              
                  })}
        </ul>
      </div>
    
    </div>
  );
};

export default ResultsPage;
