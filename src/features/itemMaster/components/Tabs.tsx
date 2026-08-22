"use client";

export default function Tabs({ activeTab, setActiveTab }: any) {
  return (
    <div className="grid grid-cols-2 bg-white border border-gray-200 gap-2 p-2 rounded-2xl w-full shadow-sm">
      <button
        onClick={() => setActiveTab("items")}
        className={`font-semibold py-3 rounded-xl transition cursor-pointer text-sm ${
          activeTab === "items"
            ? "bg-primary text-white shadow-md font-bold"
            : "text-primary hover:bg-orange-50/50"
        }`}
      >
        Items
      </button>

      <button
        onClick={() => setActiveTab("groups")}
        className={`font-semibold py-3 rounded-xl transition cursor-pointer text-sm ${
          activeTab === "groups"
            ? "bg-primary text-white shadow-md font-bold"
            : "text-primary hover:bg-orange-50/50"
        }`}
      >
        Item Groups
      </button>
    </div>
  );
}