import type { IPackage } from '../../types';

// this interface defines the props for the PackageList component, which displays a list of packages in a table format. It includes handlers for editing and deleting packages, as well as a loading state.
interface Props {
  packages: IPackage[];
  onEdit: (pkg: IPackage) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const PackageList = ({ packages, onEdit, onDelete, loading }: Props) => {
  if (loading) return <div className="loading">Loading packages...</div>;

  if (packages.length === 0) {
    return (
      <div className="empty-state">
        <h3>No packages yet</h3>
        <p>Add your first package to get started.</p>
      </div>
    );
  }

  // this table displays all the packages with their details and action buttons.
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Package Name</th>
            <th>Category</th>
            <th>Classes</th>
            <th>Class Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td><strong>{pkg.packageId}</strong></td>
              <td>{pkg.packageName}</td>
              <td>
                <span className={`badge badge-${pkg.category === 'General' ? 'general' : 'special'}`}>
                  {pkg.category}
                </span>
              </td>
              <td>{pkg.numberOfClasses === 'unlimited' ? 'Unlimited' : pkg.numberOfClasses}</td>
              <td>
                <span className={`badge badge-${pkg.classType === 'General' ? 'general' : 'special'}`}>
                  {pkg.classType}
                </span>
              </td>
              <td>{new Date(pkg.startDate).toLocaleDateString()}</td>
              <td>{new Date(pkg.endDate).toLocaleDateString()}</td>
              <td>${pkg.price.toFixed(2)}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => onEdit(pkg)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(pkg._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageList;
