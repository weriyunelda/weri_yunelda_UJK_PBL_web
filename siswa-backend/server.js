
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const siswaRoutes = require("./routes/siswaRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Halaman utama API
app.get("/", (req, res) => {
    res.json({
        message: "API Data Siswa berhasil berjalan"
    });
});

// Routing data siswa
app.use("/api/siswa", siswaRoutes);

// Menjalankan server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
