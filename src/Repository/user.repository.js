import { User } from "../Models/users.models";

const createUser = async (userPayload) => {

    const user = {
        ...userPayload,
        name: userPayload.name || '',
        email: userPayload.email,
        password: userPayload.password,
        isActive: userPayload.isActive || false,
    }

    const userCreated = await User.create(user);

    if (!userCreated) {
        throw Error('user not able to create')
    }

    return userCreated;
};

const logoutUser = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, {
        refreshToken: null
    });

    return user;
}


export { createUser, logoutUser }