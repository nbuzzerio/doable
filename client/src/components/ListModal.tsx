import React, { useCallback, useRef, useState } from "react";
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
  onReorder: (newOrder: string[]) => void;
  onDelete: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onConfirmDeleteStart: () => void;
  onConfirmDeleteCancel: () => void;
  onEditListNameChange: (value: string) => void;
  onEditListTypeChange: (value: string) => void;
  listItems: ItemResponse[];
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
  onReorder,
  onDelete,
  onEditStart,
  onEditCancel,
  onConfirmDeleteStart,
  onConfirmDeleteCancel,
  onEditListNameChange,
  onEditListTypeChange,
  listItems,
}) => {
  const [newItem, setNewItem] = useState("");
  const [draggedItemId, setDraggedItemId] = useState("");
  const [currentTouchId, setCurrentTouchId] = useState("");

  const phantomRef = useRef<HTMLDivElement>(null);

  const orderedItems = listItems.sort((a, b) => {
    if (a.order < b.order) return -1;
    else return 1;
  });

  const handleDragStart = (id: string) => {
    setDraggedItemId(id);
  };

  const handleDrop = useCallback(
    (droppedOnId: string) => {
      const listOrder = listItems.map((item) => item._id);
      if (draggedItemId === null || draggedItemId === droppedOnId) return;

      const draggedIndex = listOrder.indexOf(draggedItemId);
      const droppedOnIndex = listOrder.indexOf(droppedOnId);

      const newOrder = [...listOrder];

      newOrder.splice(draggedIndex, 1); // Remove dragged item
      newOrder.splice(droppedOnIndex, 0, draggedItemId); // Insert it at new position

      onReorder(newOrder);
    },
    [draggedItemId, listItems, onReorder],
  );

  if (!isOpen) return null;

  const handleAddItem = () => {
    onAddItem(newItem);
    setNewItem("");
  };

  const handleTouchStart = (id: string) => {
    setDraggedItemId(id);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    const phantom = phantomRef.current as HTMLDivElement;
    phantom.style.display = "flex";

    phantom.style.top = `${touch.pageY}px`;
    phantom.style.left = `${touch.pageX}px`;

    if (element) {
      const parentWithId = element.closest("[data-id]");
      if (parentWithId) {
        const itemId = parentWithId.getAttribute("data-id");
        if (itemId) {
          setCurrentTouchId(itemId);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const phantom = phantomRef.current as HTMLDivElement;
    phantom.style.display = "none";

    const listOrder = listItems.map((item) => item._id);
    if (draggedItemId === null || draggedItemId === currentTouchId) return;

    const draggedIndex = listOrder.indexOf(draggedItemId);
    const droppedOnIndex = listOrder.indexOf(currentTouchId);

    const newOrder = [...listOrder];

    newOrder.splice(draggedIndex, 1); // Remove dragged item
    newOrder.splice(droppedOnIndex, 0, draggedItemId); // Insert it at new position

    onReorder(newOrder);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="pointer-events-none absolute z-30 hidden h-10 w-10 -translate-x-3/4 -translate-y-3/4 items-center justify-center rounded-full bg-green-600/20"
        ref={phantomRef}
      >
        📒
      </div>
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
            {orderedItems.map((item) => (
              <li
                key={item._id}
                draggable
                onDragStart={() => handleDragStart(item._id)}
                onDragOver={(e) => e.preventDefault()} // Allow drop
                onDrop={() => handleDrop(item._id)}
                data-id={item._id} // Add a data attribute to identify the element
                onTouchStart={() => handleTouchStart(item._id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="hover:cursor-grab active:cursor-grabbing"
              >
                <ListItem
                  content={item.content}
                  deleteItem={() => onDeleteItem(item._id)}
                  editItem={(content) => onEditItem(content, item._id)}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ListModal;
