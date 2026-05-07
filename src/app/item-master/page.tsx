"use client";

import { useState } from "react";

import Tabs from "@/features/itemMaster/components/Tabs";
import SearchBar from "@/features/itemMaster/components/SearchBar";
import ItemsTable from "@/features/itemMaster/components/ItemsTable";
import GroupsTable from "@/features/itemMaster/components/GroupsTable";

import AddItemModal from "@/features/itemMaster/components/AddItemModal";
import AddGroupModal from "@/features/itemMaster/components/AddGroupModal";
import ItemDetailsModal from "@/features/itemMaster/components/ItemDetailsModal";
import UpdateItemModal from "@/features/itemMaster/components/UpdateItemModal";
import GroupDetailsModal from "@/features/itemMaster/components/GroupDetailsModal"
import UpdateGroupModal from "@/features/itemMaster/components/UpdateGroupModal";

import useItemMaster from "@/features/itemMaster/hooks/useItemMaster";
import * as api from "@/features/itemMaster/services/api";

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openItemDetailsModal, setOpenItemDetailsModal] = useState(false);
  const [openUpdateItemModal, setOpenUpdateItemModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [openGroupDetailsModal, setOpenGroupDetailsModal] = useState(false);
  const [openUpdateGroupModal, setOpenUpdateGroupModal] = useState(false);

  const {
    activeTab,
    setActiveTab,
    data,
    query,
    setQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    retrieveData,
    clearFilters,
    refreshData,
    loadMore,
    hasNext,
    loading,
    openItemModal,
    setOpenItemModal,
    openGroupModal,
    setOpenGroupModal,
    groupFilter,
    setGroupFilter,
    activeFilter,
    setActiveFilter,
    groups,
  } = useItemMaster();

  const handleItemClick = async (itemCode: string) => {
    try {
      const res = await api.getItemRecord(itemCode);
      setSelectedItem(res.data);
      setOpenItemDetailsModal(true);
    } catch (error) {
      console.error("Failed to load item details", error);
    }
  };

  const handleGroupClick = async (code: string) => {
  try {
    const res = await api.getItemGroupRecord(code);

    setSelectedGroup({
      code,
      ...res.data,
    });

    setOpenGroupDetailsModal(true);
  } catch (error) {
    console.error("Failed to load group details", error);
  }
};

  return (
    <div className="min-h-screen p-6 space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#953002]">
          Item Master
        </h1>

        {activeTab === "items" ? (
          <button
            onClick={() => setOpenItemModal(true)}
            className="bg-blue-700 text-white px-5 py-2 rounded-xl"
          >
            + Create New Item
          </button>
        ) : (
          <button
            onClick={() => setOpenGroupModal(true)}
            className="bg-blue-700 text-white px-5 py-2 rounded-xl"
          >
            + Create New Item Group
          </button>
        )}
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <SearchBar
        activeTab={activeTab}
        query={query}
        setQuery={setQuery}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        groups={groups}
        onRetrieve={retrieveData}
        onClearFilters={clearFilters}
      />

      {activeTab === "items" ? (
        <ItemsTable data={data} onItemClick={handleItemClick} />
      ) : (
        <GroupsTable data={data} onGroupClick={handleGroupClick}/>
      )}

      {!query && (
        <div className="h-16 flex justify-center items-center">
          {loading && <span className="text-gray-500">Loading...</span>}

          {!loading && hasNext && (
            <button
              onClick={loadMore}
              className="bg-[#953002] text-white px-5 py-2 rounded-xl"
            >
              Load More
            </button>
          )}

          {!loading && !hasNext && (
            <span className="text-gray-400">No more data</span>
          )}
        </div>
      )}

      <AddItemModal
        open={openItemModal}
        setOpen={setOpenItemModal}
        onSuccess={refreshData}
      />

      <AddGroupModal
        open={openGroupModal}
        setOpen={setOpenGroupModal}
        onSuccess={refreshData}
      />

      <ItemDetailsModal
        open={openItemDetailsModal}
        item={selectedItem}
        onClose={() => setOpenItemDetailsModal(false)}
        onUpdate={() => {
          setOpenItemDetailsModal(false);
          setOpenUpdateItemModal(true);
        }}
      />

      <UpdateItemModal
        open={openUpdateItemModal}
        item={selectedItem}
        onClose={() => setOpenUpdateItemModal(false)}
        onSuccess={async () => {
          setOpenUpdateItemModal(false);
          setSelectedItem(null);
          await refreshData();
        }}
      />

      <GroupDetailsModal
        open={openGroupDetailsModal}
        group={selectedGroup}
        onClose={() => setOpenGroupDetailsModal(false)}
        onUpdate={() => {
          setOpenGroupDetailsModal(false);
          setOpenUpdateGroupModal(true);
        }}
      />

      <UpdateGroupModal
        open={openUpdateGroupModal}
        group={selectedGroup}
        onClose={() => setOpenUpdateGroupModal(false)}
        onSuccess={async () => {
          setOpenUpdateGroupModal(false);
          setSelectedGroup(null);
          await refreshData();
        }}
      />
    </div>
  );
}