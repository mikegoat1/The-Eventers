import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MissionStatement from '@/components/MissionStatement';
import Footer from '@/components/Footer';
import React from 'react';

const Home = () => {
  return (
    <>
      <Navbar title="GATHERHUB" />
      <HeroSection title="Welcome to the Home Page" />
      <MissionStatement />
      <Footer />
    </>
  );
};

export default Home;
