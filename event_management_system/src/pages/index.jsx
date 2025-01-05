import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import React from 'react';

const Home = () => {
  return (
    <>
      <Navbar title="GATHERHUB" />
      <HeroSection title="Welcome to the Home Page" />
      <h1>Welcome to the Home Page</h1>
      <p>This is the main entry point of the application.</p>
    </>
  );
};

export default Home;
