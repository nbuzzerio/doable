import { Schema, model, Document, Types } from "mongoose";

export interface IListItem {
  _id: Types.ObjectId;
  content: string;
  order: number;
}

interface IList extends Document {
  userId: Types.ObjectId;
  type: string;
  listName: string;
  items: Types.DocumentArray<IListItem>;
}

const ListSchema = new Schema<IList>({
  userId: { type: Schema.Types.ObjectId, ref: "doable-users", required: true },
  type: { type: String, default: "Miscellaneous" },
  listName: { type: String, required: true },
  items: [
    {
      content: { type: String, required: true },
      order: { type: Number, required: true },
    },
  ],
});

export default model<IList>("doable-lists", ListSchema);
