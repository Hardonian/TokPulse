import React from 'react';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>TikTok Creator Portal</h1>
        <div style={{ background: '#eee', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          Earnings: $1,240.50
        </div>
      </header>
      <main style={{ marginTop: '2rem' }}>
        <section>
          <h2>Trending Products to Promote</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div
              style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', flex: 1 }}
            >
              <h3>Wireless Earbuds</h3>
              <p>Commission: 15%</p>
              <button
                style={{
                  background: '#000',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Generate Affiliate Link
              </button>
            </div>
            <div
              style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', flex: 1 }}
            >
              <h3>LED Ring Light</h3>
              <p>Commission: 10%</p>
              <button
                style={{
                  background: '#000',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Generate Affiliate Link
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
