require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const pensionerRoutes = require('./routes/pensioners');
const creditRoutes = require('./routes/credits');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/pensioners', pensionerRoutes);
app.use('/api/credits', creditRoutes);

app.get('/', (req, res) => res.json({ message: 'Pension Management API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));