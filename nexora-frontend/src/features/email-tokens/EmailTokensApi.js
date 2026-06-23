import { url } from "../../components/common/api";

const userToken = localStorage.getItem('userToken' || 'token');

// ✅ Corrected function to save email token
export async function saveEmailToken({ companyId, email, accessToken, refreshToken }) {
  const res = await fetch(`${url}/email-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ companyId, email, accessToken, refreshToken }),
  });
  return res.json();
}

// ✅ Function to get email token
export async function getEmailToken(companyId, email) {
  const res = await fetch(`${url}/email-tokens?companyId=${encodeURIComponent(companyId)}&email=${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  });
  return res.json();
}
