import { api } from "@/lib/axios";

const API = "/api/grn";


// ================= GET ALL GRNs =================
export const getGRNs = async () => {
  const res = await api.get(API);

  console.log("RAW BACKEND:", res.data);

  if (Array.isArray(res.data)) return res.data;

  if (Array.isArray(res.data.content)) return res.data.content;

  return [];
};


// ================= GET BY ID =================
export const getGRNById = async (id: number) => {
  const res = await api.get(`${API}/${id}`);
  return res.data;
};


// ================= CREATE =================
export const createGRN = async (data: any) => {
  const res = await api.post(API, data);
  return res.data;
};


// ================= UPDATE =================
export const updateGRN = async (
  id: number,
  data: any
) => {
  const res = await api.put(`${API}/${id}`, data);
  return res.data;
};


// ================= APPROVE =================
export const approveGRN = async (id: number) => {
  const res = await api.put(`${API}/approve/${id}`);
  return res.data;
};


// ================= CANCEL =================
export const cancelGRN = async (
  id: number,
  reason: string
) => {
  const res = await api.put(
    `${API}/cancel/${id}?reason=${reason}`
  );

  return res.data;
};