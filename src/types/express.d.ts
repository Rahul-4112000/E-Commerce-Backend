import { IUser } from "../Models/users.models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
