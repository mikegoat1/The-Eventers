import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import axios from '../../../lib/axios';
import { Box, TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, Snackbar, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CATEGORIES = ['Music', 'Sports', 'Education', 'Health', 'Technology', 'Other'];

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

const CreateEvent = ({ user }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({ severity: 'info', message: '' });

  if (!user) {
    // If not logged in, show a simple message and a link to login
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6">You must be logged in to create events.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/login')}>Go to Login</Button>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !date || !location) {
      setSnackbarData({ severity: 'warning', message: 'Please fill in name, date, and location.' });
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        name,
        date: new Date(date).toISOString(),
        location,
        description,
        category,
        attendees: [],
      };
      await axios.post('/events', payload);
      setSnackbarData({ severity: 'success', message: 'Event created successfully' });
      setSnackbarOpen(true);
      setTimeout(() => router.push('/events'), 800);
    } catch (error) {
      console.error('Error creating event:', error);
      setSnackbarData({ severity: 'error', message: 'Failed to create event' });
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <Navbar title="GATHERHUB" user={user} />
      <Box sx={{ maxWidth: 700, mx: 'auto', py: 6, px: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Create Event</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Event Name" value={name} required onChange={(e) => setName(e.target.value)} />
          <TextField label="Date & Time" type="datetime-local" value={date} required onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Location" value={location} required onChange={(e) => setLocation(e.target.value)} />
          <TextField label="Description" value={description} multiline rows={4} onChange={(e) => setDescription(e.target.value)} />
          <FormControl>
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">Create Event</Button>
            <Button variant="outlined" onClick={() => router.push('/events')}>Cancel</Button>
          </Box>
        </Box>
      </Box>
      <Footer />

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarData.severity} sx={{ width: '100%' }}>{snackbarData.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEvent;
