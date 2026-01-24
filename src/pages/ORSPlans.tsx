import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineTableCells,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import { Button, Select, LoadingSpinner, Modal, Pagination, Alert } from '@/components/ui';
import { ORSCard, ORSTable, ORSForm } from '@/components/ors';
import { orsService } from '@/services';
import { useAuth } from '@/hooks';
import { ORSPlan, ORSFormData } from '@/types';
import toast from 'react-hot-toast';

const ORSPlans: React.FC = () => {
  const queryClient = useQueryClient();
  const { canCreate } = useAuth();

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ORSPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<ORSPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<ORSPlan | null>(null);

  const limit = 12;

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['ors-plans', { page: currentPage, limit, search: searchQuery, status: statusFilter }],
    queryFn: () =>
      orsService.getAll({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const plans = data?.orsPlans || [];
  const pagination = data?.pagination;

  // Mutations
  const createMutation = useMutation({
    mutationFn: orsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ors-plans'] });
      queryClient.invalidateQueries({ queryKey: ['ors-stats'] });
      setIsCreateModalOpen(false);
      toast.success('ORS Plan created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ORS plan');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ORSFormData }) => orsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ors-plans'] });
      queryClient.invalidateQueries({ queryKey: ['ors-stats'] });
      setEditingPlan(null);
      toast.success('ORS Plan updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ORS plan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: orsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ors-plans'] });
      queryClient.invalidateQueries({ queryKey: ['ors-stats'] });
      setDeletingPlan(null);
      toast.success('ORS Plan deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ORS plan');
    },
  });

  const handleCreate = (data: ORSFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: ORSFormData) => {
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan._id, data });
    }
  };

  const handleDelete = () => {
    if (deletingPlan) {
      deleteMutation.mutate(deletingPlan._id);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:gap-4"
      >
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-40 flex-shrink-0"
          />
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiOutlineSquares2X2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiOutlineTableCells className="w-5 h-5" />
            </button>
          </div>

          {canCreate && (
            <Button leftIcon={<HiOutlinePlus />} onClick={() => setIsCreateModalOpen(true)} className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">New ORS Plan</span>
              <span className="sm:hidden">New Plan</span>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="error">
          {(error as any)?.message || 'Failed to load ORS plans. Please try again.'}
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {plans.map((plan: ORSPlan) => (
                  <ORSCard
                    key={plan._id}
                    plan={plan}
                    onEdit={() => setEditingPlan(plan)}
                    onDelete={() => setDeletingPlan(plan)}
                    onView={() => setViewingPlan(plan)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[640px] px-3 sm:px-0">
                <ORSTable
                  plans={plans}
                  onEdit={(plan) => setEditingPlan(plan)}
                  onDelete={(plan) => setDeletingPlan(plan)}
                  onView={(plan) => setViewingPlan(plan)}
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {plans.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6 sm:p-12 text-center"
            >
              <HiOutlineClipboardDocumentList className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No ORS Plans Found</h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                {searchQuery || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first ORS plan.'}
              </p>
              {canCreate && !searchQuery && !statusFilter && (
                <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<HiOutlinePlus />}>
                  Create First ORS Plan
                </Button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination && plans.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
              <p className="text-center text-sm text-gray-500 mt-3">
                Showing {plans.length} of {pagination.total} results
              </p>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create ORS Plan"
        size="xl"
      >
        <ORSForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Edit ORS Plan"
        size="xl"
      >
        {editingPlan && (
          <ORSForm
            initialData={editingPlan}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingPlan(null)}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewingPlan}
        onClose={() => setViewingPlan(null)}
        title={`ORS Plan: ${viewingPlan?.vehicleId}`}
        size="lg"
      >
        {viewingPlan && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Vehicle Type</p>
                <p className="text-white">{viewingPlan.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-white capitalize">{viewingPlan.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Overall Score</p>
                <p className="text-white">{(viewingPlan.overallScore ?? 0).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Inspector</p>
                <p className="text-white">{viewingPlan.createdBy?.name ?? 'Unknown'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Component Scores</p>
              <div className="grid grid-cols-2 gap-3">
                {viewingPlan.scores && Object.entries(viewingPlan.scores).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-dark-700/50 rounded">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white">{value ?? 0}%</span>
                  </div>
                ))}
              </div>
            </div>

            {viewingPlan.notes && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Notes</p>
                <p className="text-white bg-dark-700/50 rounded p-3">{viewingPlan.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        title="Delete ORS Plan"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-gray-300">
            Are you sure you want to delete the ORS plan for vehicle{' '}
            <span className="font-semibold text-white">{deletingPlan?.vehicleId}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingPlan(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isPending={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ORSPlans;
