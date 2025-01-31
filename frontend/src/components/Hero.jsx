import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext.jsx'; // Importing the context

const Hero = () => {
  const [inputValue, setInputValue] = useState('');
  const { updateSearchQuery } = useJobContext(); // Accessing the function to update search query in context

  const handleSearch = () => {
    updateSearchQuery(inputValue); // Update search query in the context
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-900 text-white text-center py-16 rounded-2xl">
        <h2 className="text-3xl font-bold">Over 10,000+ jobs to apply</h2>
        <p className="mt-2">Your Next Big Career Move Starts Right Here</p>
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search for jobs"
            className="p-3 w-1/2 rounded-l-lg text-gray-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 px-6 text-white rounded-r-lg"
          >
            Search
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
