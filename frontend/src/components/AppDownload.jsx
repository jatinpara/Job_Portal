import React from 'react';

const AppDownload = () => {
  return (
    <div className="bg-blue-600 p-10 mt-24">
      {/* Mobile App Banner */}
      <section className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-blue-600">Download Mobile App</h3>
          <p className="text-gray-700 mt-2">For a better experience</p>
          <div className="mt-6 flex gap-4">
            <img src="google-play.png" alt="Google Play" className="h-12 transition-transform transform hover:scale-105" />
            <img src="app-store.png" alt="App Store" className="h-12 transition-transform transform hover:scale-105" />
          </div>
        </div>
        <img src="woman-pointing.png" alt="Mobile App" className="h-48" />
      </section>
    </div>
  );
};

export default AppDownload;
