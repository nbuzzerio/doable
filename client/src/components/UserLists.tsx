import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  deleteList,
  getLists,
  updateList,
  createList,
  ListResponse,
} from "../services/listService";

interface Props {
  userId: string;
}

const UserLists: React.FC<Props> = ({ userId }) => {
  const [lists, setLists] = useState<ListResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedList, setSelectedList] = useState<ListResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editListName, setEditListName] = useState<string>("");
  const [editListType, setEditListType] = useState<string>("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLists(userId);
      setLists(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const openModal = (list?: ListResponse) => {
    if (list) {
      setSelectedList(list);
      setEditListName(list.listName);
      setEditListType(list.type);
    } else {
      setIsCreating(true);
      setEditListName("");
      setEditListType("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedList(null);
    setIsModalOpen(false);
    setIsEditing(false);
    setIsCreating(false);
    setIsConfirmingDelete(false);
  };

  const handleEditSave = async () => {
    if (!selectedList) return;

    try {
      const updatedList = await updateList(
        selectedList._id,
        editListName,
        editListType,
      );
      setLists(
        (prev) =>
          prev?.map((list) =>
            list._id === updatedList._id ? updatedList : list,
          ) || null,
      );
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update the list.");
      }
    }
  };

  const handleCreateSave = async () => {
    try {
      const newList = await createList(userId, editListName, editListType);
      setLists((prev) => (prev ? [newList, ...prev] : [newList]));
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create the list.");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedList) return;

    try {
      await deleteList(selectedList._id);
      setLists(
        (prev) => prev?.filter((list) => list._id !== selectedList._id) || null,
      );
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete the list.");
      }
    }
  };

  // Memoize the categorized list rendering
  const memoizedCategorizedLists = useMemo(() => {
    if (!lists) return null;

    const groupedLists = lists.reduce<Record<string, ListResponse[]>>(
      (acc, list) => {
        if (!acc[list.type]) {
          acc[list.type] = [];
        }
        acc[list.type].push(list);
        return acc;
      },
      {},
    );

    return Object.entries(groupedLists).map(([type, lists]) => (
      <div key={type}>
        <h3 className="py-5 text-xl text-white">{type}</h3>
        <ul>
          {lists.map((list) => (
            <li
              key={list._id}
              className="flex items-center py-2 text-lg text-white"
            >
              {list.listName}
              <button
                onClick={() => openModal(list)}
                className="ml-4 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      </div>
    ));
  }, [lists]);

  if (loading) return <p className="text-lg text-white">Loading...</p>;
  if (error) return <p className="text-lg text-white">Error: {error}</p>;

  return (
    <div>
      <h2 className="py-10 text-center text-2xl text-white underline">
        User Lists
      </h2>
      <div className="mb-4 flex justify-center">
        <button
          onClick={() => openModal()}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Create List
        </button>
      </div>
      {memoizedCategorizedLists || (
        <p className="py-5 text-lg text-white">No lists found.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-1/3 rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-bold">
              {isCreating ? "Create New List" : "List Details"}
            </h3>
            {isConfirmingDelete ? (
              <div className="text-center">
                <p className="mb-4">
                  Are you sure you want to delete this list?
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleDelete}
                    className="mr-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block font-bold">List Name:</label>
                  <input
                    type="text"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    disabled={!isEditing && !isCreating}
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold">List Type:</label>
                  <input
                    type="text"
                    value={editListType}
                    onChange={(e) => setEditListType(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    disabled={!isEditing && !isCreating}
                  />
                </div>
                <div className="flex justify-end">
                  {isCreating ? (
                    <button
                      onClick={handleCreateSave}
                      className="mr-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Create
                    </button>
                  ) : isEditing ? (
                    <button
                      onClick={handleEditSave}
                      className="mr-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Close
                  </button>
                  {!isCreating && !isEditing && (
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="ml-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLists;
