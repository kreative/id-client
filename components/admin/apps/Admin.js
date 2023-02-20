import React, { useState } from "react";
import { useAtom } from "jotai";

import AppsTableComponent from "./AppsTable";
import CreateApplicationModal from "@/components/modals/CreateApplication";
import EditApplicationModal from "@/components/modals/EditApplication";
import AdminNavbarComponent from "@/components/admin/AdminNavbar";

import { editAppModalStore } from "@/stores/editAppModalStore";
import { accountStore } from "@/stores/accountStore";

export default function AdminComponent() {
  // state for create application modal
  const [modalState, setModalState] = useState(false);

  // global state for edit application modal
  const [editState, setEditState] = useAtom(editAppModalStore);
  const [account] = useAtom(accountStore);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <AdminNavbarComponent />
      <CreateApplicationModal state={modalState} setState={setModalState} />
      <EditApplicationModal state={editState} setState={setEditState} />
      <div className="pt-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Applications for {account.firstName}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all applications including their AIDN, name, and
              callback URL.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              onClick={(e) => setModalState(true)}
            >
              Add application
            </button>
          </div>
        </div>
        <AppsTableComponent />
      </div>
    </div>
  );
}
