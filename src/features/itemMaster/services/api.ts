import { api } from "@/lib/axios";

// Type definitions
interface ItemData {
  [key: string]: any;
}

interface GroupData {
  [key: string]: any;
}

// ================= ITEMS ================= 

export const createItem = (data: ItemData) =>
  api.post("/items/createItem", data);

export const fetchItems = (page = 0) =>
  api.get(`/items/all?page=${page}`);

export const fetchAllItems = async (): Promise<Record<string, unknown>[]> => {
  let page = 0;
  let allItems: Record<string, unknown>[] = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetchItems(page);
    const body = res.data;
    const content = Array.isArray(body) ? body : body?.content || [];
    allItems = [...allItems, ...content];
    hasMore = Boolean(body && typeof body === "object" && body.last === false);
    page++;
  }

  return allItems;
};

export const searchItems = (name: string) =>
  api.get(`/items/name/${name}`);

export const searchItemByCode = (code: string) =>
  api.get(`/items/code/${code}`);

export const sortItems = (field: string, order: string, page = 0) => {
  if (field === "name") {
    return api.get(`/items/sortByItemName?page=${page}&sortBy=${order}`);
  }

  if (field === "code") {
    return api.get(`/items/sortByItemCode?page=${page}&sortBy=${order}`);
  }

  if (field === "group") {
    return api.get(`/items/sortByItemGroup?page=${page}&sortBy=${order}`);
  }

  return fetchItems(page);
};

export const getItemRecord = (itemCode: string) =>
  api.get("/items/getItemRecord", {
    params: { itemCode },
  });

export const updateItem = (itemCode: string, data: ItemData) =>
  api.put(`/items/${itemCode}`, data);

//================= GROUPS ================= 

export const createGroup = (data: GroupData) =>
  api.post("/item-groups/createGroup", data);

export const fetchGroups = (page = 0) =>
  api.get(`/item-groups/allGroups?page=${page}`);



export const searchGroupByCode = (code: string) =>
  api.get(`/item-groups/code/${code}`);

export const searchGroupsByName = (name: string) =>
  api.get(`/item-groups/name/${name}`);

export const sortGroups = (field: string, order: string, page = 0) => {
  if (field === "name") {
    return api.get(`/item-groups/sortByGroupName?page=${page}&sortBy=${order}`);
  }

  if (field === "code") {
    return api.get(`/item-groups/sortByGroupCode?page=${page}&sortBy=${order}`);
  }

  return fetchGroups(page);
};

export const getItemGroupRecord = (code: string) =>
  api.get("/item-groups/getItemGroupRecord", {
    params: { code },
  });

export const updateItemGroup = (code: string, data: GroupData) =>
  api.put(`/item-groups/${code}`, data);

export const fetchAllGroups = async (): Promise<Record<string, unknown>[]> => {
  let page = 0;
  let allGroups: Record<string, unknown>[] = [];

  while (true) {
    const res = await fetchGroups(page);
    const body = res.data;

    const content = Array.isArray(body)
      ? body
      : body?.content || [];

    allGroups = [...allGroups, ...content];

    // If this page contains fewer than 5 groups,
    // we've reached the last page.
    if (content.length < 5) {
      break;
    }

    page++;
  }

  return allGroups;
};

//================= BIN CARD ================

export const searchBinItems = (itemName: string) =>
  api.get("/binCard/search", {
    params: { itemName },
  });

export const getBinCardSummary = (itemCode: string) =>
  api.get(`/binCard/${itemCode}`);