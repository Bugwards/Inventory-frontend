import api from "@/lib/axios";
import {
  ItemSearchResponse,
  SelectedItem,
  StockTransferRequest,
  StockTransferListResponse,
} from "@/types/stockTransfer";

export const searchItems = async (keyword: string) => {
  const res = await api.get<ItemSearchResponse[]>("/stocktransfer/getItem", {
    params: { keyword},
  });

  return res.data;
};

export const getItemDetails = async (itemCode: string) => {
  const res = await api.get<SelectedItem>("/stocktransfer/itemDetails", {
    params: { itemCode },
  });

  return res.data;
};

export const getCurrentUserLocation = async () => {
  const res = await api.get("/stocktransfer/currentUserLocation");
  return res.data;
};

export const saveStockTransfer = async (data: StockTransferRequest) => {
  const res = await api.post("/stocktransfer", data);
  return res.data;
};

export const getStockTransferList = async (page: number = 0) => {
  const res = await api.get<StockTransferListResponse[]>(
    "/stocktransfer/getAllRecords",
    {
      params: { page },
    }
  );

  return res.data;
};

export const getSelectedStockTransferRecord = async (transferNo: string) => {
  const res = await api.get<StockTransferRequest>(
    "/stocktransfer/stockTransferRecord",
    {
      params: { transferNo },
    }
  );

  return res.data;
};

export const updateStockTransferRecord = async (
  transferNo: string,
  data: StockTransferRequest
) => {
  const res = await api.put(
    `/stocktransfer/updateStockTransferRecord/${transferNo}`,
    data
  );

  return res.data;
};

export const approveStockTransfer = async (transferNo: string) => {
  const res = await api.put(
    `/stocktransfer/approveStockTransfer/${transferNo}`
  );

  return res.data;
};

export const cancelStockTransfer = async (transferNo: string) => {
  const res = await api.put(
    `/stocktransfer/canselStockTransfer/${transferNo}`
  );

  return res.data;
};

export const saveCancelReason = async (
  transferNo: string,
  reason: string
) => {
  const res = await api.put("/stocktransfer/getCanselMsg/", reason, {
    params: { stockTransferNo: transferNo },
    headers: {
      "Content-Type": "text/plain",
    },
  });

  return res.data;
};