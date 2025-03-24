import React, { useEffect, useState } from "react";
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

const styles = {
  body: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // vertically center content
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "rgba(30, 30, 30, 1)",
    backdropFilter: "blur(20px)",
    padding: "20px",
    margin: 0,
  },
  signOutButton: {
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
  wrapper: {
    width: "100%",
    maxWidth: "1200px",
    color: "#FDF0D5",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    alignItems: "center",
  },
  headerContainer: {
    textAlign: "center",
  },
  headerH1: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  organization: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#669BBC",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    padding: "0 20px",
  },
  table: {
    width: "100%",
    textAlign: "center",
    fontSize: "18px",
    borderCollapse: "collapse",
  },
  tableHeader: {
    fontSize: "24px",
    color: "#C1121F",
    padding: "10px",
  },
  tableCell: {
    padding: "10px",
    border: "none", // no borders between cells
  },
  type: {
    fontSize: "24px",
    color: "#669BBC",
  },
  updateContainer: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "0 20px",
  },
  update: {
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
  updated: {
    margin: "10px 0",
  },
};

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
      const lastWord = words[words.length - 2].toLowerCase();
      if (lastWord === "hospital") {
        navigate("/hospital");
      }
    }
  }, [currentUser, navigate]);

  const fetchOrgData = async () => {
    try {
      const q = query(organizationCollection, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      // Only create new doc if no existing records found
      if (querySnapshot.empty) {
        const displayNameParts = currentUser.displayName.split(" ");
        const organizationName = displayNameParts[0];
        const location = displayNameParts.slice(4).join(" ") || "Unknown Location";

        // Create new doc only once
        const newOrgRef = await addDoc(organizationCollection, {
          uid: currentUser.uid,
          organizationName: organizationName,
          gmail: currentUser.email,
          location: location,
          bloodInventory: defaultInventory,
          createdAt: new Date(),
        });

        // Set state directly from new doc reference
        const newDoc = await getDoc(newOrgRef);
        if (newDoc.exists()) {
          setOrgData(newDoc.data());
          setSelectedOrganizationId(newDoc.id);
        }
      } else {
        // Use existing data without re-fetching
        const doc = querySnapshot.docs[0];
        setOrgData(doc.data());
        setSelectedOrganizationId(doc.id);
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn && !loading) {
      navigate("/signup");
    } else if (currentUser && !orgData) { // Only fetch if orgData doesn't exist
      fetchOrgData();
    }
  }, [currentUser, isUserLoggedIn, loading, navigate, orgData]);

  useEffect(() => {
    if (!isUserLoggedIn && !loading) {
      navigate("/signup");
    } else if (currentUser) {
      fetchOrgData();
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOutFunction();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshData = () => {
    fetchOrgData();
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
    <div style={styles.body}>
      <button onClick={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </button>
      <div style={styles.wrapper}>
        {/* Header with Dashboard title and Organization name */}
        <div style={styles.headerContainer}>
          <h1 style={styles.headerH1}>DASHBOARD</h1>
          <div style={styles.organization}>
            <p>{orgData?.organizationName || "BloodBank Foundation"}</p>
          </div>
        </div>

        {/* Inventory Table */}
        {orgData && orgData.bloodInventory ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Blood Type</th>
                  <th style={styles.tableHeader}>Red Blood Cells</th>
                  <th style={styles.tableHeader}>Plasma</th>
                  <th style={styles.tableHeader}>Platelets</th>
                </tr>
              </thead>
              <tbody>
                {bloodTypes.map((type) => (
                  <tr key={type}>
                    <td style={{ ...styles.tableCell, ...styles.type }}>{type}</td>
                    <td style={styles.tableCell}>
                      {orgData.bloodInventory["Red Blood Cells"] ? orgData.bloodInventory["Red Blood Cells"][type] : 0} L
                    </td>
                    <td style={styles.tableCell}>
                      {orgData.bloodInventory["Plasma"] ? orgData.bloodInventory["Plasma"][type] : 0} L
                    </td>
                    <td style={styles.tableCell}>
                      {orgData.bloodInventory["Platelets"] ? orgData.bloodInventory["Platelets"][type] : 0} L
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
        <div style={styles.updateContainer}>
          <button style={styles.update} onClick={() => setIsModalOpen(true)}>
            Update Supply
          </button>
          <div style={styles.updated}>
            <p>Last Updated: March 23rd, 2025</p>
          </div>
        </div>
      </div>

      {/* Update Supply Modal */}
      <UpdateOrganizationModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        organizationId={selectedOrganizationId}
        refreshData={refreshData}
      />
    </div>
  );
};

export default Home;
