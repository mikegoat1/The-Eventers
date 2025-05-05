import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MissionStatement from '@/components/MissionStatement';
import React from 'react';

const Home = () => {
  return (
    <>
      <Navbar title="GATHERHUB" />
      <HeroSection title="Welcome to the Home Page" />
      <MissionStatement />
    </>
  );
};

export default Home;
