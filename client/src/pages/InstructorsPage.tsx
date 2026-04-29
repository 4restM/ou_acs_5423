import { useState, useEffect, useCallback } from 'react';
import InstructorForm from '../components/Instructor/InstructorForm';
import InstructorList from '../components/Instructor/InstructorList';
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../services/api';
import type { IInstructor, InstructorFormData, AlertMessage } from '../types';

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IInstructor | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInstructors();
      setInstructors(data);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load instructors' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData: InstructorFormData) => {
    try {
      const data = await createInstructor(formData);
      setMessage({ type: 'success', text: data.confirmationMessage });
      setShowForm(false);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create instructor';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleUpdate = async (formData: InstructorFormData) => {
    if (!editing) return;
    try {
      await updateInstructor(editing._id, formData);
      setMessage({ type: 'success', text: 'Instructor updated successfully' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update instructor';
      setMessage({ type: 'danger', text: msg });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await deleteInstructor(id);
      setMessage({ type: 'success', text: 'Instructor deleted' });
      load();
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete instructor' });
    }
  };

  const handleEdit = (instructor: IInstructor) => {
    setEditing(instructor);
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
          <h2>Instructors</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => { setShowForm(true); setEditing(null); setMessage(null); }}
            >
              + Add Instructor
            </button>
          )}
        </div>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        {showForm ? (
          <InstructorForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={handleCancel}
          />
        ) : (
          <InstructorList
            instructors={instructors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default InstructorsPage;