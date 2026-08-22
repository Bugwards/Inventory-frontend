export interface ItemSearchResponse {
  itemCode: string;
  itemName: string;
  description: string;
}

export interface GrnDetail {
  grnNumber: string;
  grnDate: string;
  unit: string;
  currentQuantity: number;
  pricePerUnit: number;
  transferQty: number;
  selected: boolean;
}

export interface SelectedItem {
  itemGroupName: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  grnWiseItemDetails: GrnDetail[];
}

export interface TransferGrnItem {
  grnNumber: string;
  grnDate: string;
  currentQuantity: number;
  TransferQty: number;
}

export interface TransferItem {
  itemGroup: string;
  itemCode: string;
  itemName: string;
  description: string;
  unitOfMeasurement: string;
  transferQty: number;
  tranferredgrnitem: TransferGrnItem[];
}

export interface StockTransferRequest {
  date: string;
  toLocation: string;
  requestRef: string;
  comment: string;
  items: TransferItem[];

  // Approval audit information
  approvedBy: string | null;
  approvedAt: string | null;

  // Cancellation audit information
  cancelledBy: string | null;
  cancelledAt: string | null;
}

export interface StockTransferListResponse {
  transferNo: string;
  transferDate: string;
  fromLocation: string;
  toLocation: string;
  status: string;
  approvedDate: string | null;
}

export interface OpenedStockTransfer {
  transferNo: string;
  status: string;
  data: StockTransferRequest;
}