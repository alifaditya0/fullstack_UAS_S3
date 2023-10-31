const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM customer order by id_customer desc', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data customer',
                data: rows
            });
        }
    });
});

router.post('/store', [
    body('nama').notEmpty(),
    body('alamat').notEmpty(),
    body('email').notEmpty(),
    body('no_hp').notEmpty(),
    body('id_film').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    const data = {
        nama: req.body.nama,
        alamat: req.body.alamat,
        email: req.body.email,
        no_hp: req.body.no_hp,
        id_film: req.body.id_film,
    };
    connection.query('INSERT INTO customer SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Success',
                data: rows[0]
            });
        }
    });
});


router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM customer WHERE id_customer = ?', id, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server error'
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'data customer',
                data: rows[0]
            });
        }
    });
});

router.patch('/update/:id', [
    body('nama').notEmpty(),
    body('alamat').notEmpty(),
    body('email').notEmpty(),
    body('no_hp').notEmpty(),
    body('id_film').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const id = req.params.id;
    const { nama, alamat, email, no_hp, id_film } = req.body;
    const data = {
        nama,
        alamat,
        email,
        no_hp,
        id_film,
    };
    connection.query('UPDATE customer SET ? WHERE id_customer = ?', [data, id], (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'update'
            });
        }
    });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM customer WHERE id_customer = ?', id, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data dihapus'
            });
        }
    });
});

module.exports = router;
