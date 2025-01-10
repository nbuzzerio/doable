import React, { useState } from "react";
import { ItemResponse } from "../services/listService";
import ListItem from "./ListItem";

interface ListModalProps {
  isOpen: boolean;
  isCreating: boolean;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  editListName: string;
  editListType: string;
  onClose: () => void;
  onSave: () => void;
  onCreate: () => void;
  onAddItem: (content: string) => void;
  onEditItem: (content: string, itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onDelete: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onConfirmDeleteStart: () => void;
  onConfirmDeleteCancel: () => void;
  onEditListNameChange: (value: string) => void;
  onEditListTypeChange: (value: string) => void;
  listItems: ItemResponse[] | undefined;
}

const ListModal: React.FC<ListModalProps> = ({
  isOpen,
  isCreating,
  isEditing,
  isConfirmingDelete,
  editListName,
  editListType,
  onClose,
  onSave,
  onCreate,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDelete,
  onEditStart,
  onEditCancel,
  onConfirmDeleteStart,
  onConfirmDeleteCancel,
  onEditListNameChange,
  onEditListTypeChange,
  listItems = [],
}) => {
  const [newItem, setNewItem] = useState("");

  if (!isOpen) return null;

  const handleAddItem = () => {
    onAddItem(newItem);
    setNewItem("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative w-4/5 rounded-lg bg-white px-6 py-20 md:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          X
        </button>
        {!isConfirmingDelete ? (
          <div className="flex items-center justify-between pb-10">
            <h3 className="text-xl font-bold capitalize">
              {isCreating ? "Create New List" : `${editListName} Details`}
            </h3>
            <>
              <div className="flex justify-end">
                {isCreating ? (
                  <button
                    onClick={onCreate}
                    className="mr-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    Create
                  </button>
                ) : isEditing ? (
                  <div className="flex gap-4">
                    <button
                      onClick={onSave}
                      className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={onEditCancel}
                      className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onEditStart}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
                {!isCreating && !isEditing && (
                  <button
                    onClick={onConfirmDeleteStart}
                    className="ml-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          </div>
        ) : null}
        {isConfirmingDelete ? (
          <div className="text-center">
            <p className="mb-4">Are you sure you want to delete this list?</p>
            <div className="flex justify-center">
              <button
                onClick={onDelete}
                className="mr-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={onConfirmDeleteCancel}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <>
            {isEditing || isCreating ? (
              <>
                <div className="mb-4">
                  <label className="block font-bold">List Name:</label>
                  <input
                    type="text"
                    value={editListName}
                    onChange={(e) => onEditListNameChange(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    disabled={!isEditing && !isCreating}
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold">List Type:</label>
                  <input
                    type="text"
                    value={editListType}
                    onChange={(e) => onEditListTypeChange(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    disabled={!isEditing && !isCreating}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <label className="block font-bold">Add:</label>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1"
                  disabled={isEditing && isCreating}
                />
                <button
                  onClick={handleAddItem}
                  className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
                  disabled={!newItem}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M20.285 6.715c-.391-.39-1.023-.39-1.414 0l-9.192 9.193-4.242-4.243c-.391-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414l5 5c.391.39 1.023.39 1.414 0l10-10c.391-.391.391-1.023 0-1.414z" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        {!isConfirmingDelete ? (
          <ul className="flex list-disc flex-col gap-4 py-4">
            {listItems.map((item) => (
              <ListItem
                content={item.content}
                deleteItem={() => onDeleteItem(item._id)}
                editItem={(content) => onEditItem(content, item._id)}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ListModal;
