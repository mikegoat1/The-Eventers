import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MissionStatement from '@/components/MissionStatement';
import Footer from '@/components/Footer';
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
    <>
      <Navbar title="GATHERHUB" user={user} />
      <HeroSection title="Welcome to GatherHub" />
      <MissionStatement />
      <Footer />
    </>
  );
};

export default Home;
