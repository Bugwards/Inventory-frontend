"use client";

import { useEffect, useState } from "react";
import * as api from "../services/api";
import type { AxiosResponse } from "axios";

type TabType = "items" | "groups";

type TabState = {
  data: any[];
  page: number;
  hasNext: boolean;
  query: string;
  sortField: string;
  sortOrder: string;
};

const initialState: TabState = {
  data: [],
  page: 0,
  hasNext: true,
  query: "",
  sortField: "",
  sortOrder: "ASC",
};

export default function useItemMaster() {
  const [activeTab, setActiveTab] = useState<TabType>("items");

  const [states, setStates] = useState<Record<TabType, TabState>>({
    items: { ...initialState, sortField: "" },
    groups: { ...initialState, sortField: "name", sortOrder: "ASC" },
  });

  const [groupFilter, setGroupFilterState] = useState("");
  const [activeFilter, setActiveFilterState] = useState("");
  const [groups, setGroups] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);

  const current = states[activeTab];

  const extractContent = (res: any) => {
    const body = res.data;

    return {
      content: body.content || body || [],
      hasNext: body.last === false,
    };
  };

  const loadGroups = async () => {
    try {
      const res = await api.fetchGroups(0);
      const { content } = extractContent(res);
      setGroups(content);
    } catch (error) {
      console.error("Failed to load groups", error);
    }
  };

  const fetchAllItems = async () => {
    let page = 0;
    let allItems: any[] = [];
    let hasMore = true;

    while (hasMore) {
      const res = await api.fetchItems(page);
      const body = res.data;

      const content = body.content || body || [];
      allItems = [...allItems, ...content];

      hasMore = body.last === false;
      page++;
    }

    return allItems;
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const sortCurrentData = (
    list: any[],
    field: string,
    order: string,
    tab: TabType = activeTab
  ) => {
    if (!field) return list;

    return [...list].sort((a, b) => {
      let valueA = "";
      let valueB = "";

      if (tab === "items") {
        if (field === "name") {
          valueA = a.itemName || "";
          valueB = b.itemName || "";
        }

        if (field === "code") {
          valueA = a.itemCode || "";
          valueB = b.itemCode || "";
        }

        if (field === "group") {
          valueA = a.itemGroupName || a.itemGroup?.name || "";
          valueB = b.itemGroupName || b.itemGroup?.name || "";
        }
      }

      if (tab === "groups") {
        if (field === "name") {
          valueA = a.name || "";
          valueB = b.name || "";
        }

        if (field === "code") {
          valueA = a.code || "";
          valueB = b.code || "";
        }
      }

      const result = valueA.localeCompare(valueB);
      return order === "ASC" ? result : -result;
    });
  };

  const filterAndSortItems = (items: any[]) => {
    let result = [...items];

    if (groupFilter) {
      const selectedGroup = groups.find((g: any) => g.code === groupFilter);

      result = result.filter((item: any) => {
        return (
          item.itemGroupCode === groupFilter ||
          item.itemGroup?.code === groupFilter ||
          item.itemGroupName === selectedGroup?.name
        );
      });
    }

    if (activeFilter !== "") {
      const activeValue = activeFilter === "true";
      result = result.filter((item: any) => item.active === activeValue);
    }

    return sortCurrentData(
      result,
      states.items.sortField,
      states.items.sortOrder,
      "items"
    );
  };

  const fetchData = async (
    tab: TabType,
    pageNumber = 0,
    append = false,
    sortField = states[tab].sortField,
    sortOrder = states[tab].sortOrder
  ) => {
    setLoading(true);

    try {
      let res: AxiosResponse<any>;

      if (tab === "items") {
        res = await api.fetchItems(pageNumber);
      } else {
        if (sortField) {
          res = await api.sortGroups(sortField || "name", sortOrder, pageNumber);
        } else {
          res = await api.fetchGroups(pageNumber);
        }
      }

      const { content, hasNext } = extractContent(res);

      setStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          data: append ? [...prev[tab].data, ...content] : content,
          page: pageNumber,
          hasNext,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (states[activeTab].data.length === 0) {
      fetchData(activeTab, 0, false);
    }
  }, [activeTab]);

  const retrieveData = async () => {
    const query = current.query.trim().toLowerCase();
    setLoading(true);

    try {
      if (activeTab === "groups") {
        let result: any[] = [];

        if (query) {
          try {
            const codeRes = await api.searchGroupByCode(query);
            result = codeRes.data ? [codeRes.data] : [];
          } catch {
            const nameRes = await api.searchGroupsByName(query);
            result = nameRes.data.content || nameRes.data || [];
          }

          result = sortCurrentData(
            result,
            current.sortField || "name",
            current.sortOrder,
            "groups"
          );

          setStates((prev) => ({
            ...prev,
            groups: {
              ...prev.groups,
              data: result,
              page: 0,
              hasNext: false,
            },
          }));

          return;
        }

        const res = await api.sortGroups(
          current.sortField || "name",
          current.sortOrder,
          0
        );

        const { content, hasNext } = extractContent(res);

        setStates((prev) => ({
          ...prev,
          groups: {
            ...prev.groups,
            data: content,
            page: 0,
            hasNext,
          },
        }));

        return;
      }

      if (activeTab === "items") {
        let result: any[] = await fetchAllItems();

        if (query) {
          result = result.filter((item: any) => {
            return (
              item.itemCode?.toLowerCase().includes(query) ||
              item.itemName?.toLowerCase().includes(query)
            );
          });
        }

        result = filterAndSortItems(result);

        setStates((prev) => ({
          ...prev,
          items: {
            ...prev.items,
            data: result,
            page: 0,
            hasNext: false,
          },
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !current.hasNext || current.query) return;
    await fetchData(activeTab, current.page + 1, true);
  };

  const clearFilters = async () => {
    const tab = activeTab;

    setGroupFilterState("");
    setActiveFilterState("");

    setStates((prev) => ({
      ...prev,
      [tab]: {
        ...initialState,
        sortField: tab === "groups" ? "name" : "",
        sortOrder: "ASC",
      },
    }));

    await fetchData(tab, 0, false, tab === "groups" ? "name" : "", "ASC");
  };

  const refreshData = async () => {
    await clearFilters();
    await loadGroups();
  };

  const setQuery = (value: string) => {
    setStates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        query: value,
      },
    }));
  };

  const setSortField = (value: string) => {
    setStates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sortField: value,
      },
    }));
  };

  const setSortOrder = (value: string) => {
    setStates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sortOrder: value,
      },
    }));
  };

  const setGroupFilter = (value: string) => {
    setGroupFilterState(value);
  };

  const setActiveFilter = (value: string) => {
    setActiveFilterState(value);
  };

  return {
    activeTab,
    setActiveTab,

    data: current.data,

    query: current.query,
    setQuery,

    sortField: current.sortField,
    setSortField,

    sortOrder: current.sortOrder,
    setSortOrder,

    groupFilter,
    setGroupFilter,

    activeFilter,
    setActiveFilter,

    groups,

    retrieveData,
    clearFilters,
    refreshData,
    loadMore,

    hasNext: current.hasNext,
    loading,

    openItemModal,
    setOpenItemModal,
    openGroupModal,
    setOpenGroupModal,
  };
}