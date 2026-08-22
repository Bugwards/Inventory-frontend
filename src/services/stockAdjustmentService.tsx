import { api } from "@/lib/axios";


const API="/api/stock-adjustment";

const STOCK_VIEW_API="/api/stock-view";



// ================= STOCK VIEW =================

export const getStockView = async (location?: string) => {
  try {
    let page = 0;
    let allStocks: Record<string, unknown>[] = [];
    let hasMore = true;

    while (hasMore) {
      const params: Record<string, unknown> = { page };
      if (location) params.location = location;

      const res = await api.get(STOCK_VIEW_API, { params });
      const body = res.data;

      if (Array.isArray(body)) {
        return body;
      }

      const content = body?.content || [];
      allStocks = [...allStocks, ...content];

      hasMore = Boolean(body && typeof body === "object" && body.last === false);
      page++;

      if (!body || typeof body !== "object" || !("last" in body)) {
        hasMore = false;
      }
    }

    return allStocks;
  } catch (err: unknown) {
    const error = err as { response?: unknown; message?: string };
    console.error("STOCK VIEW ERROR:", error.response || error.message);
    return [];
  }
};




// ================= CREATE =================

export const createStockAdjustment = async(data:any)=>{

 const res = await api.post(
 API,
 data
 );

 return res.data;

};


export const saveAdjustment=createStockAdjustment;




// ================= GET ALL =================

export const getAdjustments = async()=>{

 try{

 const res=await api.get(API);

 return Array.isArray(res.data)
 ? res.data
 : [];

 }
 catch(err:any){

 console.error(
 "GET ERROR:",
 err.response || err.message
 );

 return [];

 }

};




// ================= SEARCH =================

export const searchStockAdjustments = async(
 params:any
)=>{

 const res = await api.get(
 API,
 {
  params
 }
 );


 return Array.isArray(res.data)
 ? res.data
 : [];

};




// ================= GET BY ID =================

export const getAdjustmentById = async(
 id:number
)=>{

 const res = await api.get(
 `${API}/${id}`
 );

 return res.data;

};