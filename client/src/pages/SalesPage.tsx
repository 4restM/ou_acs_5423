import { useState, useEffect, useCallback } from 'react';
import SaleForm from '../components/Sale/SaleForm';
import SaleList from '../components/Sale/SaleList';
import { getSales, createSale, deleteSale } from '../services/api';
import type { ISale, SaleFormData, AlertMessage } from '../types';

const SalesPage = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load sales' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (formData: SaleFormData) => {
    try {
      const data = await createSale(formData);
      setMessage({ type: 'success', text: data.confirmationMessage });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: 'danger', text: apiErr.message ?? 'Failed to record sale' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this sale? The customer\'s class balance will be reduced.')) return;
    try {
      await deleteSale(id);
      setMessage({ type: 'success', text: 'Sale deleted and class balance updated' });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete sale' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Sales</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(true);
                setMessage(null);
              }}
            >
              + Record Sale
            </button>
          )}
        </div>
        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}
        {showForm ? (
          <SaleForm onSubmit={handleCreate} onCancel={handleCancel} />
        ) : (
          <SaleList sales={sales} onDelete={handleDelete} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default SalesPage;
