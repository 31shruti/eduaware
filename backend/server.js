require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('EduAware API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));