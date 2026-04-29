import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { getInstructors } from '../../services/api';
import type {
  IInstructor,
  IClass,
  ClassFormData,
  DayOfWeek,
  ConflictCheckResponse,
  ITimeSlot,
} from '../../types';
import Toast from '../Layout/Toast';
import useToast from '../../hooks/useToast';

const DAYS: DayOfWeek[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

interface Props {
  onSubmit: (data: ClassFormData) => Promise<void>;
  initialData?: IClass | null;
  onCancel?: () => void;
  conflicts?: ConflictCheckResponse | null;
}

/** Returns a map of field -> error message for currently invalid fields. */
const getValidationErrors = (formData: ClassFormData): Record<string, string> => {
  const errs: Record<string, string> = {};
  if (!formData.instructor) errs.instructor = 'Please select an instructor';
  if (!formData.startTime) errs.startTime = 'Start time is required';
  if (!formData.endTime) errs.endTime = 'End time is required';
  if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime)
    errs.endTime = 'End time must be after start time';
  if (!formData.payRate || formData.payRate <= 0)
    errs.payRate = 'A valid pay rate is required';
  return errs;
};

const ClassForm = ({ onSubmit, initialData, onCancel, conflicts }: Props) => {
  const [formData, setFormData] = useState<ClassFormData>({
    instructor: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:15',
    classType: 'General',
    className: 'All Levels',
    payRate: 0,
  });
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    getInstructors()
      .then((data) => setInstructors(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialData) {
      const instId =
        initialData.instructor && typeof initialData.instructor === 'object'
          ? initialData.instructor._id
          : initialData.instructor ?? '';
      setFormData({
        instructor: instId,
        dayOfWeek: initialData.dayOfWeek,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        classType: initialData.classType,
        className: initialData.className,
        payRate: initialData.payRate,
      });
    }
  }, [initialData]);

  // Recompute errors on every render so the submit button reflects live state
  const validationErrors = useMemo(() => getValidationErrors(formData), [formData]);
  const isFormValid = Object.keys(validationErrors).length === 0;

  // Inline errors: only show after a field has been touched OR after a submit attempt
  const getFieldError = (field: string) =>
    (submitted || touched[field]) ? validationErrors[field] : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'payRate' ? Number(value) : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSlotSelect = (slot: ITimeSlot) => {
    setFormData((prev) => ({ ...prev, startTime: slot.start, endTime: slot.end }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid) {
      showToast(
        'Please fix the following before saving:',
        Object.values(validationErrors),
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <form onSubmit={handleSubmit} noValidate>
        {conflicts?.hasConflict && (
          <div className="alert alert-warning">
            <p><strong>Schedule conflict!</strong> There is already a class at this time:</p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {conflicts.conflicts.map((c, i) => {
                const inst = typeof c.instructor === 'object' ? c.instructor : null;
                return (
                  <li key={i}>
                    {c.dayOfWeek} {c.startTime}-{c.endTime} — {c.className}
                    {inst && ` (${inst.firstName} ${inst.lastName})`}
                  </li>
                );
              })}
            </ul>
            {conflicts.availableSlots.length > 0 && (
              <>
                <p><strong>Available slots on {formData.dayOfWeek}:</strong></p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {conflicts.availableSlots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="form-group">
          <label>Instructor *</label>
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldError('instructor') ? 'is-invalid' : ''}
          >
            <option value="">-- Select Instructor --</option>
            {instructors.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.firstName} {inst.lastName}
              </option>
            ))}
          </select>
          {getFieldError('instructor') && (
            <small className="field-error">{getFieldError('instructor')}</small>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Day of Week *</label>
            <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Class Type *</label>
            <select name="classType" value={formData.classType} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Special">Special</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('startTime') ? 'is-invalid' : ''}
            />
            {getFieldError('startTime') && (
              <small className="field-error">{getFieldError('startTime')}</small>
            )}
          </div>
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('endTime') ? 'is-invalid' : ''}
            />
            {getFieldError('endTime') && (
              <small className="field-error">{getFieldError('endTime')}</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="e.g. All Levels, Yoga with Weights"
            />
          </div>
          <div className="form-group">
            <label>Pay Rate ($) *</label>
            <input
              type="number"
              name="payRate"
              value={formData.payRate || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={getFieldError('payRate') ? 'is-invalid' : ''}
            />
            {getFieldError('payRate') && (
              <small className="field-error">{getFieldError('payRate')}</small>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || (!isFormValid && submitted)}
          >
            {loading ? 'Saving...' : initialData ? 'Update Class' : 'Add Class'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ClassForm;
