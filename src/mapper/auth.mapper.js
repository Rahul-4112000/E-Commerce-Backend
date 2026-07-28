const mapAuthUserToClient = (user) => {
  return {
    id: user._id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    avatar: user.avatar || '',
    isActive: user.isActive,
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt || null,
  }
}

export { mapAuthUserToClient }