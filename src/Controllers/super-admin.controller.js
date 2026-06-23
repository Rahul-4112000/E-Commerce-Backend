import crypto from "crypto";
import { sendMail } from "../shared/services/mail.service";
import { validateInvite } from "../utils/inviteValidation";
import { createAdmin } from "../Repository/invite.repository";
import { User } from "../Models/users.models";
import { ApiError } from "../utils/apiError";
import { searchSchema } from "../validation/common.validation";

const inviteAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const today = new Date();
    const tommorrowTimeStamp = today.setDate(today.getDate() + 1);
    const expiryTommorrow = new Date(tommorrowTimeStamp);

    await createAdmin(email, inviteToken, expiryTommorrow);

    await sendMail(email, inviteToken);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "invited successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
    });
  }
};

const validateInviteToken = async (req, res) => {
  const { inviteToken } = req.body

  const admin = await validateInvite(inviteToken);

  return res.status(200).json({
    success: true,
    message: 'token is valid',
    user: admin
  })
};

const getAdmins = async (req, res) => {

  const adminList = await User.find({ role: "admin" }).select("-password -refreshToken");

  if (!adminList) {
    throw Error('Not able to fetch admins');
  }

  if (!adminList.length) {
    return res.status(404).json({
      admin: [],
      adminCount: 0
    })
  }

  return res.status(200).json({
    admin: adminList,
    count: adminList.length
  })
}

const changeAdminStatus = async (req, res) => {
  const adminId = req.body.id;
  const isActive = req.body.isActive;

  if (typeof isActive !== "boolean") {
    throw new ApiError(401, 'status should be boolean only')
  }

  const user = await User.findByIdAndUpdate(adminId, { isActive });

  if (!user) {
    throw new Error('something went wrong!');
  }
  return res.status(201).json({
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
    data: {
      _id: user._id,
      isActive: user.isActive
    }
  })
}

const searchAdmin = async (req, res) => {
  const { q } = req.query;

  const result = searchSchema.safeParse({ searchTerm: q });

  if (!result.success) {
    const error = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(400).json({
      success: false,
      message: "validation failed",
      error: error
    })
  }

  let users = [];

  users = await User.find(
    q ? {
      role: 'admin',
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    } : { role: 'admin' })

  return res.status(200).json({
    count: users.length,
    admin: users
  })

}

export { inviteAdmin, validateInviteToken, getAdmins, changeAdminStatus, searchAdmin };
