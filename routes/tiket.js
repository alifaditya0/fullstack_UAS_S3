const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

// Menampilkan semua tiket
router.get('/', (req, res) => {
    connection.query('SELECT * FROM tiket order by id_tiket desc', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data tiket',
                data: rows
            });
        }
    });
});

// Menambahkan tiket baru
router.post('/store', [
    body('id_film').notEmpty(),
    body('id_pesan').notEmpty(),
    body('nomor_kursi').notEmpty(),
    body('harga').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    const data = {
        id_film: req.body.id_film,
        id_pesan: req.body.id_pesan,
        nomor_kursi: req.body.nomor_kursi,
        harga: req.body.harga,
    };
    connection.query('INSERT INTO tiket SET ?', data, function (err, rows) {
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

// Menampilkan detail tiket berdasarkan ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM tiket WHERE id_tiket = ?', id, (err, rows) => {
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
                message: 'data tiket',
                data: rows[0]
            });
        }
    });
});

// Mengupdate data tiket berdasarkan ID
router.patch('/update/:id', [
    body('id_film').notEmpty(),
    body('id_pesan').notEmpty(),
    body('nomor_kursi').notEmpty(),
    body('harga').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const id = req.params.id;
    const { id_film, id_pesan, nomor_kursi, harga } = req.body;
    const data = {
        id_film,
        id_pesan,
        nomor_kursi,
        harga,
    };
    connection.query('UPDATE tiket SET ? WHERE id_tiket = ?', [data, id], (err) => {
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

// Menghapus tiket berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM tiket WHERE id_tiket = ?', id, (err) => {
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
