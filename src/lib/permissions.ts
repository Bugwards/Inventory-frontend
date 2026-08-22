// ============================================================
// ITEM MASTER
// ============================================================

export const ITEM_MASTER_EDIT_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canManageItemMaster(role: string): boolean {
    return ITEM_MASTER_EDIT_ROLES.includes(
        role as (typeof ITEM_MASTER_EDIT_ROLES)[number]
    );
}


// ============================================================
// GRN
// ============================================================

export const GRN_EDIT_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canManageGRN(role: string): boolean {
    return GRN_EDIT_ROLES.includes(
        role as (typeof GRN_EDIT_ROLES)[number]
    );
}


// ============================================================
// GRN APPROVE
// ============================================================

export const GRN_APPROVE_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canApproveGRN(role: string): boolean {
    return GRN_APPROVE_ROLES.includes(
        role as (typeof GRN_APPROVE_ROLES)[number]
    );
}


// ============================================================
// GRN CANCEL
// ============================================================

export const GRN_CANCEL_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canCancelGRN(role: string): boolean {
    return GRN_CANCEL_ROLES.includes(
        role as (typeof GRN_CANCEL_ROLES)[number]
    );
}

// ============================================================
// OPENING STOCK
// ============================================================

// Create / Update Opening Stock
export const OPENING_STOCK_EDIT_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canManageOpeningStock(role: string): boolean {
    return OPENING_STOCK_EDIT_ROLES.includes(
        role as (typeof OPENING_STOCK_EDIT_ROLES)[number]
    );
}


// Approve / Cancel Opening Stock
export const OPENING_STOCK_APPROVAL_ROLES = [
    "SYSTEM_ADMIN",
    "APPROVING_AUTHORITY",
] as const;

export function canApproveOpeningStock(role: string): boolean {
    return OPENING_STOCK_APPROVAL_ROLES.includes(
        role as (typeof OPENING_STOCK_APPROVAL_ROLES)[number]
    );
}

// ============================================================
// STOCK ADJUSTMENT
// ============================================================

// Create Stock Adjustment
export const STOCK_ADJUSTMENT_EDIT_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
] as const;

export function canManageStockAdjustment(role: string): boolean {
    return STOCK_ADJUSTMENT_EDIT_ROLES.includes(
        role as (typeof STOCK_ADJUSTMENT_EDIT_ROLES)[number]
    );
}

// ============================================================
// STOCK TRANSFER
// ============================================================

// Users who can create / edit Stock Transfers
export const STOCK_TRANSFER_EDIT_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
    "APPROVING_AUTHORITY",
] as const;

export function canManageStockTransfer(role: string): boolean {
    return STOCK_TRANSFER_EDIT_ROLES.includes(
        role as (typeof STOCK_TRANSFER_EDIT_ROLES)[number]
    );
}

// Users who can approve Stock Transfers
export const STOCK_TRANSFER_APPROVE_ROLES = [
    "SYSTEM_ADMIN",
    "APPROVING_AUTHORITY",
] as const;

export function canApproveStockTransfer(role: string): boolean {
    return STOCK_TRANSFER_APPROVE_ROLES.includes(
        role as (typeof STOCK_TRANSFER_APPROVE_ROLES)[number]
    );
}

// Users who can cancel Stock Transfers
export const STOCK_TRANSFER_CANCEL_ROLES = [
    "SYSTEM_ADMIN",
    "STORE_STAFF",
    "APPROVING_AUTHORITY",
] as const;

export function canCancelStockTransfer(role: string): boolean {
    return STOCK_TRANSFER_CANCEL_ROLES.includes(
        role as (typeof STOCK_TRANSFER_CANCEL_ROLES)[number]
    );
}