export type Location =
  | "HEAD_OFFICE"
  | "KALUTARA"
  | "KANDY"
  | "GALLE"
  | "GAMPAHA"
  | "ANURADHAPURA";

export type ReceiptStatus =
  | "APPROVED"
  | "UNAPPROVED"
  | "CANCELLED"
  | "TRANSFERRED";

export interface StockTransferListResponse {
  transferNo: string;
  transferDate: string;
  fromLocation: Location;
  toLocation: Location;
  status: ReceiptStatus;
  approvedDate: string | null;
}

export interface StockReceiptItemGrn {
  grnNo: string;
  grnDate: string;
  transferredQty: number;
  receivedQty: number;
}

export interface StockReceiptItem {
  itemGroup: string;
  itemCode: string;
  itemName: string;
  description: string;
  unitOfMeasurement: string;
  transferredQty: number;
  receivedQty: number;
  mismatchReason?: string;
  stockReceiptItemGrn: StockReceiptItemGrn[];
}

export interface StockReceiptRequest {
  date: string;
  fromLocation: Location;
  reciptLocation?: Location;
  receiptLocation?: Location;
  transferNo: string;
  comment: string;
  stockReceiptItems: StockReceiptItem[];
}

export interface StockReceiptListResponse {
  receiptNo: string;
  receiptDate: string;
  transferNo: string;
  fromLocation: Location;
  receiptLocation: Location;
  status: ReceiptStatus;
  approvedDate: string | null;
}