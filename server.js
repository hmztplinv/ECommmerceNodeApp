const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./database/db');
const port=process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

const authRouter = require('./routers/auth.router');
app.use('/api/auth', authRouter);

connection();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});