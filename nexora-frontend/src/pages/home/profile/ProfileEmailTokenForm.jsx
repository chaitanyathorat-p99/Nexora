import React, { useState, useRef } from 'react';
import { Button, Alert, message } from 'antd';
import { saveEmailToken } from '../../../features/email-tokens/EmailTokensApi';

// IMPORTANT: Add this to your public/index.html in <head>:
// <script src="https://accounts.google.com/gsi/client" async defer></script>

const CLIENT_ID = '748664710229-fg02ban512nnusjjalrq77g3foc3nts2.apps.googleusercontent.com';
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

export default function ProfileEmailTokenForm({ user }) {
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const companyId = user?.companyMaster?._id || '';
  const emailInputRef = useRef();

  // Handler for Google OAuth with GIS
  const handleGoogleAuth = () => {
    setApiError(null);
    setSuccess(false);
    setLoading(true);
    console.log('Starting Google OAuth flow...');
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setApiError('Google Identity Services not loaded.');
      setLoading(false);
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: GMAIL_SCOPE,
      prompt: 'consent',
      callback: (response) => {
        console.log('Google OAuth response:', response);
        if (response && response.access_token) {
          setAccessToken(response.access_token);
          message.success('Google access token obtained!');
        } else {
          setApiError('Failed to authenticate with Google.');
        }
        setLoading(false);
      },
    });
    tokenClient.requestAccessToken();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccess(false);
    console.log('Submitting token:', { companyId, email, accessToken });
    if (!email || !accessToken) {
      setApiError('Please enter an email and generate a Google token.');
      return;
    }
    try {
      const res = await saveEmailToken({ companyId, email, accessToken });
      console.log('API response:', res);
      if (res.success) {
        setSuccess(true);
        setAccessToken('');
        setEmail('');
      } else {
        setApiError('Failed to save token');
      }
    } catch (err) {
      setApiError('Failed to save token');
      console.error('API error:', err);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect Google Email for Company</h3>
      {apiError && (
        <Alert
          message="Error"
          description={apiError}
          type="error"
          showIcon
          closable
          className="mb-4"
          onClose={() => setApiError(null)}
        />
      )}
      {success && (
        <Alert
          message="Success"
          description="Token saved successfully!"
          type="success"
          showIcon
          closable
          className="mb-4"
          onClose={() => setSuccess(false)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Company ID</label>
            <input value={companyId} disabled className="block w-full border rounded px-2 py-1 bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <input
              ref={emailInputRef}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full border rounded px-2 py-1"
              required
              type="email"
            />
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <Button
              type="primary"
              loading={loading}
              onClick={e => {
                e.preventDefault();
                if (!email) {
                  setApiError('Please enter an email first.');
                  return;
                }
                handleGoogleAuth();
              }}
              disabled={loading || !email}
            >
              {accessToken ? 'Token Ready' : 'Generate Google Token'}
            </Button>
            {accessToken && <span className="text-green-600">Token ready for submission</span>}
          </div>
        </div>
        <input type="hidden" value={accessToken} />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="primary"
            htmlType="submit"
            disabled={!accessToken || !email}
          >
            Save Token
          </Button>
        </div>
      </form>
    </div>
  );
} 