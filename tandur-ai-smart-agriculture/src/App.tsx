import { useState } from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Tandur AI Smart Agriculture</h1>
          <nav>
            <ul className="nav-links">
              <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Beranda</li>
              <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
              <li className={activeTab === 'monitoring' ? 'active' : ''} onClick={() => setActiveTab('monitoring')}>Monitoring</li>
              <li className={activeTab === 'analysis' ? 'active' : ''} onClick={() => setActiveTab('analysis')}>Analisis</li>
              <li className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Tentang</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {activeTab === 'home' && (
            <section className="hero">
              <h2>Selamat Datang di Tandur AI</h2>
              <p>Solusi pertanian cerdas berbasis AI untuk hasil panen yang optimal</p>
              <button className="cta-button">Mulai Monitoring</button>
            </section>
          )}
          
          {activeTab === 'monitoring' && (
            <section>
              <h2>Monitoring Pertanian</h2>
              <p>Halaman monitoring akan menampilkan data real-time dari sensor pertanian Anda.</p>
            </section>
          )}
          
          {activeTab === 'analysis' && (
            <section>
              <h2>Analisis Data</h2>
              <p>Analisis data pertanian Anda untuk pengambilan keputusan yang lebih baik.</p>
            </section>
          )}
          
          {activeTab === 'about' && (
            <section>
              <h2>Tentang Kami</h2>
              <p>Tandur AI adalah platform pertanian cerdas yang membantu petani meningkatkan hasil panen melalui teknologi AI.</p>
            </section>
          )}
          
          {activeTab === 'dashboard' && <DashboardPage />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Tandur AI Smart Agriculture. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
