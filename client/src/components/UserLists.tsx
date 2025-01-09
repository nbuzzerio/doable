import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  deleteList,
  getLists,
  updateList,
  createList,
  ListResponse,
  addItem,
} from "../services/listService";
import ListModal from "./ListModal";

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
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
      setError(
        err instanceof Error ? err.message : "Failed to update the list.",
      );
    }
  };

  const handleCreateSave = async () => {
    try {
      const newList = await createList(userId, editListName, editListType);
      setLists((prev) => (prev ? [newList, ...prev] : [newList]));
      closeModal();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create the list.",
      );
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
      setError(
        err instanceof Error ? err.message : "Failed to delete the list.",
      );
    }
  };

  const handleAddItem = async (content: string) => {
    if (!selectedList) return;

    try {
      await addItem(selectedList._id, content);
      setLists(
        (prev) => prev?.filter((list) => list._id !== selectedList._id) || null,
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to add item to the list.",
      );
    }
  };

  const memoizedCategorizedLists = useMemo(() => {
    if (!lists) return null;

    const groupedLists = lists.reduce<Record<string, ListResponse[]>>(
      (acc, list) => {
        if (!acc[list.type]) acc[list.type] = [];
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

      <ListModal
        isOpen={isModalOpen}
        isCreating={isCreating}
        isEditing={isEditing}
        isConfirmingDelete={isConfirmingDelete}
        editListName={editListName}
        editListType={editListType}
        onClose={closeModal}
        onSave={handleEditSave}
        onCreate={handleCreateSave}
        onAddItem={handleAddItem}
        onDelete={handleDelete}
        onEditStart={() => setIsEditing(true)}
        onEditCancel={() => setIsEditing(false)}
        onConfirmDeleteStart={() => setIsConfirmingDelete(true)}
        onConfirmDeleteCancel={() => setIsConfirmingDelete(false)}
        onEditListNameChange={setEditListName}
        onEditListTypeChange={setEditListType}
        listItems={selectedList?.items}
      />
    </div>
  );
};

export default UserLists;
