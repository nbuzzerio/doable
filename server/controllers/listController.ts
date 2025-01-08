import { Request, Response } from "express";
import List, { IListItem } from "../models/List.js";

export const createList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, listName, type } = req.body;
  try {
    const newList = new List({ userId, listName, type });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: "Error creating list" });
  }
};

export const getLists = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const lists = await List.find({ userId });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching lists" });
  }
};

export const updateList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { listName, type } = req.body;
  try {
    const updatedList = await List.findByIdAndUpdate(
      id,
      { listName, type },
      { new: true },
    );
    if (!updatedList) res.status(404).json({ message: "List not found" });
    else res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ error: "Error updating list" });
  }
};

export const deleteList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await List.findByIdAndDelete(id);

    if (!deleted) res.status(404).json({ message: "List not found" });
    else res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting list" });
  }
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const list = await List.findById(id);
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    list.items.push({ content, order: list.items.length });
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
};

export const editItem = async (req: Request, res: Response): Promise<void> => {
  const { id, itemId } = req.params;
  const { content } = req.body;
  try {
    const list = await List.findById(id);
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    const item = list.items.id(itemId);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    item.content = content;
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: "Error editing item" });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id, itemId } = req.params;

  try {
    const list = await List.findById(id);
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }

    const itemExists = list.items.some(
      (item) => item._id.toString() === itemId,
    );

    if (!itemExists) {
      res.status(404).json({ message: "Item not found in the list" });
    } else {
      list.items.pull({ _id: itemId });
      await list.save();
      res.status(200).json(list);
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
};

export const reorderItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { newOrder } = req.body; // Expecting an array of item IDs in the new order

  try {
    const list = await List.findById(id);
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }

    if (!Array.isArray(newOrder)) {
      res
        .status(400)
        .json({ error: "Invalid newOrder format. Must be an array." });
      return;
    }

    if (newOrder.length !== list.items.length) {
      res.status(400).json({
        error: "newOrder must have the same number of items as the list.",
      });
      return;
    }

    const listItemIds = list.items.map((item: IListItem) =>
      item._id.toString(),
    );
    const isValidOrder = newOrder.every((_id: string) =>
      listItemIds.includes(_id),
    );

    if (!isValidOrder) {
      res
        .status(400)
        .json({ error: "newOrder contains invalid or missing item IDs." });
      return;
    }

    newOrder.forEach((itemId: string, index: number) => {
      const item = list.items.id(itemId);
      if (item) {
        item.order = index;
      }
    });

    await list.save();

    res.status(200).json(list);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
