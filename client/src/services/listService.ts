export interface ListResponse {
  _id: string;
  userId: string;
  listName: string;
  type: string;
  items: ItemResponse[];
}

export interface ItemResponse {
  _id: string;
  content: string;
  order: number;
}

const isLocalhost = window.location.hostname === "localhost";
const baseUrl = isLocalhost ? "/api/lists" : "/doable/api/lists";

export async function createList(
  userId: string,
  listName: string,
  type: string,
): Promise<ListResponse> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, listName, type }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error creating list");
  }

  return response.json();
}

export async function getLists(userId: string): Promise<ListResponse[]> {
  const response = await fetch(`${baseUrl}/${userId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error fetching lists");
  }

  return response.json();
}

export async function updateList(
  id: string,
  listName: string,
  type?: string,
): Promise<ListResponse> {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listName, type }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error updating list");
  }

  return response.json();
}

export async function deleteList(id: string): Promise<{ message: string }> {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error deleting list");
  }

  return response.json();
}

export async function addItem(
  id: string,
  content: string,
): Promise<ListResponse> {
  const response = await fetch(`${baseUrl}/${id}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error adding item");
  }

  return response.json();
}

export async function editItem(
  id: string,
  itemId: string,
  content: string,
): Promise<ListResponse> {
  const response = await fetch(`${baseUrl}/${id}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error editing item");
  }

  return response.json();
}

export async function deleteItem(
  id: string,
  itemId: string,
): Promise<ListResponse> {
  const response = await fetch(`${baseUrl}/${id}/items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error deleting item");
  }

  return response.json();
}

export async function reorderItems(
  id: string,
  newOrder: string[],
): Promise<ListResponse> {
  const response = await fetch(`${baseUrl}/${id}/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newOrder }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error reordering items");
  }

  return response.json();
}
