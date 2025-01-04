import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const authenticateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send({ error: "Invalid email or password." });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400).send({ error: "Invalid email or password." });
    return;
  }

  const token = user.generateAuthToken();
  res.send({ token });
};

function validateUser(data: { email: string; password: string }) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(data);
}
