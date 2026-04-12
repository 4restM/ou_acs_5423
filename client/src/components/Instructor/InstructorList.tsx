import type { IInstructor } from '../../types';

interface Props {
  instructors: IInstructor[];
  onEdit: (instructor: IInstructor) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const InstructorList = ({ instructors, onEdit, onDelete, loading }: Props) => {
  if (loading) return <div className="loading">Loading instructors...</div>;

  if (instructors.length === 0) {
    return (
      <div className="empty-state">
        <h3>No instructors yet</h3>
        <p>Add your first instructor to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Preferred Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((inst) => (
            <tr key={inst._id}>
              <td><strong>{inst._id}</strong></td>
              <td>{inst.firstName} {inst.lastName}</td>
              <td>{inst.phone || '—'}</td>
              <td>{inst.email || '—'}</td>
              <td>
                <span className={`badge badge-${inst.preferredCommunication === 'email' ? 'general' : 'special'}`}>
                  {inst.preferredCommunication}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => onEdit(inst)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(inst._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorList;
