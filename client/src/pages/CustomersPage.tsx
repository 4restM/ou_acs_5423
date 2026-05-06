import { useState, useEffect, useCallback } from 'react';
import CustomerForm from '../components/Customer/CustomerForm';
import CustomerList from '../components/Customer/CustomerList';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/api';
import type { ICustomer, CustomerFormData, AlertMessage } from '../types';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ICustomer | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load customers' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData: CustomerFormData) => {
    try {
      const data = await createCustomer(formData);
      setMessage({ type: 'success', text: data.confirmationMessage });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create customer';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleUpdate = async (formData: CustomerFormData) => {
    if (!editing) return;
    try {
      await updateCustomer(editing._id, formData);
      setMessage({ type: 'success', text: 'Customer updated successfully' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update customer';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setMessage({ type: 'success', text: 'Customer deleted' });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete customer' });
    }
  };

  const handleEdit = (customer: ICustomer) => {
    setEditing(customer);
    setShowForm(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Customers</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => { setShowForm(true); setEditing(null); setMessage(null); }}
            >
              + Add Customer
            </button>
          )}
        </div>
        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}
        {showForm ? (
          <CustomerForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={handleCancel}
          />
        ) : (
          <CustomerList
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
