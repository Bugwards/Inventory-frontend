export type StockIssueStatus = "UNAPPROVED" | "APPROVED" | "CANCELLED";

export type Department = "IT_DEPT" | "HR_DEPT" | "FINANCE_DEPT";

export interface ItemSearchResponse {
  itemCode: string;
  itemName: string;
  description: string;
}

export interface GrnWiseStockDto {
  grnNumber: string;
  grnDate: string;
  unitOfMeasurement: string;
  currentQty: number;
  unitPrice: number;
}

export interface IssuingItemResponse {
  itemGroupName: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  grnStockList: GrnWiseStockDto[];
}

export interface SelectedGrnIssue {
  grnNumber: string;
  grnDate: string;
  unitOfMeasurement: string;
  currentQty: number;
  unitPrice: number;
  issuedQuantity: number;
}

export interface IssueItem {
  itemGroupName: string;
  itemCode: string;
  itemName: string;
  description: string;
  unitOfMeasurement: string;
  totalIssuedQuantity: number;
  grnItems: SelectedGrnIssue[];
}

export interface StockIssueRequest {
  date: string;
  department: Department;
  requestRef?: string;
  comment?: string;
  items: {
    itemCode: string;
    itemGroupName: string;
    itemName: string;
    description: string;
    unitOfMesuremnet: string;
    totalIssuedQuantity: number;
    grnItems: {
      grnNumber: string;
      grnDate: string;
      currentQuantity: number;
      issuedQuantity: number;
    }[];
  }[];
}

export interface StockIssueListRow {
  issueNo: string;
  issueDate: string;

  location: string;

  department: string;

  status: "UNAPPROVED" | "APPROVED" | "CANCELLED";

  approvedDate?: string | null;
}

export interface StockIssueFilterRequest {
  issueDateFilter?: string;

  fromDate?: string;
  toDate?: string;

  status?: string;

  location?: string;
  department?: string;

  search?: string;

  sortBy?: string;
  sortDirection?: string;
}

export interface StockIssueResponse {
  issueNo: string;
  issueDate: string;
  location: string;
  department: string;
  requestRef?: string;
  status: StockIssueStatus;
}

export interface StockIssueDetail extends StockIssueRequest {
  issueNo?: string;
  status?: StockIssueStatus;
  approvedDate?: string | null;
}

export interface StockIssueDetailResponse extends StockIssueRequest {
  issueNo?: string;
  status?: StockIssueStatus;
}
