const handler = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  console.log('%c Logout successful', 'color:green');
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = handler;
