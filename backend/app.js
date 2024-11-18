const express = require('express');
const app = express();
const authMiddleware = require('./src/middlewares/authenticate');
const viewEngine = require('./src/config/viewEngine');
require("./src/config/firebaseConfig");

const menuRoutes = require('./src/routes/menuItemsRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');

const db = require('./src/config/firebaseConfig').db;

viewEngine(app);

app.use(express.json());
app.use(authMiddleware);

app.use('/v1', menuRoutes)

app.use('/v1', orderRoutes);

app.use('/order_details', orderDetailRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})