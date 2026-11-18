
import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";


async function fetchSiswa() {
    const response = await api.get("/siswa");
    return response.data;
}


function App() {
    // STATE DATA
    const [siswa, setSiswa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");

    // STATE FORM
    const initialForm = {
        kode_siswa: "",
        nama_siswa: "",
        alamat_siswa: "",
        tgl_siswa: "",
        jurusan_siswa: ""
    };

    const [form, setForm] = useState(initialForm);
    const [editing, setEditing] = useState(false);

    // =====================================
    // READ: MENGAMBIL DATA SISWA
    // =====================================

   
const getSiswa = async () => {
    try {
        setLoading(true);
        setError("");

        const data = await fetchSiswa();

        setSiswa(data);

    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Gagal mengambil data siswa. Pastikan backend aktif."
        );
    } finally {
        setLoading(false);
    }
};


    // Mengambil data ketika aplikasi pertama kali dibuka
    
useEffect(() => {
    let ignore = false;

    fetchSiswa()
        .then((data) => {
            if (!ignore) {
                setSiswa(data);
            }
        })
        .catch((err) => {
            if (!ignore) {
                setError(
                    err.response?.data?.message ||
                    "Gagal mengambil data siswa. Pastikan backend aktif."
                );
            }
        })
        .finally(() => {
            if (!ignore) {
                setLoading(false);
            }
        });

    return () => {
        ignore = true;
    };
}, []);


    // =====================================
    // MENGATUR INPUT FORM
    // =====================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================
    // CREATE DAN UPDATE
    // =====================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setNotification("");

            if (editing) {
                // UPDATE DATA
                await api.put(
                    `/siswa/${encodeURIComponent(form.kode_siswa)}`,
                    {
                        nama_siswa: form.nama_siswa.trim(),
                        alamat_siswa: form.alamat_siswa.trim(),
                        tgl_siswa: form.tgl_siswa || null,
                        jurusan_siswa: form.jurusan_siswa.trim() || null
                    }
                );

                setNotification("Data siswa berhasil diperbarui!");

            } else {
                // CREATE DATA
                await api.post("/siswa", {
                    kode_siswa: form.kode_siswa.trim(),
                    nama_siswa: form.nama_siswa.trim(),
                    alamat_siswa: form.alamat_siswa.trim(),
                    tgl_siswa: form.tgl_siswa || null,
                    jurusan_siswa: form.jurusan_siswa.trim() || null
                });

                setNotification("Data siswa berhasil ditambahkan!");
            }

            // RESET FORM
            setForm(initialForm);
            setEditing(false);

            // REFRESH DATA
            await getSiswa();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Terjadi kesalahan saat menyimpan data."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================
    // EDIT DATA SISWA
    // =====================================

    const handleEdit = (item) => {
        setForm({
            kode_siswa: item.kode_siswa,
            nama_siswa: item.nama_siswa,
            alamat_siswa: item.alamat_siswa,
            tgl_siswa: item.tgl_siswa
                ? String(item.tgl_siswa).slice(0, 10)
                : "",
            jurusan_siswa: item.jurusan_siswa || ""
        });

        setEditing(true);
        setError("");
        setNotification("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================
    // DELETE DATA SISWA
    // =====================================

    const handleDelete = async (kode) => {
        const konfirmasi = window.confirm(
            `Apakah kamu yakin ingin menghapus siswa ${kode}?`
        );

        if (!konfirmasi) return;

        try {
            setError("");
            setNotification("");

            await api.delete(
                `/siswa/${encodeURIComponent(kode)}`
            );

            setNotification("Data siswa berhasil dihapus!");

            await getSiswa();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Gagal menghapus data siswa."
            );
        }
    };

    // =====================================
    // RESET FORM
    // =====================================

    const handleCancel = () => {
        setForm(initialForm);
        setEditing(false);
        setError("");
        setNotification("");
    };

    // =====================================
    // TAMPILAN APLIKASI
    // =====================================

    return (
        <div className="app-container">

            {/* HEADER */}
            <header className="header">

                <div className="brand">
                    <div className="brand-icon">
                        <span>DS</span>
                    </div>

                    <div>
                        <h1>Data Siswa</h1>
                        <p>Student Management System</p>
                    </div>
                </div>

                <div className="connection-status">
                    <span className="status-dot"></span>
                    Sistem Aktif
                </div>

            </header>

            <main className="main-content">

                {/* WELCOME */}
                <section className="welcome-section">
                    <div>
                        <span className="welcome-label">
                            STUDENT MANAGEMENT
                        </span>

                        <h2>Dashboard Data Siswa</h2>

                        <p>
                            Kelola informasi dan data siswa
                            dengan mudah melalui sistem ini.
                        </p>
                    </div>
                </section>

                {/* NOTIFIKASI */}
                {notification && (
                    <div className="alert alert-success">
                        <span>✓</span>
                        {notification}
                        <button
                            type="button"
                            onClick={() => setNotification("")}
                            aria-label="Tutup notifikasi"
                        >
                            ×
                        </button>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <span>!</span>
                        {error}
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Tutup pesan error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* STATISTIK */}
                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <span>♙</span>
                        </div>

                        <div>
                            <p>Total Siswa</p>
                            <h3>{siswa.length}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <span>✓</span>
                        </div>

                        <div>
                            <p>Status Sistem</p>
                            <h3 className="system-status">
                                Online
                            </h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <span>▤</span>
                        </div>

                        <div>
                            <p>Data Tersimpan</p>
                            <h3>{siswa.length} Data</h3>
                        </div>
                    </div>

                </section>

                {/* FORM TAMBAH DAN EDIT */}
                <section className="content-card">

                    <div className="card-heading">
                        <div>
                            <h3>
                                {editing
                                    ? "Edit Data Siswa"
                                    : "Tambah Data Siswa"}
                            </h3>

                            <p>
                                {editing
                                    ? "Perbarui informasi siswa."
                                    : "Masukkan informasi siswa baru."}
                            </p>
                        </div>

                        <span className="card-number">
                            {editing ? "EDIT" : "FORM"}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* KODE SISWA */}
                            <div className="form-group">
                                <label htmlFor="kode_siswa">
                                    Kode Siswa
                                </label>

                                <input
                                    id="kode_siswa"
                                    type="text"
                                    name="kode_siswa"
                                    value={form.kode_siswa}
                                    onChange={handleChange}
                                    placeholder="Contoh: S001"
                                    disabled={editing || saving}
                                    required
                                />
                            </div>

                            {/* NAMA SISWA */}
                            <div className="form-group">
                                <label htmlFor="nama_siswa">
                                    Nama Siswa
                                </label>

                                <input
                                    id="nama_siswa"
                                    type="text"
                                    name="nama_siswa"
                                    value={form.nama_siswa}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                    disabled={saving}
                                    required
                                />
                            </div>

                            {/* ALAMAT SISWA */}
                            <div className="form-group">
                                <label htmlFor="alamat_siswa">
                                    Alamat Siswa
                                </label>

                                <input
                                    id="alamat_siswa"
                                    type="text"
                                    name="alamat_siswa"
                                    value={form.alamat_siswa}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat siswa"
                                    disabled={saving}
                                    required
                                />
                            </div>

                            {/* TANGGAL SISWA */}
                            <div className="form-group">
                                <label htmlFor="tgl_siswa">
                                    Tanggal Siswa
                                </label>

                                <input
                                    id="tgl_siswa"
                                    type="date"
                                    name="tgl_siswa"
                                    value={form.tgl_siswa}
                                    onChange={handleChange}
                                    disabled={saving}
                                />
                            </div>

                            {/* JURUSAN SISWA */}
                            <div className="form-group full-width">
                                <label htmlFor="jurusan_siswa">
                                    Jurusan Siswa
                                </label>

                                <input
                                    id="jurusan_siswa"
                                    type="text"
                                    name="jurusan_siswa"
                                    value={form.jurusan_siswa}
                                    onChange={handleChange}
                                    placeholder="Masukkan jurusan siswa"
                                    disabled={saving}
                                />
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Menyimpan..."
                                    : editing
                                        ? "Simpan Perubahan"
                                        : "Tambah Siswa"}
                            </button>

                            {editing && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Batal
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* TABEL DATA SISWA */}
                <section className="content-card">

                    <div className="card-heading">

                        <div>
                            <h3>Daftar Data Siswa</h3>

                            <p>
                                Berikut seluruh data siswa
                                yang tersimpan dalam database.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn-refresh"
                            onClick={getSiswa}
                            disabled={loading}
                        >
                            ↻ {loading ? "Memuat..." : "Refresh Data"}
                        </button>

                    </div>

                    <div className="table-container">

                        <table className="student-table">

                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode Siswa</th>
                                    <th>Nama Siswa</th>
                                    <th>Alamat Siswa</th>
                                    <th>Tanggal Siswa</th>
                                    <th>Jurusan Siswa</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading && siswa.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-data"
                                        >
                                            Memuat data siswa...
                                        </td>
                                    </tr>
                                ) : siswa.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-data"
                                        >
                                            Belum ada data siswa.
                                        </td>
                                    </tr>
                                ) : (
                                    siswa.map((item, index) => (
                                        <tr key={item.kode_siswa}>

                                            <td>{index + 1}</td>

                                            <td>
                                                <span className="student-code">
                                                    {item.kode_siswa}
                                                </span>
                                            </td>

                                            <td className="student-name">
                                                {item.nama_siswa}
                                            </td>

                                            <td>
                                                {item.alamat_siswa}
                                            </td>

                                            <td>
                                                {item.tgl_siswa
                                                    ? String(item.tgl_siswa).slice(0, 10)
                                                    : "-"}
                                            </td>

                                            <td>
                                                {item.jurusan_siswa || "-"}
                                            </td>

                                            <td>
                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="btn-edit"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.kode_siswa
                                                            )
                                                        }
                                                    >
                                                        Hapus
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="table-footer">
                        Menampilkan {siswa.length} data siswa
                    </div>

                </section>

            </main>

            {/* FOOTER */}
            <footer className="footer">
                <p>
                    Student Management System © 2026
                </p>

                <p>
                    React.js | Express.js | PostgreSQL
                </p>
            </footer>

        </div>
    );
}

export default App;
