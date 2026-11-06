import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:5000/api",
//     headers: {
//         "Content-Type": "application/json"
//     }
// });

const API = axios.create({
  baseURL: "http://192.168.90.113:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT to protected API requests
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default API;