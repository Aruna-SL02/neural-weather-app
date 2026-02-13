require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Schema for Favorite Cities
const citySchema = new mongoose.Schema({
    name: String
});
const City = mongoose.model('City', citySchema);

// 1. Route to Get Weather (Hides API Key)
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'City not found' });
    }
});

// 2. Route to Save a Favorite City
app.post('/api/favorites', async (req, res) => {
    const { name } = req.body;
    const existing = await City.findOne({ name });
    if (!existing) {
        const newCity = new City({ name });
        await newCity.save();
    }
    res.json({ message: 'City saved!' });
});

// 3. Route to Get All Favorites
app.get('/api/favorites', async (req, res) => {
    const cities = await City.find();
    res.json(cities);
});

// Test Route
app.get('/', (req, res) => {
    res.send("API is Running Successfully!");
});

// 4. Route to Delete a Favorite City
app.delete('/api/favorites/:id', async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.json({ message: 'City deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting city' });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));