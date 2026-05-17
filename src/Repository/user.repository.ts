import { IUser, User } from "../Models/users.models";

type user = {
  name? : string;
  email: string;
  password: string;
  isActive?: boolean;
  lastLogin?: Date;
  role?: "admin" | "super_admin" | "user";
  refreshToken?:string;
};

const createUser = async (userPayload: user): Promise<IUser> => {

    const user:user = {
        ...userPayload,
        name: userPayload.name || '',
        email: userPayload.email,
        password: userPayload.password,
        isActive: userPayload.isActive || false,
    }

    const userCreated = await User.create(user);

    if(!userCreated){
        throw Error('user not able to create')
    }

    return userCreated;
};


export { createUser }