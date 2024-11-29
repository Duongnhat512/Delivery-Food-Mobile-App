const express = require('express');
const app = express();
const authMiddleware = require('./src/middlewares/authenticate');
const viewEngine = require('./src/config/viewEngine');
require("./src/config/firebaseConfig");

const menuRoutes = require('./src/routes/menuItemsRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const userRoutes = require('./src/routes/userRoutes'); 



const db = require('./src/config/firebaseConfig').db;

viewEngine(app);

app.use(express.json());
app.use(authMiddleware);

// Routes

// Menu items routes
app.use('/api/v1/menu_items', menuRoutes)

// Order routes
app.use('/api/v1/orders', orderRoutes);

// Order details routes
app.use('/api/v1/order_details', orderDetailRoutes);

app.use('/api/v1/users', userRoutes);



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})