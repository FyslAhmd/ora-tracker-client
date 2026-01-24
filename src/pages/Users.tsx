import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUserPlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2';
import { Button, Select, Input, LoadingSpinner, Modal, Pagination, Alert } from '@/components/ui';
import { usersService } from '@/services';
import { useAuth } from '@/hooks';
import { User, UserRole, RegisterData } from '@/types';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'viewer', label: 'Viewer' },
];

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <HiOutlineShieldCheck className="w-4 h-4" />,
  inspector: <HiOutlineClipboardDocumentCheck className="w-4 h-4" />,
  viewer: <HiOutlineEye className="w-4 h-4" />,
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  inspector: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, canManageUsers } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const limit = 10;

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { page: currentPage, limit, search: searchQuery, role: roleFilter }],
    queryFn: () =>
      usersService.getAll({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        role: roleFilter || undefined,
      }),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  // Create Form
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    },
  });

  // Edit Form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: RegisterData & { role: UserRole }) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
      resetCreate();
      toast.success('User created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      resetEdit();
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeletingUser(null);
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const handleCreate = (data: UserFormData) => {
    if (!data.password) {
      toast.error('Password is required');
      return;
    }
    createMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  const handleUpdate = (data: UserFormData) => {
    if (editingUser) {
      const updateData: Partial<UserFormData> = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      if (data.password) {
        updateData.password = data.password;
      }
      updateMutation.mutate({ id: editingUser._id, data: updateData });
    }
  };

  const handleDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser._id);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    resetEdit({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const openCreateModal = () => {
    resetCreate({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    });
    setIsCreateModalOpen(true);
  };

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <HiOutlineShieldCheck className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage system users and their roles</p>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <HiOutlineUserPlus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={roleOptions}
            className="w-full sm:w-48 flex-shrink-0"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error">Failed to load users. Please try again.</Alert>
      ) : users.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8 sm:p-12 border border-white/10 text-center">
          <HiOutlineUserPlus className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No users found</h3>
          <p className="text-slate-400 mb-6 text-sm sm:text-base">
            {searchQuery || roleFilter
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first user'}
          </p>
          {!searchQuery && !roleFilter && (
            <Button onClick={openCreateModal}>
              <HiOutlineUserPlus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            <AnimatePresence mode="popLayout">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{user.name}</p>
                        <p className="text-slate-400 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${roleColors[user.role]}`}
                    >
                      {roleIcons[user.role]}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">User</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Role</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Created</th>
                    <th className="text-right py-4 px-6 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${roleColors[user.role]}`}
                          >
                            {roleIcons[user.role]}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <HiOutlinePencilSquare className="w-5 h-5" />
                            </button>
                            {user._id !== currentUser?._id && (
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <HiOutlineTrash className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmitCreate(handleCreate)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter user name"
            error={createErrors.name?.message}
            {...registerCreate('name', { required: 'Name is required' })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            error={createErrors.email?.message}
            {...registerCreate('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={createErrors.password?.message}
            {...registerCreate('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <Select
            label="Role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'inspector', label: 'Inspector' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            {...registerCreate('role')}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isPending={createMutation.isPending}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        <form onSubmit={handleSubmitEdit(handleUpdate)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter user name"
            error={editErrors.name?.message}
            {...registerEdit('name', { required: 'Name is required' })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            error={editErrors.email?.message}
            {...registerEdit('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <Input
            label="New Password (optional)"
            type="password"
            placeholder="Leave blank to keep current password"
            error={editErrors.password?.message}
            {...registerEdit('password', {
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <Select
            label="Role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'inspector', label: 'Inspector' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            {...registerEdit('role')}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button type="submit" isPending={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete{' '}
            <span className="text-white font-medium">{deletingUser?.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isPending={deleteMutation.isPending}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
