import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input, Select, Textarea, Button } from '../ui';
import { ORSFormData, ORSPlan, ORSStatus } from '@/types';
import { VEHICLE_TYPES } from '@/utils/constants';

interface ORSFormProps {
  initialData?: ORSPlan;
  onSubmit: (data: ORSFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const ORSForm: React.FC<ORSFormProps> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ORSFormData>({
    defaultValues: initialData
      ? {
          vehicleId: initialData.vehicleId,
          vehicleType: initialData.vehicleType,
          inspectionDate: initialData.inspectionDate.split('T')[0],
          nextInspectionDate: initialData.nextInspectionDate.split('T')[0],
          status: initialData.status,
          scores: initialData.scores,
          textDocumentation: initialData.textDocumentation,
          notes: initialData.notes,
        }
      : {
          vehicleId: '',
          vehicleType: '',
          inspectionDate: new Date().toISOString().split('T')[0],
          nextInspectionDate: '',
          status: 'draft' as ORSStatus,
          scores: {
            engine: 0,
            brakes: 0,
            tires: 0,
            transmission: 0,
            electrical: 0,
            suspension: 0,
            steering: 0,
            bodyExterior: 0,
            interior: 0,
            safetyEquipment: 0,
          },
          textDocumentation: {
            engineNotes: '',
            brakesNotes: '',
            tiresNotes: '',
            transmissionNotes: '',
            electricalNotes: '',
            suspensionNotes: '',
            steeringNotes: '',
            bodyExteriorNotes: '',
            interiorNotes: '',
            safetyEquipmentNotes: '',
          },
          notes: '',
        },
  });

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  const vehicleTypeOptions = VEHICLE_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const scoreFields = [
    { key: 'engine', label: 'Engine', noteKey: 'engineNotes' },
    { key: 'brakes', label: 'Brakes', noteKey: 'brakesNotes' },
    { key: 'tires', label: 'Tires', noteKey: 'tiresNotes' },
    { key: 'transmission', label: 'Transmission', noteKey: 'transmissionNotes' },
    { key: 'electrical', label: 'Electrical', noteKey: 'electricalNotes' },
    { key: 'suspension', label: 'Suspension', noteKey: 'suspensionNotes' },
    { key: 'steering', label: 'Steering', noteKey: 'steeringNotes' },
    { key: 'bodyExterior', label: 'Body/Exterior', noteKey: 'bodyExteriorNotes' },
    { key: 'interior', label: 'Interior', noteKey: 'interiorNotes' },
    { key: 'safetyEquipment', label: 'Safety Equipment', noteKey: 'safetyEquipmentNotes' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="Vehicle ID"
            placeholder="e.g., VH-2024-001"
            {...register('vehicleId', {
              required: 'Vehicle ID is required',
              minLength: { value: 3, message: 'Vehicle ID must be at least 3 characters' },
            })}
            error={errors.vehicleId?.message}
          />

          <Controller
            name="vehicleType"
            control={control}
            rules={{ required: 'Vehicle type is required' }}
            render={({ field }) => (
              <Select
                label="Vehicle Type"
                options={vehicleTypeOptions}
                placeholder="Select vehicle type"
                error={errors.vehicleType?.message}
                {...field}
              />
            )}
          />

          <Input
            type="date"
            label="Inspection Date"
            {...register('inspectionDate', { required: 'Inspection date is required' })}
            error={errors.inspectionDate?.message}
          />

          <Input
            type="date"
            label="Next Inspection Date"
            {...register('nextInspectionDate', { required: 'Next inspection date is required' })}
            error={errors.nextInspectionDate?.message}
          />

          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Select
                label="Status"
                options={statusOptions}
                error={errors.status?.message}
                {...field}
              />
            )}
          />
        </div>
      </motion.div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Inspection Scores</h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
          Rate each component from 0 to 100. The overall score will be calculated automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {scoreFields.map((field) => (
            <div key={field.key} className="space-y-3">
              <Input
                type="number"
                label={`${field.label} Score`}
                min={0}
                max={100}
                {...register(`scores.${field.key as keyof ORSFormData['scores']}` as any, {
                  required: `${field.label} score is required`,
                  min: { value: 0, message: 'Score must be at least 0' },
                  max: { value: 100, message: 'Score cannot exceed 100' },
                  valueAsNumber: true,
                })}
                error={(errors.scores as any)?.[field.key]?.message}
              />

              <Textarea
                label={`${field.label} Notes`}
                placeholder={`Notes about ${field.label.toLowerCase()} condition...`}
                rows={2}
                {...register(`textDocumentation.${field.noteKey as keyof ORSFormData['textDocumentation']}` as any)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Additional Notes</h3>
        <Textarea
          label="General Notes"
          placeholder="Any additional observations or recommendations..."
          rows={4}
          {...register('notes')}
        />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3"
      >
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Update ORS Plan' : 'Create ORS Plan'}
        </Button>
      </motion.div>
    </form>
  );
};

export default ORSForm;
