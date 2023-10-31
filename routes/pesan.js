const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

// Menampilkan semua pesan
router.get('/', (req, res) => {
    connection.query('SELECT * FROM pesan order by id_pesan desc', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data pesan',
                data: rows
            });
        }
    });
});

// Menambahkan pesan baru
router.post('/store', [
    body('id_customer').notEmpty(),
    body('tanggal_pemesanan').notEmpty(),
    body('total_harga').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    const data = {
        id_customer: req.body.id_customer,
        tanggal_pemesanan: req.body.tanggal_pemesanan,
        total_harga: req.body.total_harga,
    };
    connection.query('INSERT INTO pesan SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
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

// Menampilkan detail pesan berdasarkan ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM pesan WHERE id_pesan = ?', id, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
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
                message: 'data pesan',
                data: rows[0]
            });
        }
    });
});

// Mengupdate data pesan berdasarkan ID
router.patch('/update/:id', [
    body('id_customer').notEmpty(),
    body('tanggal_pemesanan').notEmpty(),
    body('total_harga').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const id = req.params.id;
    const { id_customer, tanggal_pemesanan, total_harga } = req.body;
    const data = {
        id_customer,
        tanggal_pemesanan,
        total_harga,
    };
    connection.query('UPDATE pesan SET ? WHERE id_pesan = ?', [data, id], (err) => {
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

// Menghapus pesan berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM pesan WHERE id_pesan = ?', id, (err) => {
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
