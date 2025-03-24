import React, { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { signOutFunction, organizationCollection } from "../../firebase";
import { query, where, getDocs, addDoc, getDoc } from "firebase/firestore";
import { UpdateOrganizationModal } from "../../components";
import { CircularProgress } from "@mui/material";

// Default inventory data for new organizations
const defaultInventory = {
  Plasma: { "O+": 0, "O-": 0, "AB+": 0, "AB-": 0, "A+": 0, "A-": 0, "B+": 0, "B-": 0 },
  "Red Blood Cells": { "O+": 0, "O-": 0, "AB+": 0, "AB-": 0, "A+": 0, "A-": 0, "B+": 0, "B-": 0 },
  Platelets: { "O+": 0, "O-": 0, "AB+": 0, "AB-": 0, "A+": 0, "A-": 0, "B+": 0, "B-": 0 },
};

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const Home = () => {
  const { currentUser, isUserLoggedIn, loading } = useUserContext();
  const [orgData, setOrgData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      const words = currentUser.displayName.split(" ");
      if (words.length >= 2 && words[words.length - 2].toLowerCase() === "hospital") {
        navigate("/hospital");
      }
    }
  }, [currentUser, navigate]);

  const fetchOrgData = useCallback(async () => {
    try {
      if (!currentUser) return;

      const q = query(organizationCollection, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const displayNameParts = currentUser.displayName.split(" ");
        const organizationName = displayNameParts[0];
        const location = displayNameParts.slice(4).join(" ") || "Unknown Location";

        const newOrgRef = await addDoc(organizationCollection, {
          uid: currentUser.uid,
          organizationName,
          gmail: currentUser.email,
          location,
          bloodInventory: defaultInventory,
          createdAt: new Date(),
        });

        const newDoc = await getDoc(newOrgRef);
        if (newDoc.exists()) {
          setOrgData(newDoc.data());
          setSelectedOrganizationId(newOrgRef.id);
        }
      } else {
        const doc = querySnapshot.docs[0];
        setOrgData(doc.data());
        setSelectedOrganizationId(doc.id);
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setFetching(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isUserLoggedIn && !loading) {
      navigate("/signup");
    } else if (currentUser && !orgData) {
      fetchOrgData();
    }
  }, [currentUser, isUserLoggedIn, loading, navigate, fetchOrgData, orgData]);

  const handleSignOut = async () => {
    try {
      await signOutFunction();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading || fetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#1e1e1e",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={homeStyles.homeBody}>
      <button onClick={handleSignOut} style={homeStyles.homeSignOutButton}>
        Sign Out
      </button>
      <div style={homeStyles.homeWrapper}>
        {/* Header with Dashboard title and Organization name */}
        <div style={homeStyles.homeHeaderContainer}>
          <h1 style={homeStyles.homeHeaderH1}>DASHBOARD</h1>
          <div style={homeStyles.homeOrganization}>
            <p>{orgData?.organizationName || "BloodBank Foundation"}</p>
          </div>
        </div>

        {/* Inventory Table */}
        {orgData && orgData.bloodInventory ? (
          <div style={homeStyles.homeTableContainer}>
            <table style={homeStyles.homeTable}>
              <thead>
                <tr>
                  <th style={homeStyles.homeTableHeader}>Blood Type</th>
                  <th style={homeStyles.homeTableHeader}>Red Blood Cells</th>
                  <th style={homeStyles.homeTableHeader}>Plasma</th>
                  <th style={homeStyles.homeTableHeader}>Platelets</th>
                </tr>
              </thead>
              <tbody>
                {bloodTypes.map((type) => (
                  <tr key={type}>
                    <td style={{ ...homeStyles.homeTableCell, ...homeStyles.homeType }}>
                      {type}
                    </td>
                    <td style={homeStyles.homeTableCell}>
                      {orgData.bloodInventory["Red Blood Cells"][type]} L
                    </td>
                    <td style={homeStyles.homeTableCell}>
                      {orgData.bloodInventory["Plasma"][type]} L
                    </td>
                    <td style={homeStyles.homeTableCell}>
                      {orgData.bloodInventory["Platelets"][type]} L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No inventory data found.</p>
        )}

        {/* Update Supply Button */}
        <div style={homeStyles.homeUpdateContainer}>
          <button style={homeStyles.homeUpdate} onClick={() => setIsModalOpen(true)}>
            Update Supply
          </button>
          <div style={homeStyles.homeUpdated}>
            <p>Last Updated: March 23rd, 2025</p>
          </div>
        </div>
      </div>

      {/* Update Supply Modal */}
      <UpdateOrganizationModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        organizationId={selectedOrganizationId}
        refreshData={fetchOrgData}
      />
    </div>
  );
};

const homeStyles = {
  homeBody: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // vertically center content
    minHeight: "100vh",
    width: "100vw",
    backdropFilter: "blur(20px)",
    padding: "20px",
    margin: 0,
  },
  homeSignOutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    outline: "none",
    borderRadius: "40px",
    background: "#C1121F",
    cursor: "pointer",
    color: "#FDF0D5",
    padding: "10px 20px",
  },
  homeWrapper: {
    width: "100%",
    maxWidth: "1200px",
    color: "#FDF0D5",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    alignItems: "center",
  },
  homeHeaderContainer: {
    textAlign: "center",
  },
  homeHeaderH1: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  homeOrganization: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#669BBC",
  },
  homeTableContainer: {
    width: "100%",
    overflowX: "auto",
    padding: "0 20px",
  },
  homeTable: {
    width: "100%",
    textAlign: "center",
    fontSize: "18px",
    borderCollapse: "collapse",
  },
  homeTableHeader: {
    fontSize: "24px",
    color: "#C1121F",
    padding: "10px",
  },
  homeTableCell: {
    padding: "10px",
    border: "none", // no borders between cells
  },
  homeType: {
    fontSize: "24px",
    color: "#669BBC",
  },
  homeUpdateContainer: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "0 20px",
  },
  homeUpdate: {
    height: "70px",
    width: "100%",
    fontSize: "22px",
    fontWeight: "bold",
    border: "none",
    outline: "none",
    borderRadius: "40px",
    background: "#C1121F",
    cursor: "pointer",
    color: "#FDF0D5",
  },
  homeUpdated: {
    margin: "10px 0",
  },
};

export default Home;
