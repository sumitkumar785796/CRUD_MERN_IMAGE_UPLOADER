require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT||3001;
const connDB = require('./utils/db');
const routes = require('./routes/routes');
const cors = require('cors')
app.use(cors())
// Your middleware to set current page
app.use((req, res, next) => {
    res.locals.currentPage = req.path;
    next();
});

// Set static file path
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// middleware json parser
app.use(express.json())
// Serve static files to react
app.use(express.static(path.resolve(__dirname,"client","build")))
// Use routes
app.use("/", routes);



const serverStart = async () => {
    try {
        await connDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error', error);
    }
};

serverStart();
