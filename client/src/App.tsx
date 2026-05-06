import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import InstructorsPage from './pages/InstructorsPage';
import ClassesPage from './pages/ClassesPage';
import PackagesPage from './pages/PackagesPage';
import CustomersPage from './pages/CustomersPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;