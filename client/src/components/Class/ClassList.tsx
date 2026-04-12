import type { IClass } from '../../types';

interface Props {
  classes: IClass[];
  onEdit: (cls: IClass) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  loading: boolean;
}

const formatTime = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const ClassList = ({ classes, onEdit, onDelete, onTogglePublish, loading }: Props) => {
  if (loading) return <div className="loading">Loading classes...</div>;

  if (classes.length === 0) {
    return (
      <div className="empty-state">
        <h3>No classes scheduled</h3>
        <p>Add your first class to build the schedule.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Class</th>
            <th>Type</th>
            <th>Instructor</th>
            <th>Pay Rate</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => {
            const inst = typeof cls.instructor === 'object' ? cls.instructor : null;
            return (
              <tr key={cls._id}>
                <td><strong>{cls.dayOfWeek}</strong></td>
                <td>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</td>
                <td>{cls.className}</td>
                <td>
                  <span className={`badge badge-${cls.classType.toLowerCase()}`}>
                    {cls.classType}
                  </span>
                </td>
                <td>{inst ? `${inst.firstName} ${inst.lastName}` : '—'}</td>
                <td>${cls.payRate.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${cls.isPublished ? 'published' : 'draft'}`}>
                    {cls.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-success" onClick={() => onTogglePublish(cls._id)}>
                      {cls.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => onEdit(cls)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(cls._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClassList;
