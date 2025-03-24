import React from 'react';
import { useLocation } from 'react-router-dom';

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const OrganizationDetails = () => {
  const { state } = useLocation(); // Access navigation state
  const organization = state?.organization; // Get organization data from state

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div style={{ padding: '20px', color: '#FDF0D5', backgroundColor: '#1e1e1e' }}>
      <h1>{organization.organizationName}</h1>
      <p>Location: {organization.location}</p>
      <p>Email: {organization.gmail}</p>
      <p>Last Updated: {new Date(organization.createTime).toLocaleDateString()}</p>
      
      <h2>Blood Inventory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Blood Type</th>
            <th>Red Blood Cells</th>
            <th>Plasma</th>
            <th>Platelets</th>
          </tr>
        </thead>
        <tbody>
          {bloodTypes.map((bt) => (
            <tr key={bt}>
              <td>{bt}</td>
              <td>{organization.bloodInventory?.['Red Blood Cells']?.[bt] || 0} L</td>
              <td>{organization.bloodInventory?.Plasma?.[bt] || 0} L</td>
              <td>{organization.bloodInventory?.Platelets?.[bt] || 0} L</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};