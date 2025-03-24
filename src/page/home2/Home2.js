import React, { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import { useOrganizationContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context";
import { signOutFunction } from "../../firebase"; // Ensure this path is correct
const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const styles = {
  home2_body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#1e1e1e",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  home2_wrapper: {
    width: "100%",
    maxWidth: "900px",
    color: "#FDF0D5",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    textAlign: "center",
    marginTop: "50px",
  },
  home2_headerH1: {
    fontSize: "24px",
    color: "#FDF0D5",
    marginBottom: "10px",
  },
  home2_organization: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#669BBC",
    marginBottom: "30px",
  },
  home2_table: {
    width: "100%",
    textAlign: "center",
    fontSize: "16px",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  home2_tableHeader: {
    fontSize: "18px",
    color: "#C1121F",
    padding: "10px",
    borderBottom: "2px solid #669BBC",
  },
  home2_input: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    width: "150px",
    height: "28px",
    textAlign: "center",
    color: "#FDF0D5",
    fontSize: "16px",
    borderRadius: "5px",
    margin: "5px 0",
    "&:focus": {
      outline: "2px solid #669BBC",
    },
  },
  home2_searchButton: {
    backgroundColor: "#C1121F",
    color: "#FDF0D5",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    padding: "12px 150px",
    borderRadius: "40px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.9,
    },
  },
  home2_fullWidthDivider: {
    width: "100vw",
    backgroundColor: "#FDF0D5",
    height: "1px",
    margin: "20px 0",
  },
  home2_donorsList: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#000000",
    borderRadius: "15px",
    color: "#FDF0D5",
    width: "90%",
    maxWidth: "800px",
    textAlign: "center",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  donorCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(30,30,30)",
    padding: "20px",
    borderRadius: "10px",
    margin: "15px 0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(198, 18, 31, 0.2)",
    },
  },
  donorDetails: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    gap: "8px",
  },
  donorTotalDiff: {
    fontSize: "24px",
    fontWeight: "bold",
    marginLeft: "30px",
    minWidth: "80px",
    home2_bloodTypeText: {
      color: "#669BBC",
      fontWeight: "500",
    },
    signOutButton: {
      backgroundColor: "#C1121F",
      color: "#FDF0D5",
      fontSize: "16px",
      fontWeight: "bold",
      border: "none",
      padding: "10px 20px",
      borderRadius: "20px",
      cursor: "pointer",
      marginBottom: "20px",
      transition: "opacity 0.2s ease",
      "&:hover": {
        opacity: 0.9,
      },
    },
  },
};

export const Home2 = () => {
  const { organizationData, loading, error } = useOrganizationContext();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(() =>
    bloodTypes.reduce((acc, bt) => {
      acc[bt] = { rbc: "", plasma: "", platelets: "" };
      return acc;
    }, {})
  );
  const [donors, setDonors] = useState([]);
  const { currentUser } = useUserContext();
  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      const words = currentUser.displayName.split(" ");
      const lastWord = words[words.length - 2].toLowerCase();
      if (lastWord === "/") {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);
  const handleInputChange = (bloodType, component, value) => {
    setInventory((prev) => ({
      ...prev,
      [bloodType]: {
        ...prev[bloodType],
        [component]: value,
      },
    }));
  };
  const handleSignOut = async () => {
    try {
      await signOutFunction();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleSearch = async () => {
    if (!organizationData || organizationData.length === 0) {
      console.log("Organization data not loaded or empty.");
      return;
    }

    // Collect selected requirements with values
    const selectedRequirements = [];
    let totalAmountNeeded = 0;

    bloodTypes.forEach((bt) => {
      ["rbc", "plasma", "platelets"].forEach((component) => {
        const value = Number(inventory[bt][component]);
        if (!isNaN(value) && value > 0) {
          selectedRequirements.push({
            bloodType: bt,
            component,
            required: value,
          });
          totalAmountNeeded += value;
        }
      });
    });

    if (selectedRequirements.length === 0) {
      console.log("No blood requirements selected.");
      setDonors([]);
      return;
    }

    const componentMapping = {
      rbc: "Red Blood Cells",
      plasma: "Plasma",
      platelets: "Platelets",
    };

    // Filter organizations that have at least one type of blood in their inventory
    const matchedOrgs = organizationData
      .filter((org) => {
        // Check if the organization has at least one blood type with inventory > 0
        return bloodTypes.some((bt) => {
          return (
            org.bloodInventory?.["Red Blood Cells"]?.[bt] > 0 ||
            org.bloodInventory?.Plasma?.[bt] > 0 ||
            org.bloodInventory?.Platelets?.[bt] > 0
          );
        });
      })
      .map((org) => {
        let totalDifference = 0;
        let meetsAll = true;

        selectedRequirements.forEach(({ bloodType, component, required }) => {
          const firebaseComponent = componentMapping[component];
          const available = Number(
            org.bloodInventory?.[firebaseComponent]?.[bloodType] || 0
          );

          if (available < required) meetsAll = false;
          totalDifference += Math.abs(required - available);
        });

        const percent =
          totalAmountNeeded > 0
            ? Math.round(100 - totalDifference * (100 / totalAmountNeeded) + 34)
            : 0;

        return {
          ...org,
          totalDifference,
          percent: Math.min(100, Math.max(0, percent)),
          meetsAll,
        };
      });

    // Remove duplicate organizations based on their unique identifier (e.g., uid)
    const uniqueOrgs = matchedOrgs.reduce((acc, org) => {
      if (!acc.some((o) => o.uid === org.uid)) {
        acc.push(org);
      }
      return acc;
    }, []);

    // Sort by percentage match
    const filteredOrgs = uniqueOrgs.sort((a, b) => b.percent - a.percent);
    setDonors(filteredOrgs);
  };
  const handleDonorClick = (donor) => {
    navigate(`/organization/${donor.uid}`, {
      state: { organization: donor }  // Pass the entire donor object as state
    });
  };
  
  useEffect(() => {
    if (loading) {
      console.log("Loading organization data...");
    } else if (organizationData) {
      console.log("Organization Data:", organizationData);
    }
  }, [loading, organizationData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log(donors);
  return (
    <div style={styles.home2_body}>
      <div style={styles.home2_wrapper}>
        <div
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <button
            onClick={handleSignOut}
            style={{
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
            }}
          >
            Sign Out
          </button>
        </div>
        <h1 style={styles.home2_headerH1}>DONOR SEARCH</h1>
        <p style={styles.home2_organization}>Hospital Blood Requirements</p>

        <table style={styles.home2_table}>
          <thead>
            <tr>
              <th style={styles.home2_tableHeader}>Blood Type</th>
              <th style={styles.home2_tableHeader}>Red Blood Cells</th>
              <th style={styles.home2_tableHeader}>Plasma</th>
              <th style={styles.home2_tableHeader}>Platelets</th>
            </tr>
          </thead>
          <tbody>
            {bloodTypes.map((bt) => (
              <tr key={bt}>
                <td style={styles.home2_bloodTypeText}>{bt}</td>
                {["rbc", "plasma", "platelets"].map((component) => (
                  <td key={`${bt}-${component}`}>
                    <input
                      type="number"
                      style={styles.home2_input}
                      value={inventory[bt][component]}
                      onChange={(e) =>
                        handleInputChange(bt, component, e.target.value)
                      }
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button style={styles.home2_searchButton} onClick={handleSearch}>
          Find Matches
        </button>

        <Divider style={styles.home2_fullWidthDivider} />
        {donors.length > 0 && (
          <div style={styles.home2_donorsList} className="home2-donors-list">
            <h2>Compatibility Matches</h2>
            {donors.map((donor, index) => {
              const percentColor =
                donor.percent >= 80
                  ? "#2ecc71"
                  : donor.percent >= 35
                  ? "#f1c40f"
                  : "#e74c3c";
              return (
                <div
                  key={index}
                  style={styles.donorCard}
                  onClick={() => handleDonorClick(donor)}
                >
                  <div style={styles.donorDetails}>
                    <p>
                      <strong>{donor.organizationName}</strong>
                    </p>
                    <p>Email: {donor.gmail ?? "N/A"}</p>
                    <p style={{ fontSize: "0.9em", color: "#888" }}>
                      Updated:{" "}
                      {donor.createdAt
                        ? new Date(
                            donor.createdAt.toDate()
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div
                    style={{
                      ...styles.donorTotalDiff,
                      color: percentColor,
                    }}
                  >
                    {donor.percent}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home2;
