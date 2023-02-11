import { useAtom } from "jotai";

import { editAppModalStore } from "../../../stores/editAppModalStore";
import { appDataStore } from "../../../stores/appDataStore";

export default function AppRowComponent({ aidn, name, callback, appchain }) {
  const [editState, setEditState] = useAtom(editAppModalStore);
  const [appData, setAppData] = useAtom(appDataStore);

  const modifyEditAppModalState = (event) => {
    event.preventDefault();

    // modifies the global state of the edit application modal
    // changes the modal to open and adds app data based on current app
    setEditState(true);
    setAppData({ aidn, name, callback, appchain });
  };

  return (
    <>
      <tr key={aidn}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {aidn}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {callback}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {appchain}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <span className="pr-4">
            <button
              className="inline-flex items-center justify-center text-sm font-medium text-indigo-700 shadow-sm hover:text-indigo-400 sm:w-auto"
              onClick={modifyEditAppModalState}
            >
              Edit
            </button>
          </span>
          <span>
            <button className="inline-flex items-center justify-center text-sm font-medium text-indigo-700 shadow-sm hover:text-indigo-400 sm:w-auto">
              View
            </button>
          </span>
        </td>
      </tr>
    </>
  );
}
