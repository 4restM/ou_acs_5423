import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { getInstructors } from '../../services/api';
import type {
  IInstructor,
  IClass,
  ClassFormData,
  DayOfWeek,
  ConflictCheckResponse,
  ITimeSlot,
} from '../../types';

const DAYS: DayOfWeek[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

interface Props {
  onSubmit: (data: ClassFormData) => Promise<void>;
  initialData?: IClass | null;
  onCancel?: () => void;
  conflicts?: ConflictCheckResponse | null;
}

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'payRate' ? Number(value) : value,
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.instructor) errs.instructor = 'Please select an instructor';
    if (!formData.startTime) errs.startTime = 'Start time is required';
    if (!formData.endTime) errs.endTime = 'End time is required';
    if (formData.startTime >= formData.endTime) errs.endTime = 'End time must be after start time';
    if (!formData.payRate || formData.payRate <= 0) errs.payRate = 'A valid pay rate is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSlotSelect = (slot: ITimeSlot) => {
    setFormData((prev) => ({ ...prev, startTime: slot.start, endTime: slot.end }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <select name="instructor" value={formData.instructor} onChange={handleChange}>
          <option value="">-- Select Instructor --</option>
          {instructors.map((inst) => (
            <option key={inst._id} value={inst._id}>
              {inst.firstName} {inst.lastName}
            </option>
          ))}
        </select>
        {errors.instructor && <small style={{ color: 'var(--danger)' }}>{errors.instructor}</small>}
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
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          {errors.startTime && <small style={{ color: 'var(--danger)' }}>{errors.startTime}</small>}
        </div>
        <div className="form-group">
          <label>End Time *</label>
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          {errors.endTime && <small style={{ color: 'var(--danger)' }}>{errors.endTime}</small>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Class Name</label>
          <input type="text" name="className" value={formData.className} onChange={handleChange} placeholder="e.g. All Levels, Yoga with Weights" />
        </div>
        <div className="form-group">
          <label>Pay Rate ($) *</label>
          <input type="number" name="payRate" value={formData.payRate || ''} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
          {errors.payRate && <small style={{ color: 'var(--danger)' }}>{errors.payRate}</small>}
        </div>
      </div>

      <div className="btn-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Class' : 'Add Class'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ClassForm;
