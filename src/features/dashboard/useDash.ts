import { api } from "@/lib/axios";

export interface StockLevel {
    itemCode: string;
    itemName: string;
    currentStock: number;
    minimumLevel: number;
    reorderLevel: number;
    status: "LOW" | "REORDER" | "HEALTHY";
}

export interface MovementTrend {
    month: string;
    inward: number;
    outward: number;
}

export interface RecentTransaction {
    date: string;
    type: string;
    reference: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    balance: number;
    remarks: string;
}

export interface MovementSummary {
    type: string;
    quantity: number;
    transactionCount: number;
}

export interface DashboardData {

    totalItems: number;

    totalStock: number;

    lowStockItems: number;

    fastMovingItems: number;

    slowMovingItems: number;

    totalInward: number;

    totalOutward: number;

    stockHealthPercentage: number;

    stockLevels: StockLevel[];

    movementTrend: MovementTrend[];

    recentTransactions: RecentTransaction[];

    movementSummary: MovementSummary[];
}

export const getDashboardData =
    async (): Promise<DashboardData> => {

        const response =
            await api.get<DashboardData>(
                "/api/dashboard/analytics"
            );

        return response.data;
    };