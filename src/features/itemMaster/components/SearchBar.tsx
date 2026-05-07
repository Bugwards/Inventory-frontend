"use client";

export default function SearchBar({
  activeTab,
  query,
  setQuery,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  groupFilter,
  setGroupFilter,
  activeFilter,
  setActiveFilter,
  groups = [],
  onRetrieve,
  onClearFilters,
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="text-sm font-medium text-gray-600">
            {activeTab === "items"
              ? "Search (Item Code / Item Name)"
              : "Search (Item Group Code / Item Group Name)"}
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "items"
                ? "Search items..."
                : "Search item groups..."
            }
            className="px-4 py-2 rounded-xl outline-none border border-[#953002] focus:ring-2 focus:ring-orange-800"
          />
        </div>

        {activeTab === "items" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Item Group
            </label>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border border-[#953002] px-4 py-2 rounded-xl  focus:ring-2 focus:ring-orange-800"
            >
              <option value="">All Groups</option>

              {groups.map((group: any) => (
                <option key={group.code} value={group.code}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "items" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Active Status
            </label>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="border border-[#953002] px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-800 "
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Sort Field
          </label>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-[#953002] px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-800"
          >
            {activeTab === "groups" ? (
              <>
                <option value="name">Item Group Name</option>
                <option value="code">Item Group Code</option>
              </>
            ) : (
              <>
                <option value="">None</option>
                <option value="name">Item Name</option>
                <option value="code">Item Code</option>
                <option value="group">Item Group</option>
              </>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Sort Order
          </label>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-[#953002] px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-800"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClearFilters}
          className="bg-gray-300 px-5 py-2 rounded-xl hover:bg-gray-600 hover:text-white hover:border"
        >
          Clear Filters
        </button>

        <button
          onClick={onRetrieve}
          className="bg-amber-500 text-black px-6 py-2 rounded-xl hover:bg-amber-600  hover:border "
        >
          Retrieve
        </button>
      </div>
    </div>
  );
}