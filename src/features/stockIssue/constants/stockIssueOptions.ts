import { Department } from "@/types/stockIssue";

export const departmentOptions: { label: string; value: Department }[] = [
  {
    label: "IT",
    value: "IT_DEPT",
  },
  {
    label: "HR",
    value: "HR_DEPT",
  },
  {
    label: "Finance",
    value: "FINANCE_DEPT",
  },
];

export const stockIssueTabs = [
  {
    label: "Stock Issue Entry",
    value: "entry",
  },
  {
    label: "Stock Issue List",
    value: "list",
  },
] as const;