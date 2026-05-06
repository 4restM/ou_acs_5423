import type { ICustomer } from '../../types';

interface Props {
  customers: ICustomer[];
  onEdit: (customer: ICustomer) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const CustomerList = ({ customers, onEdit, onDelete, loading }: Props) => {
  if (loading) return <div className="loading">Loading customers...</div>;

  if (customers.length === 0) {
    return (
      <div className="empty-state">
        <h3>No customers yet</h3>
        <p>Add your first customer to get started.</p>
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
            <th>Class Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td><strong>{c.customerId}</strong></td>
              <td>{c.firstName} {c.lastName}</td>
              <td>{c.phone || '—'}</td>
              <td>{c.email || '—'}</td>
              <td>
                <span className={`badge badge-${c.preferredCommunication === 'email' ? 'general' : 'special'}`}>
                  {c.preferredCommunication}
                </span>
              </td>
              <td>{c.classBalance}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => onEdit(c)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(c._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
