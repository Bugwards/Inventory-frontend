import { useState } from "react";
import {
  createStockReceipt,
  populateTransferItems,
  updateStockReceipt,
} from "../services/api";
import {
  StockReceiptItem,
  StockReceiptRequest,
} from "@/types/stockReceipt";

export default function useStockReceipt() {
  const [items, setItems] = useState<StockReceiptItem[]>([]);
  const [locked, setLocked] = useState(false);

  const normalizeItems = (backendItems: any[]): StockReceiptItem[] => {
    return backendItems.map((item) => {
      const grnList =
        item.stockReceiptItemGrn ||
        item.grnItems ||
        item.tranferredgrnitem ||
        item.transferredGrnResponseList ||
        item.grnItemTransferredDtoList ||
        [];

      const normalizedGrnList = grnList.map((grn: any) => {
          const transferredQty =
            grn.transferredQty ||
            grn.transferQty ||
            grn.TransferQty ||
            0;

          return {
            grnNo: grn.grnNo || grn.grnNumber,
            grnDate: grn.grnDate,
            transferredQty,
            receivedQty: grn.receivedQty ?? transferredQty,
          };
        });

      const totalTransferred =
        item.transferredQty ||
        item.transferQty ||
        normalizedGrnList.reduce(
          (sum: number, grn: any) => sum + Number(grn.transferredQty),
          0
        );

      const totalReceived =
        item.receivedQty ??
        normalizedGrnList.reduce(
          (sum: number, grn: any) => sum + Number(grn.receivedQty),
          0
        );

      return {
        itemGroup: item.itemGroup || "",
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description || "",
        unitOfMeasurement: item.unitOfMeasurement || "",
        transferredQty: Number(totalTransferred),
        receivedQty: Number(totalReceived),
        mismatchReason: item.mismatchReason,
        stockReceiptItemGrn: normalizedGrnList,
      };
    });
  };

  const populateItems = async (transferNo: string) => {
    const res = await populateTransferItems(transferNo);

    if (!res.data || res.data.length === 0) {
      alert("No items found for this transfer");
      return;
    }

    setItems(normalizeItems(res.data));
    setLocked(true);
  };

  const loadItemsFromBackend = (backendItems: any[]) => {
    setItems(normalizeItems(backendItems || []));
  };

  const updateItem = (updatedItem: StockReceiptItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.itemCode === updatedItem.itemCode ? updatedItem : item
      )
    );
  };

  const save = async (payload: StockReceiptRequest) => {
    await createStockReceipt(payload);
  };

  const updateReceipt = async (
    receiptNo: string,
    payload: StockReceiptRequest
  ) => {
    await updateStockReceipt(receiptNo, payload);
  };

  const clearItems = () => {
    setItems([]);
    setLocked(false);
  };

  return {
    items,
    locked,
    setLocked,
    populateItems,
    loadItemsFromBackend,
    updateItem,
    save,
    updateReceipt,
    clearItems,
  };
}