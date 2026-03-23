import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPlatformStats,
} from "../services/adminService.js";

export const listUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

export const changeUserRole = async (req, res) => {
  const { role } = req.body;
  await updateUserRole(req.params.id, role);
  res.json({ message: "Role updated" });
};

export const removeUser = async (req, res) => {
  await deleteUser(req.params.id);
  res.json({ message: "User deleted" });
};

export const getStats = async (req, res) => {
  const stats = await getPlatformStats();
  res.json(stats);
};
