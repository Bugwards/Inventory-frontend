import { create } from "zustand";
import {
  OpenedStockTransfer,
  TransferItem,
} from "@/types/stockTransfer";

type ActiveTab = "entry" | "list";

interface StockTransferStore {
  activeTab: ActiveTab;
  transferItems: TransferItem[];
  openedTransfer: OpenedStockTransfer | null;

  setActiveTab: (tab: ActiveTab) => void;
  addTransferItem: (item: TransferItem) => void;
  updateTransferItem: (item: TransferItem) => void;
  deleteTransferItem: (itemCode: string) => void;
  clearTransferItems: () => void;

  setOpenedTransfer: (transfer: OpenedStockTransfer | null) => void;
  setTransferItems: (items: TransferItem[]) => void;
}

export const useStockTransfer = create<StockTransferStore>((set) => ({
  activeTab: "entry",
  transferItems: [],
  openedTransfer: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  addTransferItem: (item) =>
    set((state) => {
      const existingIndex = state.transferItems.findIndex(
        (oldItem) => oldItem.itemCode === item.itemCode
      );

      if (existingIndex !== -1) {
        const updatedItems = [...state.transferItems];

        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          transferQty: item.transferQty,
          tranferredgrnitem: item.tranferredgrnitem,
        };

        return {
          transferItems: updatedItems,
        };
      }

      return {
        transferItems: [...state.transferItems, item],
      };
    }),

  updateTransferItem: (item) =>
    set((state) => ({
      transferItems: state.transferItems.map((oldItem) =>
        oldItem.itemCode === item.itemCode ? item : oldItem
      ),
    })),

  deleteTransferItem: (itemCode) =>
    set((state) => ({
      transferItems: state.transferItems.filter(
        (item) => item.itemCode !== itemCode
      ),
    })),

  clearTransferItems: () => set({ transferItems: [] }),

  setOpenedTransfer: (transfer) => set({ openedTransfer: transfer }),

  setTransferItems: (items) => set({ transferItems: items }),
}));