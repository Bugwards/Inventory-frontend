"use client";

import { useState } from "react";
import * as api from "../../itemMaster/services/api";

export default function useBinCard() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const searchItems = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    const res = await api.searchBinItems(value);
    setSuggestions(res.data);
  };

  const selectItem = async (itemCode: string) => {
    const res = await api.getBinCardSummary(itemCode);
    setSummary(res.data);
  };

  const reset = () => {
    setSummary(null);
    setSuggestions([]);
  };

  return {
    suggestions,
    summary,
    searchItems,
    selectItem,
    setSuggestions,
    reset,
  };
}