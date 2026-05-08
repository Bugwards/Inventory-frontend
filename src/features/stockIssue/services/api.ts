import axiosInstance from "@/lib/axios";
import {
  IssuingItemResponse,
  ItemSearchResponse,
  StockIssueRequest,
} from "@/types/stockIssue";

import { StockIssueFilterRequest, StockIssueResponse , StockIssueDetailResponse } from "@/types/stockIssue";

export const getCurrentStockIssueLocation = async (): Promise<string> => {
  const response = await axiosInstance.get("/api/stockIssue");
  return response.data;
};

export const searchIssueItemsByKeyword = async (
  keyword: string
): Promise<ItemSearchResponse[]> => {
  const response = await axiosInstance.get(
    `/api/stockIssue/getItemList/${encodeURIComponent(keyword)}`
  );

  return response.data;
};

export const getIssueItemDetails = async (
  itemCode: string
): Promise<IssuingItemResponse> => {
  const response = await axiosInstance.get(
    `/api/stockIssue/getItem/${encodeURIComponent(itemCode)}/details`
  );

  return response.data;
};

export const createStockIssue = async (
  payload: StockIssueRequest,
  file?: File | null
): Promise<string> => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], {
      type: "application/json",
    })
  );

  if (file) {
    formData.append("file", file);
  }

  const response = await axiosInstance.post(
    "/api/stockIssue/create/issue",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getIssueRecord = async (
  issueNo: string
): Promise<StockIssueRequest> => {

  const response = await axiosInstance.get(
    `/api/stockIssue/issueRecord`,
    {
      params: {
        issueNo,
      },
    }
  );

  return response.data;
};


export const filterStockIssues = async (
  payload: StockIssueFilterRequest
): Promise<StockIssueResponse[]> => {

  const response = await axiosInstance.post(
    "/api/stockIssue/filter/issueReocrds",
    payload
  );

  return response.data;
};


export const getSelectedIssueRecord = async (
  issueNo: string
): Promise<StockIssueDetailResponse> => {
  const response = await axiosInstance.get("/api/stockIssue/issueRecord", {
    params: {
      issueNo,
    },
  });

  return response.data;
};

export const updateStockIssueRecord = async (
  issueNo: string,
  payload: StockIssueRequest
): Promise<void> => {
  await axiosInstance.put(
    `/api/stockIssue/updateStockIssueReocrd/${encodeURIComponent(issueNo)}`,
    payload
  );
};

export const approveStockIssue = async (
  issueNo: string
): Promise<string> => {
  const response = await axiosInstance.put(
    `/api/stockIssue/approveRecord/${encodeURIComponent(issueNo)}`
  );

  return response.data;
};

export const cancelStockIssue = async (
  issueNo: string
): Promise<string> => {
  const response = await axiosInstance.put(
    `/api/stockIssue/cancelRecord/${encodeURIComponent(issueNo)}`
  );

  return response.data;
};

export const saveCancelReason = async (
  issueNo: string,
  cancelMessage: string
): Promise<string> => {
  const response = await axiosInstance.put(
    "/api/stockIssue/cancelRecord/checkbox",
    cancelMessage,
    {
      params: {
        issueNo,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  return response.data;
};