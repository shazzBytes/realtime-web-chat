const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');


function createApp() {
    const app = express();
    
    app.use(express.json());
    app.use(cors( {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));
    app.use('/auth', authRouter);

    return app;
}

module.exports = createApp;