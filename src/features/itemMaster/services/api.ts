import { api } from "@/lib/axios";

/* ================= ITEMS ================= */

export const createItem = (data: any) =>
  api.post("/items/createItem", data);

export const fetchItems = (page = 0) =>
  api.get(`/items/all?page=${page}`);

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

export const updateItem = (itemCode: string, data: any) =>
  api.put(`/items/${itemCode}`, data);

/* ================= GROUPS ================= */

export const createGroup = (data: any) =>
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

export const updateItemGroup = (code: string, data: any) =>
  api.put(`/item-groups/${code}`, data);

/* ================= BIN CARD ================= */

export const searchBinItems = (itemName: string) =>
  api.get("/binCard/search", {
    params: { itemName },
  });

export const getBinCardSummary = (itemCode: string) =>
  api.get(`/binCard/${itemCode}`);