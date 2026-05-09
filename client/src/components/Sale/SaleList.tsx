import type { ISale } from '../../types';

// this interface defines the props for the SaleList component, which includes an array of sales, a function to handle deletion of a sale, and a loading state.
interface Props {
  sales: ISale[];
  onDelete: (id: string) => void;
  loading: boolean;
}

// this component renders a table of sales transactions, displaying details about the customer, package, payment, and validity period of each sale. It also includes a delete button for each sale.
const SaleList = ({ sales, onDelete, loading }: Props) => {
  if (loading) return <div className="loading">Loading sales...</div>;

  if (sales.length === 0) {
    return (
      <div className="empty-state">
        <h3>No sales recorded yet</h3>
        <p>Record your first sale to get started.</p>
      </div>
    );
  }

  // this function formats a date string into a more readable format for display in the table.
  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  // this function formats the number of classes awarded for display, showing "Unlimited" if the number is 9999 or more, or the actual number otherwise.
  const displayClasses = (awarded: number) => (awarded >= 9999 ? 'Unlimited' : String(awarded));

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Customer</th>
            <th>Package</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Payment Date</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Classes</th>
            <th>Balance After</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>
                <strong>{s.saleId}</strong>
              </td>
              <td>
                {s.customer.fullName}
                <br />
                <small>{s.customer.customerId}</small>
              </td>
              <td>
                {s.package.packageName}
                <br />
                <small>{s.package.packageId}</small>
              </td>
              <td>${s.amount.toFixed(2)}</td>
              <td>
                <span className="badge badge-general">{s.paymentMethod}</span>
              </td>
              <td>{formatDate(s.paymentDate)}</td>
              <td>{formatDate(s.validityStart)}</td>
              <td>{formatDate(s.validityEnd)}</td>
              <td>{displayClasses(s.classesAwarded)}</td>
              <td>{s.customer.classBalance >= 9999 ? 'Unlimited' : s.customer.classBalance}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(s._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SaleList;
