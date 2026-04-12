import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import InstructorsPage from './pages/InstructorsPage';
import ClassesPage from './pages/ClassesPage';
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;