import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register'); // or navigate('/login') if preferred
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Stay Organized with <span className="text-blue-600">ToDo Manager</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Simplify your tasks, boost your productivity. Create, update, and manage all your tasks in one place.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>

        {/* Optional image or illustration */}
        <div className="mt-10 hidden md:block">
          <img
            src="https://cdn.dribbble.com/userupload/43341352/file/original-a9c4545803a3ca3739a7987cafb0a970.png?resize=752x&vertical=center"
            alt="ToDo Illustration"
            className="mx-auto w-2/3"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
