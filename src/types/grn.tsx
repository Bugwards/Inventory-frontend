export type GRNStatus = "UNAPPROVED" | "APPROVED" | "CANCELLED";

export type GRNItem = {
  id: number;
  name: string;
  qty: number;
  price: number;
};

export type GRN = {
  id?: number;
  grnNo?: string;
  date: string;
  supplier: string;
  poNumber: string;
  location: string;
  comment?: string;
  status: GRNStatus;
  items: GRNItem[];
};