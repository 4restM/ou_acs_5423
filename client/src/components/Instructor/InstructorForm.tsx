import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { checkInstructorName } from '../../services/api';
import type { IInstructor, InstructorFormData } from '../../types';

interface Props {
  onSubmit: (data: InstructorFormData) => Promise<void>;
  initialData?: IInstructor | null;
  onCancel?: () => void;
}

const emptyForm: InstructorFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  preferredCommunication: 'email',
  address: { street: '', city: '', state: '', zip: '' },
};

const InstructorForm = ({ onSubmit, initialData, onCancel }: Props) => {
  const [formData, setFormData] = useState<InstructorFormData>(emptyForm);
  const [nameWarning, setNameWarning] = useState<string | null>(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phone: initialData.phone ?? '',
        email: initialData.email ?? '',
        preferredCommunication: initialData.preferredCommunication,
        address: initialData.address ?? { street: '', city: '', state: '', zip: '' },
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === 'firstName' || name === 'lastName') {
      setNameWarning(null);
      setNameConfirmed(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (formData.preferredCommunication === 'email' && !formData.email.trim())
      errs.email = 'Email is required when preferred communication is email';
    if (formData.preferredCommunication === 'phone' && !formData.phone.trim())
      errs.phone = 'Phone is required when preferred communication is phone';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckName = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;
    try {
      const response = await checkInstructorName(
        formData.firstName.trim(),
        formData.lastName.trim()
      );
      if (response.exists) {
        setNameWarning(
          `Found ${response.count} existing instructor(s) with this name: ${response.matches
            .map((m) => `${m.fullName} (${m.instructorId})`)
            .join(', ')}. Do you want to continue?`
        );
      } else {
        setNameConfirmed(true);
        setNameWarning(null);
      }
    } catch {
      setNameConfirmed(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!initialData && !nameConfirmed && !nameWarning) {
      await handleCheckName();
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
    <form onSubmit={handleSubmit}>
      {nameWarning && (
        <div className="alert alert-warning">
          <p>{nameWarning}</p>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => { setNameConfirmed(true); setNameWarning(null); }}
            >
              Yes, continue
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setNameWarning(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" />
          {errors.firstName && <small style={{ color: 'var(--danger)' }}>{errors.firstName}</small>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
          {errors.lastName && <small style={{ color: 'var(--danger)' }}>{errors.lastName}</small>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(412) 555-0123" />
          {errors.phone && <small style={{ color: 'var(--danger)' }}>{errors.phone}</small>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="instructor@example.com" />
          {errors.email && <small style={{ color: 'var(--danger)' }}>{errors.email}</small>}
        </div>
      </div>

      <div className="form-group">
        <label>Preferred Communication</label>
        <select name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>

      <div className="form-group">
        <label>Street Address</label>
        <input type="text" name="address.street" value={formData.address.street ?? ''} onChange={handleChange} placeholder="123 Main St" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input type="text" name="address.city" value={formData.address.city ?? ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>State</label>
          <input type="text" name="address.state" value={formData.address.state ?? ''} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group" style={{ maxWidth: '200px' }}>
        <label>ZIP</label>
        <input type="text" name="address.zip" value={formData.address.zip ?? ''} onChange={handleChange} />
      </div>

      <div className="btn-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Instructor' : 'Add Instructor'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default InstructorForm;
