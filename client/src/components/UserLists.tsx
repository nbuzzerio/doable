import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getLists, ListResponse } from "../services/listService";

interface Props {
  userId: string;
}

const UserLists: React.FC<Props> = ({ userId }) => {
  const [lists, setLists] = useState<ListResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Memoize the list rendering to prevent unnecessary re-renders
  const memoizedList = useMemo(() => {
    if (!lists) return null;
    return (
      <ul>
        {lists.map(({ id, listName }) => (
          <li key={id}>{listName}</li>
        ))}
      </ul>
    );
  }, [lists]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Lists</h1>
      {memoizedList || <p>No lists found.</p>}
    </div>
  );
};

export default UserLists;
