import { useState, useEffect, useCallback } from 'react';
import ClassForm from '../components/Class/ClassForm';
import ClassList from '../components/Class/ClassList';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  toggleClassPublish,
} from '../services/api';
import type { IClass, ClassFormData, ConflictCheckResponse, AlertMessage } from '../types';

const ClassesPage = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [conflicts, setConflicts] = useState<ConflictCheckResponse | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      setClasses(data);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load classes' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData: ClassFormData) => {
    try {
      setConflicts(null);
      const data = await createClass(formData);
      setMessage({ type: 'success', text: data.message });
      setShowForm(false);
      load();
    } catch (err) {
      const apiErr = err as { status?: number; message?: string } & Partial<ConflictCheckResponse>;
      if (apiErr.status === 409) {
        setConflicts(apiErr as ConflictCheckResponse);
        setMessage({ type: 'warning', text: 'Schedule conflict detected. Please choose a different time.' });
      } else {
        setMessage({ type: 'danger', text: apiErr.message || 'Failed to create class' });
      }
    }
  };

  const handleUpdate = async (formData: ClassFormData) => {
    if (!editing) return;
    try {
      setConflicts(null);
      await updateClass(editing._id, formData);
      setMessage({ type: 'success', text: 'Class updated successfully' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err) {
      const apiErr = err as { status?: number; message?: string } & Partial<ConflictCheckResponse>;
      if (apiErr.status === 409) {
        setConflicts(apiErr as ConflictCheckResponse);
        setMessage({ type: 'warning', text: 'Schedule conflict detected.' });
      } else {
        setMessage({ type: 'danger', text: apiErr.message || 'Failed to update class' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await deleteClass(id);
      setMessage({ type: 'success', text: 'Class deleted' });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete class' });
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const data = await toggleClassPublish(id);
      setMessage({ type: 'success', text: data.message });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to update publish status' });
    }
  };

  const openForm = () => {
    setShowForm(true);
    setEditing(null);
    setConflicts(null);
    setMessage(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setConflicts(null);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Class Schedule</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={openForm}>+ Add Class</button>
          )}
        </div>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        {showForm ? (
          <ClassForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={closeForm}
            conflicts={conflicts}
          />
        ) : (
          <ClassList
            classes={classes}
            onEdit={(cls) => { setEditing(cls); setShowForm(true); setConflicts(null); setMessage(null); }}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ClassesPage;