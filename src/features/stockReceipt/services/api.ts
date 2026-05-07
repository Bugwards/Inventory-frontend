import api from "@/lib/axios";
import {
  Location,
  StockReceiptListResponse,
  StockReceiptRequest,
  StockTransferListResponse,
} from "@/types/stockReceipt";

export const getCurrentUserLocation = async () => {
  return api.get<Location>("/StockReceipt/currentUserLocation");
};

export const getApprovedTransfers = async (
  page: number,
  fromLocation: Location,
  receiptLocation: Location
) => {
  return api.get<StockTransferListResponse[]>("/StockReceipt/getTransferList", {
    params: {
      page,
      fromLocation,
      receiptLocation,
    },
  });
};

export const populateTransferItems = async (transferNo: string) => {
  return api.get("/StockReceipt/createRecipt/getTransferItems", {
    params: {
      transferNo,
    },
  });
};

export const createStockReceipt = async (data: StockReceiptRequest) => {
  return api.post("/StockReceipt/createRecipt", data);
};

export const getStockReceiptList = async (page: number = 0) => {
  return api.get<StockReceiptListResponse[]>("/StockReceipt/getAllReceipts", {
    params: {
      page,
    },
  });
};

export const getSelectedStockReceipt = async (receiptNo: string) => {
  return api.get<StockReceiptRequest>("/StockReceipt/stockReceiptRecord", {
    params: {
      receiptNo,
    },
  });
};

export const updateStockReceipt = async (
  receiptNo: string,
  data: StockReceiptRequest
) => {
  return api.put("/StockReceipt/receiptUpdate", data, {
    params: {
      receiptNo,
    },
  });
};

export const approveStockReceipt = async (receiptNo: string) => {
  return api.put("/StockReceipt/approveReceipt", null, {
    params: {
      receiptNo,
    },
  });
};

export const cancelStockReceipt = async (receiptNo: string) => {
  return api.put("/StockReceipt/canselReceipt", null, {
    params: {
      receiptNo,
    },
  });
};