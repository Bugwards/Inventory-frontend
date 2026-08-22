import { api } from "@/lib/axios";

const API = "/api/opening-stock";


// GET ALL
export const getOpeningStocks = async (params?: any) => {

  const res = await api.get(API, {
    params
  });

  console.log("RAW BACKEND:", res.data);


  if (Array.isArray(res.data))
    return res.data;


  if (Array.isArray(res.data.content))
    return res.data.content;


  return [];
};



// CREATE
export const createOpeningStock = async (data:any)=>{

  const res = await api.post(API,data);

  return res.data;
};



// UPDATE
export const updateOpeningStock = async(
 id:number,
 data:any
)=>{

 const res = await api.put(
 `${API}/${id}`,
 data
 );

 return res.data;

};



// APPROVE
export const approveOpeningStock = async(id:number)=>{

 const res = await api.put(
 `${API}/approve/${id}`
 );

 return res.data;

};



// CANCEL
export const cancelOpeningStock = async(
 id:number,
 reason:string
)=>{

 const res = await api.put(
 `${API}/cancel/${id}?reason=${reason}`
 );

 return res.data;

};



// GET BY ID
export const getOpeningStockById = async(id:number)=>{

 const res = await api.get(
 `${API}/${id}`
 );

 return res.data;

};