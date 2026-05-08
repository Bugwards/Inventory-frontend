"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createStockIssue,
  getCurrentStockIssueLocation,
} from "../services/api";
import {
  Department,
  IssueItem,
  StockIssueRequest,
} from "@/types/stockIssue";

const getToday = () => new Date().toISOString().split("T")[0];

export function useStockIssue() {
  const today = useMemo(() => getToday(), []);

  const [issueNo] = useState("New");
  const [date, setDate] = useState(today);
  const [currentLocation, setCurrentLocation] = useState("Loading...");
  const [department, setDepartment] = useState<Department | "">("");
  const [requestRef, setRequestRef] = useState("");
  const [comment, setComment] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [items, setItems] = useState<IssueItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    try {
      const location = await getCurrentStockIssueLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error(error);
      setCurrentLocation("Head Office");
    }
  };

  const addOrReplaceIssueItem = (newItem: IssueItem) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.itemCode === newItem.itemCode);

      if (exists) {
        return prev.map((item) =>
          item.itemCode === newItem.itemCode ? newItem : item
        );
      }

      return [...prev, newItem];
    });
  };

  const deleteIssueItem = (itemCode: string) => {
    setItems((prev) => prev.filter((item) => item.itemCode !== itemCode));
  };

  const resetForm = () => {
    setDate(today);
    setDepartment("");
    setRequestRef("");
    setComment("");
    setDocumentName("");
    setItems([]);
    setError("");
    setSuccessMessage("");
    setDocumentFile(null);

  };

  const validateBeforeSave = () => {
    if (!date) {
      return "Date is mandatory.";
    }

    if (date !== today) {
      return "Date must be today. Past or future dates are not allowed.";
    }

    if (!department) {
      return "Department is mandatory.";
    }

    if (items.length === 0) {
      return "Please add at least one issue item.";
    }

    return "";
  };

  const saveStockIssue = async (): Promise<boolean> => {
  setError("");
  setSuccessMessage("");

  const validationError = validateBeforeSave();

  if (validationError) {
    setError(validationError);
    return false;
  }

  const payload: StockIssueRequest = {
    date,
    department: department as Department,
    requestRef,
    comment,
    items: items.map((item) => ({
      itemCode: item.itemCode,
      itemGroupName: item.itemGroupName,
      itemName: item.itemName,
      description: item.description,
      unitOfMesuremnet: item.unitOfMeasurement,
      totalIssuedQuantity: item.totalIssuedQuantity,
      grnItems: item.grnItems.map((grn) => ({
        grnNumber: grn.grnNumber,
        grnDate: grn.grnDate,
        currentQuantity: grn.currentQty,
        issuedQuantity: grn.issuedQuantity,
      })),
    })),
  };

  try {
    setSaving(true);

    await createStockIssue(payload, documentFile);

    setSuccessMessage("Stock Issue saved successfully.");
    resetForm();

    return true;
  } catch (error: any) {
    console.error(error);

    setError(
      error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to save Stock Issue."
    );

    return false;
  } finally {
    setSaving(false);
  }
};
  
  return {
    today,
    issueNo,
    date,
    setDate,
    currentLocation,
    department,
    setDepartment,
    requestRef,
    setRequestRef,
    comment,
    setComment,
    documentName,
    setDocumentName,
    items,
    addOrReplaceIssueItem,
    deleteIssueItem,
    saveStockIssue,
    saving,
    error,
    successMessage,
    resetForm,
    documentFile,
    setDocumentFile,
  };
}