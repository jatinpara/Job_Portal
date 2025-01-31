import React from "react";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";

const HomePage = () => {
  return (
    <div className="font-sans">
      {/* Header */}
     

      <Hero></Hero>

     

      {/* Job Listings */}
      
    <JobListing></JobListing>
      

     <AppDownload></AppDownload>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-500">
        <p>&copy; 2024 InsiderJobs. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
