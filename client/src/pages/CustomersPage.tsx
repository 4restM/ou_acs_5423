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

// this page component manages the state and logic for displaying, creating, updating, and deleting customers. It uses the CustomerForm and CustomerList components to render the UI, and interacts with the API to perform CRUD operations on customers. 
// It also handles loading state and displays success or error messages based on API responses.
const CustomersPage = () => {
  // state for customers, loading state, form visibility, currently editing customer, and alert messages
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ICustomer | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  // this function loads customers from the API and handles loading state and errors.
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

  // this effect runs once on mount to load customers
  useEffect(() => { load(); }, [load]);

  // this function creates a new customer and handles success and error messages.
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

  // this function updates a customer and handles success and error messages.
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
 
  // this function deletes a customer after confirming with the user, and handles success and error messages.
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

  // this function sets the currently editing customer and shows the form when the edit button is clicked.
  const handleEdit = (customer: ICustomer) => {
    setEditing(customer);
    setShowForm(true);
    setMessage(null);
  };

  // this function handles the form submission, including validation and checking for duplicate names before calling the onSubmit prop.
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
