import { useEffect, useState } from 'react';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setApiStatus(data.status === 'ok' ? 'connected' : 'error'))
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textAlign: 'center',
        padding: '40px',
      }}
    >
      <h1 style={{ fontSize: '52px', letterSpacing: '6px' }}>AURELIA</h1>
      <p style={{ letterSpacing: '10px', color: 'var(--color-muted)', margin: 0 }}>
        DIAMONDS
      </p>
      <p style={{ marginTop: '24px', color: 'var(--color-muted)' }}>
        API: {apiStatus}
      </p>
    </main>
  );
}
