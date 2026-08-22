"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import Tabs from "@/features/itemMaster/components/Tabs";
import SearchBar from "@/features/itemMaster/components/SearchBar";
import ItemsTable from "@/features/itemMaster/components/ItemsTable";
import GroupsTable from "@/features/itemMaster/components/GroupsTable";

import AddItemModal from "@/features/itemMaster/components/AddItemModal";
import AddGroupModal from "@/features/itemMaster/components/AddGroupModal";
import ItemDetailsModal from "@/features/itemMaster/components/ItemDetailsModal";
import UpdateItemModal from "@/features/itemMaster/components/UpdateItemModal";
import GroupDetailsModal from "@/features/itemMaster/components/GroupDetailsModal";
import UpdateGroupModal from "@/features/itemMaster/components/UpdateGroupModal";

import useItemMaster from "@/features/itemMaster/hooks/useItemMaster";
import * as api from "@/features/itemMaster/services/api";

import { canManageItemMaster } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function Page() {
  // ============================================================
  // USER ROLE
  // ============================================================

  const [role, setRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRoleLoaded(true);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      setRole(decoded.role || "");
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    } finally {
      setRoleLoaded(true);
    }
  }, []);

  // ============================================================
  // PERMISSION
  // ============================================================

  const canManageItems = canManageItemMaster(role);

  // ============================================================
  // ITEM STATE
  // ============================================================

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [openItemDetailsModal, setOpenItemDetailsModal] =
    useState(false);

  const [openUpdateItemModal, setOpenUpdateItemModal] =
    useState(false);

  // ============================================================
  // GROUP STATE
  // ============================================================

  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [openGroupDetailsModal, setOpenGroupDetailsModal] =
    useState(false);

  const [openUpdateGroupModal, setOpenUpdateGroupModal] =
    useState(false);

  // ============================================================
  // ITEM MASTER HOOK
  // ============================================================

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

  // ============================================================
  // ITEM CLICK
  // ============================================================

  const handleItemClick = async (itemCode: string) => {
    try {
      const res = await api.getItemRecord(itemCode);

      setSelectedItem(res.data);
      setOpenItemDetailsModal(true);
    } catch (error) {
      console.error("Failed to load item details", error);

      toast.error("Failed to load item details.");
    }
  };

  // ============================================================
  // GROUP CLICK
  // ============================================================

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

      toast.error("Failed to load item group details.");
    }
  };

  // ============================================================
  // UPDATE ITEM
  // ============================================================

  const handleUpdateItem = () => {
    if (!canManageItems) {
      toast.error(
        "You are not authorized to perform this action."
      );

      return;
    }

    setOpenItemDetailsModal(false);
    setOpenUpdateItemModal(true);
  };

  // ============================================================
  // UPDATE GROUP
  // ============================================================

  const handleUpdateGroup = () => {
    if (!canManageItems) {
      toast.error(
        "You are not authorized to perform this action."
      );

      return;
    }

    setOpenGroupDetailsModal(false);
    setOpenUpdateGroupModal(true);
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen space-y-6 bg-zinc-50/50 p-6">

      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-primary">
            Item Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage inventory items and item groups
          </p>
        </div>

        {/* ==================================================== */}
        {/* CREATE BUTTONS                                       */}
        {/* ==================================================== */}

        {roleLoaded && canManageItems && (
          <>
            {activeTab === "items" ? (
              <button
                type="button"
                onClick={() => setOpenItemModal(true)}
                className="
                  cursor-pointer
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  duration-200
                  hover:bg-orange-800
                  hover:shadow-lg
                  active:scale-95
                "
              >
                + Create New Item
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpenGroupModal(true)}
                className="
                  cursor-pointer
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  duration-200
                  hover:bg-orange-800
                  hover:shadow-lg
                  active:scale-95
                "
              >
                + Create New Item Group
              </button>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* READ ONLY INDICATOR                                  */}
        {/* ==================================================== */}

        {roleLoaded && !canManageItems && (
          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-500
              shadow-sm
            "
          >
            <span className="h-2 w-2 rounded-full bg-gray-400" />

            View Only
          </div>
        )}

      </div>

      {/* ====================================================== */}
      {/* TABS                                                   */}
      {/* ====================================================== */}

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ====================================================== */}
      {/* SEARCH / FILTER                                        */}
      {/* ====================================================== */}

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

      {/* ====================================================== */}
      {/* TABLE                                                  */}
      {/* ====================================================== */}

      {activeTab === "items" ? (
        <ItemsTable
          data={data}
          onItemClick={handleItemClick}
        />
      ) : (
        <GroupsTable
          data={data}
          onGroupClick={handleGroupClick}
        />
      )}

      {/* ====================================================== */}
      {/* LOAD MORE                                              */}
      {/* ====================================================== */}

      {!query && (
        <div className="flex h-16 items-center justify-center">

          {loading && (
            <span className="text-sm text-gray-500">
              Loading...
            </span>
          )}

          {!loading && hasNext && (
            <button
              type="button"
              onClick={loadMore}
              className="
                cursor-pointer
                rounded-xl
                bg-primary
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-200
                hover:bg-orange-800
                hover:shadow-lg
                active:scale-95
              "
            >
              Load More
            </button>
          )}

          {!loading && !hasNext && (
            <span className="text-sm text-gray-400">
              No more data
            </span>
          )}

        </div>
      )}

      {/* ====================================================== */}
      {/* ADD ITEM                                               */}
      {/* ====================================================== */}

      {canManageItems && (
        <AddItemModal
          open={openItemModal}
          setOpen={setOpenItemModal}
          onSuccess={refreshData}
          groups={groups}
        />
      )}

      {/* ====================================================== */}
      {/* ADD GROUP                                              */}
      {/* ====================================================== */}

      {canManageItems && (
        <AddGroupModal
          open={openGroupModal}
          setOpen={setOpenGroupModal}
          onSuccess={refreshData}
        />
      )}

      {/* ====================================================== */}
      {/* ITEM DETAILS                                           */}
      {/* ====================================================== */}

      <ItemDetailsModal
        open={openItemDetailsModal}
        item={selectedItem}
        canUpdate={canManageItems}
        onClose={() => {
          setOpenItemDetailsModal(false);
          setSelectedItem(null);
        }}
        onUpdate={handleUpdateItem}
      />

      {/* ====================================================== */}
      {/* UPDATE ITEM                                            */}
      {/* ====================================================== */}

      {canManageItems && (
        <UpdateItemModal
          open={openUpdateItemModal}
          item={selectedItem}
          onClose={() => {
            setOpenUpdateItemModal(false);
          }}
          onSuccess={async () => {
            setOpenUpdateItemModal(false);
            setSelectedItem(null);

            await refreshData();
          }}
        />
      )}

      {/* ====================================================== */}
      {/* GROUP DETAILS                                          */}
      {/* ====================================================== */}

      <GroupDetailsModal
        open={openGroupDetailsModal}
        group={selectedGroup}
        canUpdate={canManageItems}
        onClose={() => {
          setOpenGroupDetailsModal(false);
          setSelectedGroup(null);
        }}
        onUpdate={handleUpdateGroup}
      />

      {/* ====================================================== */}
      {/* UPDATE GROUP                                           */}
      {/* ====================================================== */}

      {canManageItems && (
        <UpdateGroupModal
          open={openUpdateGroupModal}
          group={selectedGroup}
          onClose={() => {
            setOpenUpdateGroupModal(false);
          }}
          onSuccess={async () => {
            setOpenUpdateGroupModal(false);
            setSelectedGroup(null);

            await refreshData();
          }}
        />
      )}

    </div>
  );
}