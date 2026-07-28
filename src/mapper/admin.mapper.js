export const mapAdminToClient = (admin) => {
  return {
    id: admin._id,
    name: admin?.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive
  }
}

export const mapAdminListToClient = (adminList) => {
  return adminList.map(mapAdminToClient)
}

export const adminInviteMapper = (invitationObj) => {
  return {
    email: invitationObj.email,
    status: invitationObj.status,
    expiresAt: invitationObj.expiresAt
  }
}