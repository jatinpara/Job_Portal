import React, { createContext, useState, useContext } from 'react';

// Create the context
const JobContext = createContext();

// Create a provider component
export const JobProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Function to update the search query
  const updateSearchQuery = (query) => setSearchQuery(query);

  return (
    <JobContext.Provider
      value={{
        searchQuery,
        updateSearchQuery,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use the JobContext
export const useJobContext = () => useContext(JobContext);
