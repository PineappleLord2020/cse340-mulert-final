/**
 * You will need to add this code in the correct locations in your server.js
 * 
 * You will also need to add the following to your ENV file:
 * DB_URL=postgresql://[username]:[password]@143.198.247.195:5432/[databaseName]
 */

import pgSession from 'connect-pg-simple';
const PostgresStore = pgSession(session);
import dbClient from './src/database/index.js';

// Configure session middleware
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