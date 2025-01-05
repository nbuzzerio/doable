import { Schema, model, Document, Types } from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  lists: Types.ObjectId[];
  generateAuthToken: () => string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lists: [{ type: Schema.Types.ObjectId, ref: "doable-lists" }],
});

// Method to generate JWT
UserSchema.methods.generateAuthToken = function (): string {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("FATAL ERROR: JWT_PRIVATE_KEY is not defined.");
  }
  const token = jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.JWT_PRIVATE_KEY,
  );
  return token;
};

// Validation function for users
function validateUser(user: { name: string; email: string; password: string }) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

export { validateUser };
export default model<IUser>("doable-users", UserSchema);
