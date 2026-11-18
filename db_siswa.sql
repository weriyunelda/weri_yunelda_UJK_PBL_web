--
-- PostgreSQL database dump
--

\restrict nBfb0NJU7Gn5c6PYw4JO4WdaR79BEnWEVszcwlifbmefrVExRnzdkd0SXb0sk7o

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-18 11:31:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16545)
-- Name: siswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siswa (
    kode_siswa character varying(20) NOT NULL,
    nama_siswa character varying(100) NOT NULL,
    alamat_siswa text NOT NULL,
    tgl_siswa date,
    jurusan_siswa character varying(100)
);


ALTER TABLE public.siswa OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 16545)
-- Dependencies: 219
-- Data for Name: siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) FROM stdin;
S001	Ananda Adilla Fitri	Jakarta	2007-10-15	IPS
S002	Weri Yunelda	Padang	2006-01-10	IPA
S003	Paramadina Mulya	Jakarta	2006-02-10	IPS
S004	Riri Fauzia Haris	Bekasi	2006-04-10	IPA
S005	Ratmawati	Palembang	2005-03-30	IPA
\.


--
-- TOC entry 4856 (class 2606 OID 16554)
-- Name: siswa siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siswa
    ADD CONSTRAINT siswa_pkey PRIMARY KEY (kode_siswa);


-- Completed on 2026-11-18 11:31:37

--
-- PostgreSQL database dump complete
--

\unrestrict nBfb0NJU7Gn5c6PYw4JO4WdaR79BEnWEVszcwlifbmefrVExRnzdkd0SXb0sk7o

