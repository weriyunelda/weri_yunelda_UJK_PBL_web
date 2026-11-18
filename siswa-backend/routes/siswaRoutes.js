const express = require("express");
const router = express.Router();
const db = require("../config/db");

// READ - Menampilkan seluruh data siswa
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM siswa ORDER BY kode_siswa ASC"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data siswa",
            error: error.message
        });
    }
});

// READ - Menampilkan siswa berdasarkan kode
router.get("/:kode", async (req, res) => {
    try {
        const { kode } = req.params;

        const result = await db.query(
            "SELECT * FROM siswa WHERE kode_siswa = $1",
            [kode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Data siswa tidak ditemukan"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil detail siswa",
            error: error.message
        });
    }
});

// CREATE - Menambahkan siswa
router.post("/", async (req, res) => {
    try {
        const {
            kode_siswa,
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        if (!kode_siswa || !nama_siswa || !alamat_siswa) {
            return res.status(400).json({
                message: "Kode, nama, dan alamat siswa wajib diisi"
            });
        }

        const result = await db.query(
            `INSERT INTO siswa
            (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                kode_siswa,
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa || null
            ]
        );

        res.status(201).json({
            message: "Data siswa berhasil ditambahkan",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menambahkan data siswa",
            error: error.message
        });
    }
});

// UPDATE - Mengubah data siswa
router.put("/:kode", async (req, res) => {
    try {
        const { kode } = req.params;

        const {
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        if (!nama_siswa || !alamat_siswa) {
            return res.status(400).json({
                message: "Nama dan alamat siswa wajib diisi"
            });
        }

        const result = await db.query(
            `UPDATE siswa
             SET nama_siswa = $1,
                 alamat_siswa = $2,
                 tgl_siswa = $3,
                 jurusan_siswa = $4
             WHERE kode_siswa = $5
             RETURNING *`,
            [
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa || null,
                kode
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Data siswa tidak ditemukan"
            });
        }

        res.json({
            message: "Data siswa berhasil diperbarui",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal memperbarui data siswa",
            error: error.message
        });
    }
});

// DELETE - Menghapus siswa
router.delete("/:kode", async (req, res) => {
    try {
        const { kode } = req.params;

        const result = await db.query(
            "DELETE FROM siswa WHERE kode_siswa = $1 RETURNING *",
            [kode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Data siswa tidak ditemukan"
            });
        }

        res.json({
            message: "Data siswa berhasil dihapus",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus data siswa",
            error: error.message
        });
    }
});

module.exports = router;
