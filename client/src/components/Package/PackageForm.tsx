import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { IPackage, PackageFormData, NumberOfClasses } from '../../types';

// this interface's on submit is async because the parent component will handle the API call and we want to show a loading state while it's processing.
interface Props {
  onSubmit: (data: PackageFormData) => Promise<void>;
  initialData?: IPackage | null;
  onCancel?: () => void;
}

const emptyForm: PackageFormData = {
  packageName: '',
  category: 'General',
  numberOfClasses: 1,
  classType: 'General',
  startDate: '',
  endDate: '',
  price: 0,
};

const PackageForm = ({ onSubmit, initialData, onCancel }: Props) => {
  //state for form data, errors, and loading state
  const [formData, setFormData] = useState<PackageFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // when initialData changes (e.g. when editing a package), we populate the form with that data
  useEffect(() => {
    if (initialData) {
      setFormData({
        packageName: initialData.packageName,
        category: initialData.category,
        numberOfClasses: initialData.numberOfClasses,
        classType: initialData.classType,
        startDate: initialData.startDate.slice(0, 10),
        endDate: initialData.endDate.slice(0, 10),
        price: initialData.price,
      });
    }
  }, [initialData]);

  // this function handles changes to all form fields.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'numberOfClasses') {
      const parsed = value === 'unlimited' ? 'unlimited' : (Number(value) as 1 | 4 | 10);
      setFormData((prev) => ({ ...prev, numberOfClasses: parsed as NumberOfClasses }));
    } else if (name === 'price') {
      setFormData((prev) => ({ ...prev, price: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // required validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.packageName.trim()) errs.packageName = 'Package name is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.endDate) errs.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate)
      errs.endDate = 'End date must be after start date';
    if (formData.price < 0) errs.price = 'Price cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
      <div className="form-group">
        <label>Package Name *</label>
        <input
          type="text"
          name="packageName"
          value={formData.packageName}
          onChange={handleChange}
          placeholder="e.g. Monthly General"
        />
        {errors.packageName && <small style={{ color: 'var(--danger)' }}>{errors.packageName}</small>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Package Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div className="form-group">
          <label>Class Type</label>
          <select name="classType" value={formData.classType} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Special">Special</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Number of Classes</label>
        <select
          name="numberOfClasses"
          value={String(formData.numberOfClasses)}
          onChange={handleChange}
        >
          <option value="1">1 class</option>
          <option value="4">4 classes</option>
          <option value="10">10 classes</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <small style={{ color: 'var(--danger)' }}>{errors.startDate}</small>}
        </div>
        <div className="form-group">
          <label>End Date *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <small style={{ color: 'var(--danger)' }}>{errors.endDate}</small>}
        </div>
      </div>

      <div className="form-group" style={{ maxWidth: '200px' }}>
        <label>Price ($) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="0.00"
        />
        {errors.price && <small style={{ color: 'var(--danger)' }}>{errors.price}</small>}
      </div>

      <div className="btn-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Package' : 'Add Package'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PackageForm;
