import  express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import rootRouter from './routes/index.js';


const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    })
})

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Wallet Service API');
});


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Register routers
app.use('/api', rootRouter);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'API route not found' });
});