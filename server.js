/**
 * Imports
 */
import configNodeEnv from './src/middleware/node-env.js';
import express from "express";
import fileUploads from './src/middleware/file-uploads.js';
import homeRoute from './src/routes/index.js';
import contactRoute from './src/routes/contact/index.js';
import accountRoute from './src/routes/account/index.js';
import vehicleRoute from './src/routes/vehicles/index.js';
import layouts from './src/middleware/layouts.js';
import path from "path";
import { configureStaticPaths } from './src/utils/index.js';
import { fileURLToPath } from 'url';
import { testDatabase } from './src/models/index.js';
import pgSession from 'connect-pg-simple';
import session from 'express-session';
import flash from "./src/middleware/flash-messages.js";
import dbClient from "./src/models/index.js";

/**
 * Global Variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.NODE_ENV;
const port = process.env.PORT;
const PostgresStore = pgSession(session);

/**
 * Create and configure the Express server
 */
const app = express();

app.use(session({
    store: new PostgresStore({
        pool: dbClient, // Use your PostgreSQL pool
        tableName: 'sessions', // Table name for storing sessions
        createTableIfMissing: true // Creates table if it doesn't exist
    }),
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
    cookie: {
        secure: false, // Set to `true` in production with HTTPS
        httpOnly: true, // Prevents client-side access to the cookie
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    }
}));

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths (public dirs) for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(flash);

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set('layout default', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use('/', homeRoute);
app.use('/contact', contactRoute);
app.use('/account', accountRoute);
app.use('/vehicles', vehicleRoute);

/**
 * Start the server
 */

// When in development mode, start a WebSocket server for live reloading
if (mode.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(port) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the Express server
app.listen(port, async () => {
    await testDatabase();
    console.log(`Server running on http://127.0.0.1:${port}`);
});