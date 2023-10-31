const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', function (req, res) {
    connection.query('SELECT * from film order by id_film desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data film',
                data: rows
            });
        }
    });
});

router.post('/store',
    upload.single('gambar'),
    [
        body('judul').notEmpty(),
        body('genre').notEmpty(),
        body('durasi').notEmpty(),
        body('tanggal_rilis').notEmpty(),
        body('harga_tiket').notEmpty(),
    ], (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error.array()
            });
        }

        const gambar = req.file ? req.file.filename : null;

        let Data = {
            judul: req.body.judul,
            genre: req.body.genre,
            durasi: req.body.durasi,
            tanggal_rilis: req.body.tanggal_rilis,
            harga_tiket: req.body.harga_tiket,
            gambar: gambar
        };

        connection.query('insert into film set ? ', Data, function (err, rows) {
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

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from film where id_film = ${id}`, function (err, rows) {
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
                message: 'data film',
                data: rows[0]
            });
        }
    });
});

router.patch('/update/:id', upload.single('gambar'), [
    body('judul').notEmpty(),
    body('genre').notEmpty(),
    body('durasi').notEmpty(),
    body('tanggal_rilis').notEmpty(),
    body('harga_tiket').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let gambar = req.file ? req.file.filename : null;
    connection.query(`select * from film where id_film = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server error'
            });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            });
        }
        const gambarLama = rows[0].gambar;

        if (gambarLama && gambar) {
            const pathGambar = path.join(__dirname, '../public/images', gambarLama);
            fs.unlinkSync(pathGambar);
        }

        let data = {
            judul: req.body.judul,
            genre: req.body.genre,
            durasi: req.body.durasi,
            tanggal_rilis: req.body.tanggal_rilis,
            harga_tiket: req.body.harga_tiket
        };
        if (gambar) {
            data.gambar = gambar;
        }

        connection.query(`update film set ? where id_film = ${id}`, data, function (err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'server error'
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'update'
                });
            }
        });
    });
});

router.delete('/delete/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from film where id_film = ${id}`, function (err, rows) {
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
        }
        const gambarLama = rows[0].gambar;

        if (gambarLama) {
            const pathGambar = path.join(__dirname, '../public/images', gambarLama);
            fs.unlinkSync(pathGambar);
        }

        connection.query(`delete from film where id_film = ${id}`, function (err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'server error'
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Data dihapus'
                });
            }
        });
    });
});

module.exports = router;
