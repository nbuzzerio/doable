import { Router } from "express";
import {
  createList,
  getLists,
  updateList,
  deleteList,
  addItem,
  editItem,
  deleteItem,
  reorderItems,
} from "../controllers/listController.js";

const router = Router();

router.post("/", createList);
router.get("/:userId", getLists);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

router.post("/:id/items", addItem);
router.put("/:id/items/:itemId", editItem);
router.delete("/:id/items/:itemId", deleteItem);
router.put("/:id/reorder", reorderItems);

export default router;
