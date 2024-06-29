const express = require('express');
const router = express.Router();
const mockUsers = require('../utils/mock_data');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = mockUsers.find((u) => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
