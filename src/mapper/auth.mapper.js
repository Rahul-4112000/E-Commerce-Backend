const mapAuthUserToClient = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  }
}

export { mapAuthUserToClient }