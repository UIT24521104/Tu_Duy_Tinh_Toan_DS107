import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getShops() {
  const response = await api.get("/shops");
  return response.data;
}

export async function getProducts(shopid) {
  const response = await api.get("/products", {
    params: { shopid },
  });
  return response.data;
}

export async function getDashboard(payload) {
  const response = await api.post("/dashboard", payload);
  return response.data;
}

export async function predict(payload) {
  const response = await api.post("/predict", payload);
  return response.data;
}

export default api;
