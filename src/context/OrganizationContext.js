import React, { createContext, useState, useEffect, useContext } from 'react';
import { organizationCollection } from "../firebase";
import { getDocs } from 'firebase/firestore';

export const OrganizationContext = createContext();

export const useOrganizationContext = () => {
  return useContext(OrganizationContext);
};

export const OrganizationProvider = ({ children }) => {
  const [organizationData, setOrganizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const querySnapshot = await getDocs(organizationCollection);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setOrganizationData(data);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  return (
    <OrganizationContext.Provider value={{ organizationData, loading, error }}>
      {children}
    </OrganizationContext.Provider>
  );
};
