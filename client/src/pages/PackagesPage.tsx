import { useState, useEffect, useCallback } from 'react';
import PackageForm from '../components/Package/PackageForm';
import PackageList from '../components/Package/PackageList';
import { getPackages, createPackage, updatePackage, deletePackage } from '../services/api';
import type { IPackage, PackageFormData, AlertMessage } from '../types';

const PackagesPage = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IPackage | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load packages' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData: PackageFormData) => {
    try {
      const data = await createPackage(formData);
      setMessage({ type: 'success', text: data.confirmationMessage });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create package';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleUpdate = async (formData: PackageFormData) => {
    if (!editing) return;
    try {
      await updatePackage(editing._id, formData);
      setMessage({ type: 'success', text: 'Package updated successfully' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update package';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await deletePackage(id);
      setMessage({ type: 'success', text: 'Package deleted' });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete package' });
    }
  };

  const handleEdit = (pkg: IPackage) => {
    setEditing(pkg);
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
          <h2>Packages</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => { setShowForm(true); setEditing(null); setMessage(null); }}
            >
              + Add Package
            </button>
          )}
        </div>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        {showForm ? (
          <PackageForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={handleCancel}
          />
        ) : (
          <PackageList
            packages={packages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
