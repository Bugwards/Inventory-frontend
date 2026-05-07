"use client";

export default function Tabs({ activeTab, setActiveTab }: any) {
  return (
    <div className="grid grid-cols-2 bg-white border gap-1 p-2 rounded-2xl w-full">
      <button
        onClick={() => setActiveTab("items")}
        className={`font-bold py-3 rounded-xl transition ${
          activeTab === "items"
            ? "bg-[#953002] text-white shadow"
            : "text-[#953002] hover:bg-white"
        }`}
      >
        Items
      </button>

      <button
        onClick={() => setActiveTab("groups")}
        className={`font-bold py-3 rounded-xl transition ${
          activeTab === "groups"
            ? "bg-[#953002] text-white shadow"
            : "text-[#953002] hover:bg-white"
        }`}
      >
        Item Groups
      </button>
    </div>
  );
}