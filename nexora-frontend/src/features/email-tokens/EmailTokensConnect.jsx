import React, { useState } from 'react';
import { saveEmailToken } from './EmailTokensApi';

export default function EmailTokensConnect() {
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveEmailToken({ companyId, email, accessToken, refreshToken });
    setSuccess(true);
  };

  return (
    <div>
      <h2>Connect Google Email for Company</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company ID:</label>
          <input value={companyId} onChange={e => setCompanyId(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Access Token:</label>
          <input value={accessToken} onChange={e => setAccessToken(e.target.value)} required />
        </div>
        <div>
          <label>Refresh Token:</label>
          <input value={refreshToken} onChange={e => setRefreshToken(e.target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>
      {success && <div>Token saved successfully!</div>}
    </div>
  );
} 