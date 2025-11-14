// lib/axiosML.ts
import axios from "axios";

const axiosML = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ML_BASEURL, // ML API
});

export default axiosML;
