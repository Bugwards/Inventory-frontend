"use client";

import { useState } from "react";
import { getItemDetails, searchItems } from "../services/api";
import { useStockTransfer } from "../hooks/useStockTransfer";
import {
  GrnDetail,
  ItemSearchResponse,
  SelectedItem,
  TransferItem,
} from "@/types/stockTransfer";

interface Props {
  onClose: () => void;
}

export default function AddTransferItemModal({ onClose }: Props) {
  const { transferItems, addTransferItem, updateTransferItem } =
    useStockTransfer();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ItemSearchResponse[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [grnList, setGrnList] = useState<GrnDetail[]>([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("Keyword is mandatory");
      return;
    }

    try {
      const data = await searchItems(keyword);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Failed to search items");
    }
  };

  const handleSelectItem = async (itemCode: string) => {
    try {
      const data = await getItemDetails(itemCode);

      const cleanGrnList = data.grnWiseItemDetails
        .filter((grn) => grn.currentQuantity > 0)
        .map((grn) => ({
          ...grn,
          transferQty: 0,
          selected: false,
        }));

      setSelectedItem(data);
      setGrnList(cleanGrnList);
      setSelectedTotal(0);
    } catch (error) {
      console.error(error);
      alert("Failed to load selected item details");
    }
  };

  const handleCheckGrn = (grnNumber: string, checked: boolean) => {
    setGrnList((prev) =>
      prev.map((grn) =>
        grn.grnNumber === grnNumber
          ? { ...grn, selected: checked }
          : grn
      )
    );
  };

  const handleQtyChange = (grnNumber: string, value: string) => {
    const qty = Number(value);

    setGrnList((prev) =>
      prev.map((grn) =>
        grn.grnNumber === grnNumber
          ? { ...grn, transferQty: qty }
          : grn
      )
    );
  };

  const updateTransferQuantity = () => {
    let total = 0;

    for (const grn of grnList) {
      if (grn.selected) {
        if (grn.transferQty <= 0) {
          alert(`Enter valid transfer quantity for GRN ${grn.grnNumber}`);
          return false;
        }

        if (grn.transferQty > grn.currentQuantity) {
          alert(
            `Transfer Qty cannot be greater than Current Qty in GRN ${grn.grnNumber}`
          );
          return false;
        }

        total += grn.transferQty;
      }
    }

    if (total === 0) {
      alert("At least one GRN stock item must be selected");
      return false;
    }

    setSelectedTotal(total);
    return true;
  };

  const handleAddItem = () => {
   if (!selectedItem) {
    alert("Please select an item first");
    return;
   }

   const isValid = updateTransferQuantity();

   if (!isValid) return;

   const selectedGrns = grnList.filter(
     (grn) => grn.selected && grn.transferQty > 0
   );

   const totalQty = selectedGrns.reduce(
     (sum, grn) => sum + grn.transferQty,
     0
   );

   const transferItem: TransferItem = {
     itemGroup: selectedItem.itemGroupName,
     itemCode: selectedItem.itemCode,
     itemName: selectedItem.itemName,
     description: selectedItem.itemDescription,
     unitOfMeasurement: selectedGrns[0]?.unit || "",
     transferQty: totalQty,
     tranferredgrnitem: selectedGrns.map((grn) => ({
       grnNumber: grn.grnNumber,
       grnDate: grn.grnDate,
       currentQuantity: grn.currentQuantity,
       TransferQty: grn.transferQty,
    })),
  };

  const alreadyExists = transferItems.some(
    (item) => item.itemCode === transferItem.itemCode
  );

  if (alreadyExists) {
    updateTransferItem(transferItem);
  } else {
    addTransferItem(transferItem);
  }

  onClose();
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-[900px] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-3xl font-bold text-[#953002]">
          Add Transfer Item
        </h2>

        <div className=" p-3">
          <label className="mb-1 text-black  text-sm font-bold">Keyword</label>

          <div className="flex gap-3">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword "
              className="w-full text-black border px-3 py-2"
            />

            <button
              onClick={handleSearch}
              className="border bg-slate-300 hover:bg-slate-500 px-8 py-2 font-bold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mb-4  p-3">
          <h3 className="mb-2 text-black font-bold">
            Available Items at{" "}
            <span className="text-blue-600">Current Location</span>
          </h3>

          <div className="h-36 overflow-y-auto border">
            {results.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                No items searched yet
              </p>
            ) : (
              results.map((item) => (
                <div
                  key={item.itemCode}
                  onClick={() => handleSelectItem(item.itemCode)}
                  className={`cursor-pointer text-black border-b px-3 py-2 hover:bg-blue-200 ${
                    selectedItem?.itemCode === item.itemCode
                      ? "bg-blue-200"
                      : ""
                  }`}
                >
                  <span className="font-semibold">{item.itemCode}</span>
                  {" - "}
                  {item.itemName}
                  {" - "}
                  {item.description}
                </div>
              ))
            )}
          </div>
        </div>

        <div className=" p-3">
          <h3 className="mb-3 text-lg font-bold text-blue-700">
            Selected Item for Transfer
          </h3>

          <div className="mb-5  p-3">
            {selectedItem ? (
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-slate-600">Item Group</p>
                  <p className="font-semibold text-black">{selectedItem.itemGroupName}</p>
                </div>

                <div>
                  <p className="text-slate-600">Item Code</p>
                  <p className="font-semibold text-black">{selectedItem.itemCode}</p>
                </div>

                <div>
                  <p className="text-slate-600">Item Name</p>
                  <p className="font-semibold text-black">{selectedItem.itemName}</p>
                </div>

                <div>
                  <p className="text-slate-600">Item Description</p>
                  <p className="font-semibold text-black">
                    {selectedItem.itemDescription}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No item selected</p>
            )}
          </div>
          <div className="border-t mt-4" >
          <h3 className="mb-2 text-lg text-black font-bold">
            GRN wise available quantity
          </h3></div>

          <table className="w-full border text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="border text-black bg-[#D0713B] p-2 ">GRN No</th>
                <th className="border text-black bg-[#D0713B] p-2 ">GRN Date</th>
                <th className="border text-black bg-[#D0713B] p-2 ">Unit</th>
                <th className="border text-black bg-[#D0713B] p-2 ">Current Qty</th>
                <th className="border text-black bg-[#D0713B] p-2 ">Price Per Unit</th>
                <th className="border text-black bg-[#D0713B] p-2 ">Transfer Qty</th>
                <th className="border text-black bg-[#D0713B] p-2 ">Select</th>
              </tr>
            </thead>

            <tbody>
              {grnList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    No GRN records
                  </td>
                </tr>
              ) : (
                grnList.map((grn) => (
                  <tr key={grn.grnNumber}>
                    <td className="border text-black p-2">{grn.grnNumber}</td>
                    <td className="border text-black p-2">{grn.grnDate}</td>
                    <td className="border text-black p-2">{grn.unit}</td>
                    <td className="border text-black p-2 text-right">
                      {grn.currentQuantity}
                    </td>
                    <td className="border text-black p-2 text-right">
                      {grn.pricePerUnit}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={grn.transferQty}
                        onChange={(e) =>
                          handleQtyChange(grn.grnNumber, e.target.value)
                        }
                        className="w-full border text-black px-2 py-1 text-right"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={grn.selected}
                        onChange={(e) =>
                          handleCheckGrn(grn.grnNumber, e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-3 text-right">
            <button
              onClick={updateTransferQuantity}
              className="border text-black bg-slate-400 px-6 py-2 font-semibold"
            >
              Update Transfer Quantity
            </button>
          </div>

          <div className="mt-8">
            <p className="text-slate-500">Selected Transfer Quantity</p>
            <p className="text-2xl text-black font-bold">{selectedTotal} Pcs</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleAddItem}
            className="rounded bg-[#953002] hover:bg-[#7a2500] px-8 py-2 font-semibold text-white"
          >
            Add Item
          </button>

          <button
            onClick={onClose}
            className="rounded border text-black bg-slate-300 hover:bg-slate-500 px-8 py-2 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}