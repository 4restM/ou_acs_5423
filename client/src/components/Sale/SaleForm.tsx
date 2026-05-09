import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { getCustomers, getPackages } from '../../services/api';
import type { ICustomer, IPackage, SaleFormData, PaymentMethod } from '../../types';

// this interface's on submit is async because the parent component will handle the API call and we want to show a loading state while it's processing.
interface Props {
  onSubmit: (data: SaleFormData) => Promise<void>;
  onCancel?: () => void;
}

// This removes the time portion from the current date
const today = new Date().toISOString().split('T')[0];

const emptyForm: SaleFormData = {
  customer: '',
  package: '',
  amount: 0,
  paymentMethod: '',
  validityStart: '',
  validityEnd: '',
};

// this component renders a form for recording a sale, with fields for selecting a customer and package, 
// entering payment details, and specifying the validity period of the package. 
// It also includes validation and dynamically displays package details when a package is selected.
const SaleForm = ({ onSubmit, onCancel }: Props) => {
  // state for form data, list of customers and packages, selected package details, form errors, and loading state
  const [formData, setFormData] = useState<SaleFormData>(emptyForm);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // this effect loads customers and packages from the API when the component mounts, and populates the corresponding state variables.
  useEffect(() => {
    Promise.all([getCustomers(), getPackages()]).then(([c, p]) => {
      setCustomers(c);
      setPackages(p);
    });
  }, []);

  // this function handles changes to all form fields, updating the form data state and clearing any existing errors for that field.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'package') {
      const pkg = packages.find((p) => p._id === value) ?? null;
      setSelectedPackage(pkg);
      setFormData((prev) => ({
        ...prev,
        package: value,
        amount: pkg ? pkg.price : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // this function validates the form data, checking for required fields and logical consistency (e.g. end date must be after start date). 
  // It sets error messages for any invalid fields and returns a boolean indicating whether the form is valid.
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.customer) errs.customer = 'Customer is required';
    if (!formData.package) errs.package = 'Package is required';
    if (!formData.paymentMethod) errs.paymentMethod = 'Payment method is required';
    if (!formData.amount) errs.amount = 'Amount is required';
    if (!formData.validityStart) errs.validityStart = 'Validity start date is required';
    if (!formData.validityEnd) errs.validityEnd = 'Validity end date is required';

    if (
      formData.validityStart &&
      formData.validityEnd &&
      formData.validityEnd <= formData.validityStart
    ) {
      errs.validityEnd = 'Validity end date must be after validity start date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // this function handles form submission, validating the form data and then calling the onSubmit prop with the form data if valid. It also manages the loading state while the submission is being processed.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({ ...formData, paymentMethod: formData.paymentMethod as PaymentMethod });
    } finally {
      setLoading(false);
    }
  };

  // this function formats the number of classes for display, showing "Unlimited" if the package has unlimited classes, or the number otherwise.
  const displayClasses = (pkg: IPackage) =>
    pkg.numberOfClasses === 'unlimited' ? 'Unlimited' : String(pkg.numberOfClasses);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="customer">Customer *</label>
          <select id="customer" name="customer" value={formData.customer} onChange={handleChange}>
            <option value="">— Select customer —</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.fullName} ({c.customerId})
              </option>
            ))}
          </select>
          {errors.customer && (
            <small style={{ color: 'var(--danger)' }}>{errors.customer}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="package">Package *</label>
          <select id="package" name="package" value={formData.package} onChange={handleChange}>
            <option value="">— Select package —</option>
            {packages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.packageName} ({p.packageId}) — ${p.price}
              </option>
            ))}
          </select>
          {errors.package && (
            <small style={{ color: 'var(--danger)' }}>{errors.package}</small>
          )}
        </div>
      </div>
      {/* This section displays details of the selected package */}
      {selectedPackage && (
        <div className="form-row">
          <div className="form-group">
            <label>Package Type</label>
            <input type="text" value={selectedPackage.classType} readOnly disabled />
          </div>
          <div className="form-group">
            <label>Classes Included</label>
            <input
              type="text"
              value={displayClasses(selectedPackage)}
              readOnly
              disabled
            />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount Paid ($) *</label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          {errors.amount && (
            <small style={{ color: 'var(--danger)' }}>{errors.amount}</small>
          )}
          {selectedPackage && (
            <small style={{ color: 'var(--text-muted)' }}>
              Package rate: ${selectedPackage.price}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method *</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">— Select method —</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="check">Check</option>
          </select>
          {errors.paymentMethod && (
            <small style={{ color: 'var(--danger)' }}>{errors.paymentMethod}</small>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Payment Date</label>
        <input type="text" value={today} readOnly disabled />
        <small style={{ color: 'var(--text-muted)' }}>Recorded as today's date</small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="validityStart">Validity Start *</label>
          <input
            id="validityStart"
            type="date"
            name="validityStart"
            value={formData.validityStart}
            onChange={handleChange}
            min={today}
          />
          {errors.validityStart && (
            <small style={{ color: 'var(--danger)' }}>{errors.validityStart}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="validityEnd">Validity End *</label>
          <input
            id="validityEnd"
            type="date"
            name="validityEnd"
            value={formData.validityEnd}
            onChange={handleChange}
            min={formData.validityStart || today}
          />
          {errors.validityEnd && (
            <small style={{ color: 'var(--danger)' }}>{errors.validityEnd}</small>
          )}
        </div>
      </div>

      {selectedPackage && (
        <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
          Package valid from {new Date(selectedPackage.startDate).toLocaleDateString()} to{' '}
          {new Date(selectedPackage.endDate).toLocaleDateString()}
        </small>
      )}

      <div className="btn-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Record Sale'}
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

export default SaleForm;
