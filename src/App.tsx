import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ReviewSession from './pages/ReviewSession';
import Import from './pages/Import';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">⚗️</span> 化学闪卡
          </Link>
          <div className="nav-links">
            <Link to="/review" className="nav-link">复习</Link>
            <Link to="/import" className="nav-link">导入</Link>
            <Link to="/settings" className="nav-link">设置</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/review" element={<ReviewSession />} />
            <Route path="/import" element={<Import />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
