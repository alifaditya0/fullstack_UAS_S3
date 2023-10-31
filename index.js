const express = require('express')
const app = express()
const port = 3000
const cors = require ('cors')

app.use(cors());


const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public/images')))

const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());

const { body } = require('express-validator');

const filmRouter = require('./routes/film');
app.use('/api/film', filmRouter);

const customerRouter = require('./routes/customer');
app.use('/api/customer', customerRouter);

const pesanRouter = require('./routes/pesan');
app.use('/api/pesan', pesanRouter);

const tiketRouter = require('./routes/tiket');
app.use('/api/tiket', tiketRouter);

app.listen(port, () => {
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})