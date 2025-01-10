import { useState } from "react";

interface ListItemProps {
  deleteItem: () => void;
  editItem: (content: string) => void;
  content: string;
}

const ListItem: React.FC<ListItemProps> = ({
  content,
  deleteItem,
  editItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemContent, setItemContent] = useState(content);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setItemContent(content);
  };
  const handleEdit = () => {
    setIsEditing(false);
    editItem(itemContent);
  };

  return (
    <li className="flex items-center justify-between gap-4 pl-10">
      {isEditing ? (
        <div className="flex w-full items-center justify-between gap-x-7">
          <input
            type="text"
            value={itemContent}
            onChange={(e) => setItemContent(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1"
            disabled={!isEditing}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="rounded bg-blue-500 p-1 text-white hover:bg-green-600"
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
            <button
              onClick={handleCancelEdit}
              className="aspect-square w-8 rounded bg-blue-500 p-1 text-white hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      ) : (
        <p
          className="cursor-pointer text-lg"
          onClick={() => setIsEditing(true)}
        >
          {content}
        </p>
      )}
      <button
        onClick={deleteItem}
        className="aspect-square w-8 rounded p-1 text-white hover:bg-red-600"
      >
        🗑️
      </button>
    </li>
  );
};

export default ListItem;
