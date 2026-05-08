import { FileText, List } from "lucide-react";

interface Props {
  activeTab: "entry" | "list";
  onChange: (tab: "entry" | "list") => void;
}

export default function StockIssueTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg bg-white shadow-md">
      <button
        type="button"
        onClick={() => onChange("entry")}
        className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition ${
          activeTab === "entry"
            ? "bg-teal-700 text-white"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        <FileText size={15} />
        Stock Issue Entry
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition ${
          activeTab === "list"
            ? "bg-teal-700 text-white"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        <List size={15} />
        Stock Issue List
      </button>
    </div>
  );
}