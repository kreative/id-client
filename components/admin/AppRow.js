export default function AppRowComponent({ aidn, name, callback }) {
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
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <span className="pr-4">
            <button
              className="inline-flex items-center justify-center text-sm font-medium text-indigo-700 shadow-sm hover:text-indigo-400 sm:w-auto"
              onClick={(e) => setEditModalState(true)}
            >
              Edit
            </button>
          </span>
          <button
            className="inline-flex items-center justify-center text-sm font-medium text-indigo-700 shadow-sm hover:text-indigo-400 sm:w-auto"
            onClick={(e) => setDeleteModalState(true)}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
