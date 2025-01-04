import bcrypt from "bcrypt";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { validateUser } from "../models/User.js";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send({ error: "Unauthorized access" });
    return;
  }

  const user = await User.findById(req.user._id).select("name");
  if (!user) {
    res.status(404).send({ error: "User not found" });
    return;
  }

  res.send(user);
};

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.status(400).send({ error: "User already registered." });
    return;
  }

  user = new User({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  const token = user.generateAuthToken();
  try {
    const result = await user.save();

    res.header("x-auth-token", token).send({
      _id: result._id,
      name: result.name,
      email: result.email,
      token: token,
    });
  } catch (ex) {
    if (ex instanceof mongoose.Error.ValidationError) {
      for (const field in ex.errors) {
        console.error(ex.errors[field].message);
      }
    }
    res.status(500).send({ error: "An error occurred while saving the user." });
  }
};
