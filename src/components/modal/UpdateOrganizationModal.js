import React, { useState } from "react";
import { Modal, Box, MenuItem, Select, Button, CircularProgress } from "@mui/material";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { organizationCollection } from "../../firebase";
import "./UpdateModal.css";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const components = ["Plasma", "Red Blood Cells", "Platelets"];

export const UpdateOrganizationModal = ({ open, handleClose, organizationId, refreshData }) => {
  const [component, setComponent] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!component || !bloodType || !amount) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const organizationRef = doc(organizationCollection, organizationId);
      const orgDoc = await getDoc(organizationRef);

      if (!orgDoc.exists()) {
        setError("Organization not found.");
        setLoading(false);
        return;
      }

      await updateDoc(organizationRef, {
        [`bloodInventory.${component}.${bloodType}`]: amount,
      });

      setLoading(false);
      handleClose();
      refreshData();
    } catch (err) {
      console.error("Error updating organization data:", err);
      setError("Error updating organization data. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="update-modal-overlay">
        <Box className="update-modal-content">
          <span className="update-modal-close" onClick={handleClose}>&times;</span>
          <h2 className="update-modal-title">Update Supply</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="component" className="update-modal-label">Component:</label>
            <Select
              id="component"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Component
              </MenuItem>
              {components.map((opt, index) => (
                <MenuItem key={index} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>

            <label htmlFor="bloodType" className="update-modal-label">Blood Type:</label>
            <Select
              id="bloodType"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Blood Type
              </MenuItem>
              {bloodTypes.map((opt, index) => (
                <MenuItem key={index} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>

            <label htmlFor="amount" className="update-modal-label">New Amount (in mL):</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="update-modal-input"
            />

            {error && <Box className="update-modal-error">{error}</Box>}

            {loading ? (
              <Box className="update-modal-loading">
                <CircularProgress />
              </Box>
            ) : (
              <Button variant="contained" type="submit" className="update-modal-button">
                Update
              </Button>
            )}
          </form>
        </Box>
      </Box>
    </Modal>
  );
};
