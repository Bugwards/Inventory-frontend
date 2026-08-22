import { api } from "@/lib/axios";


const STOCK_VIEW_API="/api/stock-view";


export const getStockView = async (location?: string) => {
  try {
    let page = 0;
    let allStocks: Record<string, unknown>[] = [];
    let hasMore = true;

    while (hasMore) {
      const params: Record<string, unknown> = { page };
      if (location) params.location = location;

      const res = await api.get(STOCK_VIEW_API, { params });
      const body = res.data;

      if (Array.isArray(body)) {
        return body;
      }

      const content = body?.content || [];
      allStocks = [...allStocks, ...content];

      hasMore = Boolean(body && typeof body === "object" && body.last === false);
      page++;

      if (!body || typeof body !== "object" || !("last" in body)) {
        hasMore = false;
      }
    }

    return allStocks;
  } catch (err: unknown) {
    const error = err as { response?: unknown; message?: string };
    console.error("STOCK VIEW ERROR:", error.response || error.message);
    return [];
  }
};