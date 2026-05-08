"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  getIssueItemDetails,
  searchIssueItemsByKeyword,
} from "../services/api";
import {
  GrnWiseStockDto,
  IssueItem,
  IssuingItemResponse,
  ItemSearchResponse,
  SelectedGrnIssue,
} from "@/types/stockIssue";

interface Props {
  onClose: () => void;
  onAddItem: (item: IssueItem) => void;
}

type GrnRowState = GrnWiseStockDto & {
  selected: boolean;
  issuedQuantity: number;
};

export default function AddIssueItemModal({ onClose, onAddItem }: Props) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ItemSearchResponse[]>([]);
  const [selectedResultCode, setSelectedResultCode] = useState("");
  const [selectedItem, setSelectedItem] = useState<IssuingItemResponse | null>(
    null
  );
  const [grnRows, setGrnRows] = useState<GrnRowState[]>([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  const selectedIssueQuantity = useMemo(() => {
    return grnRows
      .filter((row) => row.selected)
      .reduce((total, row) => total + Number(row.issuedQuantity || 0), 0);
  }, [grnRows]);

  const handleSearch = async () => {
    setError("");
    setSelectedItem(null);
    setSelectedResultCode("");
    setGrnRows([]);

    if (!keyword.trim()) {
      setError("Keyword is mandatory.");
      return;
    }

    try {
      setLoadingSearch(true);
      const data = await searchIssueItemsByKeyword(keyword.trim());
      setResults(data);

      if (data.length === 0) {
        setError("No active items found for this keyword.");
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to search items."
      );
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectItem = async () => {
    setError("");

    if (!selectedResultCode) {
      setError("Please select an item from the results section.");
      return;
    }

    try {
      setLoadingDetails(true);
      const data = await getIssueItemDetails(selectedResultCode);
      setSelectedItem(data);

      const availableGrns = (data.grnStockList || [])
        .filter((grn) => Number(grn.currentQty) > 0)
        .map((grn) => ({
          ...grn,
          selected: false,
          issuedQuantity: 0,
        }));

      setGrnRows(availableGrns);

      if (availableGrns.length === 0) {
        setError("No GRN stock with current quantity available for this item.");
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to load selected item details."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateGrnSelection = (grnNumber: string, selected: boolean) => {
    setGrnRows((prev) =>
      prev.map((row) =>
        row.grnNumber === grnNumber
          ? {
              ...row,
              selected,
              issuedQuantity: selected ? row.issuedQuantity : 0,
            }
          : row
      )
    );
  };

  const updateIssueQuantity = (grnNumber: string, value: string) => {
    const quantity = Number(value);

    setGrnRows((prev) =>
      prev.map((row) =>
        row.grnNumber === grnNumber
          ? {
              ...row,
              issuedQuantity: Number.isNaN(quantity) ? 0 : quantity,
              selected: quantity > 0 ? true : row.selected,
            }
          : row
      )
    );
  };

  const validateIssueQuantity = () => {
    if (!selectedItem) {
      return "Please select an item first.";
    }

    const selectedRows = grnRows.filter((row) => row.selected);

    if (selectedRows.length === 0) {
      return "Please select at least one GRN stock record.";
    }

    for (const row of selectedRows) {
      if (!row.issuedQuantity || row.issuedQuantity <= 0) {
        return `Issue Qty is mandatory for selected GRN ${row.grnNumber}.`;
      }

      if (row.issuedQuantity > row.currentQty) {
        return `Issue Qty cannot be greater than Current Qty for GRN ${row.grnNumber}.`;
      }
    }

    return "";
  };

  const handleUpdateIssueQuantity = () => {
    setError("");

    const validationError = validateIssueQuantity();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
  };

  const handleAddItem = () => {
    setError("");

    const validationError = validateIssueQuantity();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedItem) {
      setError("Please select an item first.");
      return;
    }

    const selectedGrns: SelectedGrnIssue[] = grnRows
      .filter((row) => row.selected)
      .map((row) => ({
        grnNumber: row.grnNumber,
        grnDate: row.grnDate,
        unitOfMeasurement: row.unitOfMeasurement,
        currentQty: row.currentQty,
        unitPrice: row.unitPrice,
        issuedQuantity: row.issuedQuantity,
      }));

    const issueItem: IssueItem = {
      itemGroupName: selectedItem.itemGroupName,
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.itemName,
      description: selectedItem.itemDescription,
      unitOfMeasurement: selectedGrns[0]?.unitOfMeasurement || "",
      totalIssuedQuantity: selectedIssueQuantity,
      grnItems: selectedGrns,
    };

    onAddItem(issueItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          
          <h2 className="bg-gradient-to-r from-slate-700 via-teal-700 to-emerald-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
  Add Issue Item
</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-500">
            Keyword <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-3">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Enter item keyword"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-600"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loadingSearch}
              className="flex min-w-28 items-center justify-center gap-2 rounded-md border border-slate-300 bg-teal-700 px-4 py-2 text-sm text-white-700 font-semibold hover:bg-teal-500 hover:text-slate-700 disabled:opacity-60"
            >
              <Search size={16} />
              {loadingSearch ? "Searching" : "Search"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-600">
            Available Items at{" "}
            <span className="font-bold text-blue-700">Current Location</span>
          </p>

          <div className="h-40 overflow-y-auto rounded-md border border-slate-300 bg-slate-50">
            {results.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No items searched
              </div>
            ) : (
              results.map((item) => (
                <button
                  key={item.itemCode}
                  type="button"
                  onClick={() => setSelectedResultCode(item.itemCode)}
                  className={`grid w-full grid-cols-[160px_1fr] gap-2 border-b border-slate-200 px-3 py-2 text-left text-sm ${
                    selectedResultCode === item.itemCode
                      ? "bg-blue-200"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-slate-800">
                    {item.itemCode}
                  </span>
                  <span className="text-slate-800">
                    {item.itemName} - {item.description}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSelectItem}
              disabled={loadingDetails}
              className="rounded-md border border-slate-300 bg-teal-700 px-8 py-2 text-sm font-semibold hover:bg-teal-500 hover:text-slate-700 disabled:opacity-60"
            >
              {loadingDetails ? "Selecting..." : "Select"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="border-b border-slate-400 pb-2 text-sm font-bold text-blue-700">
            Selected Item for Issuance
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoBlock label="Item Group" value={selectedItem?.itemGroupName} />
            <InfoBlock label="Item Code" value={selectedItem?.itemCode} />
            <InfoBlock label="Item Name" value={selectedItem?.itemName} />
            <InfoBlock
              label="Item Description"
              value={selectedItem?.itemDescription}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-bold text-slate-900">
            GRN wise available quantity
          </h3>

          <div className="overflow-x-auto rounded-md border border-slate-300">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="border border-slate-300 px-3 py-2 text-left text-slate-800">
                    GRN No
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-left text-slate-800">
                    GRN Date
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-left text-slate-800">
                    Unit
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-right text-slate-800">
                    Current Qty
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-right text-slate-800">
                    Price per Unit
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-right text-slate-800">
                    Issue Qty
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-center text-slate-800">
                    Select
                  </th>
                </tr>
              </thead>

              <tbody>
                {grnRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="h-32 border border-slate-300 text-center text-slate-500"
                    >
                      No GRN stock available
                    </td>
                  </tr>
                ) : (
                  grnRows.map((row) => (
                    <tr key={row.grnNumber} className="bg-slate-50">
                      <td className="border border-slate-300 px-3 py-2 text-slate-700">
                        {row.grnNumber}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-slate-700">
                        {row.grnDate}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-slate-700">
                        {row.unitOfMeasurement}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right text-slate-700">
                        {row.currentQty}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right text-slate-700">
                        {row.unitPrice?.toFixed?.(2) ?? row.unitPrice}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-slate-700">
                        <input
                          type="number"
                          min={0}
                          max={row.currentQty}
                          value={row.issuedQuantity}
                          onChange={(e) =>
                            updateIssueQuantity(row.grnNumber, e.target.value)
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1 text-right outline-none focus:border-teal-600"
                        />
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={(e) =>
                            updateGrnSelection(row.grnNumber, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleUpdateIssueQuantity}
              className="rounded-md border border-slate-300 bg-teal-700 px-8 py-2 text-sm font-semibold hover:bg-teal-600 hover:text-slate-700"
            >
              Update Issue Quantity
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-400">
            Selected Issue Quantity
          </p>
          <p className="text-xl font-bold text-slate-900">
            {selectedIssueQuantity}{" "}
            {selectedItem && grnRows[0]?.unitOfMeasurement
              ? grnRows[0].unitOfMeasurement
              : ""}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-md bg-amber-500 px-8 py-2 text-sm font-bold text-white shadow hover:bg-amber-600"
          >
            Add Item
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-teal-700 px-8 py-2 text-sm font-semibold hover:bg-teal-600 hover:text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 min-h-6 text-sm font-bold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}