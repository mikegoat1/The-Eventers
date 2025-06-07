import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MissionStatement from '@/components/MissionStatement';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import { Box } from '@mui/material';
import React from 'react';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return { props: { user: null } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user: { id: decoded.userId } } };
  } catch {
    return { props: { user: null } };
  }
}
const Home = ({ user }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        // background: 'linear-gradient(120deg, #FFF1CC, #FFD33D, #FFF1CC)',
        background: 'linear-gradient(120deg, #FDF6ED, #ECE7E1, #B1A79E)',
      }}
    >
      <Navbar title="GATHERHUB" user={user} />
      <HeroSection title="Welcome to GatherHub" />
      <MissionStatement />
      <Carousel user={user} filterCategory={'Health'} maxItems={6} />
      <Footer />
    </Box>
  );
};

export default Home;
