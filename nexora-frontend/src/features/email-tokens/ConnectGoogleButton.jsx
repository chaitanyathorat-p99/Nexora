import React, { useState } from 'react';
import { url } from '../../components/common/api';

export default function ConnectGoogleButton({ companyId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  console.log('ConnectGoogleButton rendered with companyId:', companyId);
  const handleConnect = async () => {
    setLoading(true);
    setError('');
    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${url}/emails/google-auth-url?companyId=${companyId}&email=${encodeURIComponent(email)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to get Google OAuth URL');
      const data = await res.json();
      if (!data.url) throw new Error('No URL returned from backend');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'Failed to connect Google');
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: '8px', marginRight: '8px', borderRadius: 4, border: '1px solid #ccc' }}
        disabled={loading}
      />
      <button onClick={handleConnect} disabled={loading} style={{ padding: '8px 16px', background: '#4285F4', color: 'white', border: 'none', borderRadius: 4 }}>
        {loading ? 'Connecting...' : 'Connect Google'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
} 