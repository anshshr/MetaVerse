import type { NextFunction, Request, Response } from "express";
import type { ResponseInterface } from "../core/response/reponse_interface.js";
import jwt from "jsonwebtoken";

export const adminMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headers = req.headers.authorization;
  const token: string = headers?.split(" ")[1] as string;

  if (!token) {
    const ans: ResponseInterface<null> = {
      message: "Unauthorized",
      status: 0,
    };
    return res.status(401).json(ans);
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as {
      id: string;
    };
    res.locals.userId = decoded.id;
    next();
  } catch (error) {
    const ans: ResponseInterface<null> = {
      message: "Token verification failed",
      status: 0,
    };
    return res.status(404).json(ans);
  }
};
