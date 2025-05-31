import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import connectDB from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from 'path';

dotenv.config();

const __dirname = path.resolve(); // Get the current directory name
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(clerkMiddleware());     // Middleware for Clerk authentication
// The clerkMiddleware() function checks the request's cookies and headers for a session JWT and if found, attaches the Auth object to the request object under the auth key.

// app.use(express.urlencoded({ extended: true }));

//file upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'), // Temporary directory for uploaded files
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    createParentPath: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();

});