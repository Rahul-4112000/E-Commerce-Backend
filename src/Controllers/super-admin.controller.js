import crypto from "crypto";
import { sendMail } from "../shared/services/mail.service";
import { validateInvite } from "../utils/inviteValidation";
import { createAdmin } from "../Repository/invite.repository";
import { User } from "../Models/users.models";

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

const validateInviteToken = async (req, repository) => {
  const { inviteToken } = req.body

  const admin = await validateInvite(inviteToken);

  return res.status(200).json({
    success: true,
    message: 'token is valid',
    user: admin
  })
};

const getAdmins = async (req, res) => {

  const adminList = await User.find({role: "admin"}).select("-password -refreshToken");

  if(!adminList){
    throw Error('Not able to fetch admins');
  }

  if(!adminList.length){
    return res.status(404).json({
      message: 'admin not found'
    })
  }

  return res.status(200).json({
    adminList: adminList,
    adminCount: adminList.length
  })
}

const changeAdminStatus = async (req, res) => {
  const adminId = req.params.id;
  const isActive = req.body.isActive;

  const user = await User.findByIdAndUpdate(adminId,{isActive: !isActive});

  if(!user){
    throw Error("Can't update status");
  }

  return res.status(201).json({
    message: "status changed successfully"
  })
}

export { inviteAdmin, validateInviteToken, getAdmins, changeAdminStatus };
