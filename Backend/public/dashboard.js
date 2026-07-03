let jwtToken = localStorage.getItem('partner_token') || null;
let currentAdmin = JSON.parse(localStorage.getItem('partner_admin')) || null;

document.addEventListener('DOMContentLoaded', () => {
  if (jwtToken && currentAdmin) {
    showDashboard();
  } else {
    showAuth();
  }
});

function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.className = "flex-1 pb-3 text-center font-semibold text-indigo-400 border-b-2 border-indigo-500 transition";
    tabRegister.className = "flex-1 pb-3 text-center font-semibold text-slate-400 border-b-2 border-transparent transition";
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.className = "flex-1 pb-3 text-center font-semibold text-slate-400 border-b-2 border-transparent transition";
    tabRegister.className = "flex-1 pb-3 text-center font-semibold text-fuchsia-400 border-b-2 border-fuchsia-500 transition";
  }
}

function showAuth() {
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('authSection').classList.add('hidden');
  document.getElementById('dashboardSection').classList.remove('hidden');

  // Set header info
  document.getElementById('dashOrgName').textContent = currentAdmin.partnerIdentifier + " Admin Portal";
  document.getElementById('dashOrgId').textContent = `Partner Identifier: ${currentAdmin.partnerIdentifier}`;
  document.getElementById('adminUserEmail').textContent = currentAdmin.email;
  
  // Set role badge name
  const badge = document.getElementById('roleBadge');
  badge.textContent = currentAdmin.role;
  if (currentAdmin.role === 'owner') {
    badge.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30";
  } else {
    badge.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
  }

  fetchBalances();
  fetchPayments();
  fetchWithdrawals();
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      jwtToken = data.token;
      currentAdmin = data.admin;
      localStorage.setItem('partner_token', jwtToken);
      localStorage.setItem('partner_admin', JSON.stringify(currentAdmin));
      showDashboard();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server network error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const regId = document.getElementById('regId').value.toUpperCase();
  const regName = document.getElementById('regName').value;
  const regBankCode = document.getElementById('regBankCode').value;
  const regAccountNo = document.getElementById('regAccountNo').value;
  const regAccountName = document.getElementById('regAccountName').value;
  const regOwnerEmail = document.getElementById('regOwnerEmail').value;
  const regOwnerPassword = document.getElementById('regOwnerPassword').value;

  try {
    const res = await fetch('/api/admin/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerIdentifier: regId,
        partnerName: regName,
        bankCode: regBankCode,
        accountNumber: regAccountNo,
        accountName: regAccountName,
        ownerEmail: regOwnerEmail,
        ownerPassword: regOwnerPassword
      })
    });
    const data = await res.json();
    
    if (res.ok) {
      alert('Onboarding and registration completed successfully! Sign in to continue.');
      switchAuthTab('login');
    } else {
      alert(data.message || 'Onboarding failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server network error');
  }
}

function handleLogout() {
  jwtToken = null;
  currentAdmin = null;
  localStorage.removeItem('partner_token');
  localStorage.removeItem('partner_admin');
  showAuth();
}

async function fetchBalances() {
  try {
    const res = await fetch('/api/admin/partner/balance', {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('ledgerBal').textContent = `₦${parseFloat(data.ledgerBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      document.getElementById('gatewayBal').textContent = `₦${parseFloat(data.gatewayBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      document.getElementById('gatewayInfo').innerHTML = `<i class="fa-solid fa-network-wired"></i> ${data.gateway.toUpperCase()} sub-account: ${data.subAccountId}`;
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchPayments() {
  try {
    const res = await fetch('/api/admin/partner/payments', {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const data = await res.json();
    const tableBody = document.getElementById('paymentsTableBody');
    const placeholder = document.getElementById('paymentsPlaceholder');
    
    tableBody.innerHTML = '';
    
    if (res.ok && data.payments.length > 0) {
      placeholder.classList.add('hidden');
      data.payments.forEach(p => {
        const metadata = p.metadata || {};
        const payerLabel = p.payer_name || metadata.fullname || 'Student Payer';
        const dateString = new Date(p.created_at).toLocaleDateString();
        
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-900/40 transition duration-150";
        tr.innerHTML = `
          <td class="py-3.5 font-medium text-slate-200">
            <div>${payerLabel}</div>
            <div class="text-xs text-slate-500">${p.email}</div>
          </td>
          <td class="py-3.5 text-slate-300 font-mono text-xs">${p.receipt_no || 'N/A'}</td>
          <td class="py-3.5 text-emerald-400 font-semibold">₦${parseFloat(p.amount).toLocaleString()}</td>
          <td class="py-3.5 text-slate-400 text-xs">${dateString}</td>
          <td class="py-3.5">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Success</span>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } else {
      placeholder.classList.remove('hidden');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchWithdrawals() {
  try {
    const res = await fetch('/api/admin/partner/withdrawals', {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const data = await res.json();
    
    const appBody = document.getElementById('approvalsTableBody');
    const appPlaceholder = document.getElementById('approvalsPlaceholder');
    
    appBody.innerHTML = '';
    
    if (res.ok && data.withdrawals.length > 0) {
      appPlaceholder.classList.add('hidden');

      data.withdrawals.slice(0, 10).forEach(w => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-900/40 transition";

        tr.innerHTML = `
          <td class="py-3.5 font-mono text-xs text-slate-300">${w.merchant_tx_ref}</td>
          <td class="py-3.5 text-rose-400 font-semibold">₦${parseFloat(w.amount).toLocaleString()}</td>
          <td class="py-3.5 text-slate-400 text-xs">${w.initiated_by}</td>
          <td class="py-3.5 text-right">
            <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-700/30 text-slate-300 border border-slate-600/30">${w.status}</span>
          </td>
        `;
        appBody.appendChild(tr);
      });
    } else {
      appPlaceholder.classList.remove('hidden');
    }
  } catch (err) {
    console.error(err);
  }
}

async function verifyBankDetails() {
  const accountNumber = document.getElementById('bankAccountNo').value;
  const bankCode = document.getElementById('bankCode').value;
  const resultDiv = document.getElementById('lookupResult');

  if (!accountNumber || !bankCode) {
    alert('Please enter both Account Number and Bank Code first');
    return;
  }

  resultDiv.classList.remove('hidden');
  resultDiv.className = "text-xs py-2 px-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium";
  resultDiv.textContent = 'Resolving details...';

  try {
    const res = await fetch('/api/admin/partner/bank-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ accountNumber, bankCode })
    });
    const data = await res.json();
    
    if (res.ok) {
      resultDiv.className = "text-xs py-2 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium";
      resultDiv.textContent = `Resolved Name: ${data.accountName}`;
    } else {
      resultDiv.className = "text-xs py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium";
      resultDiv.textContent = data.message || 'Lookup failed';
    }
  } catch (err) {
    console.error(err);
    resultDiv.className = "text-xs py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium";
    resultDiv.textContent = 'Network lookup error';
  }
}

async function handleUpdateBankDetails(event) {
  event.preventDefault();
  const accountNumber = document.getElementById('bankAccountNo').value;
  const bankCode = document.getElementById('bankCode').value;

  try {
    const res = await fetch('/api/admin/partner/bank-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ accountNumber, bankCode })
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Bank account successfully updated & encrypted: ${data.accountName}`);
    } else {
      alert(data.message || 'Failed to update bank details');
    }
  } catch (err) {
    console.error(err);
    alert('Server network error');
  }
}

async function handleInitiateWithdrawal(event) {
  event.preventDefault();
  const amount = document.getElementById('withdrawAmount').value;

  try {
    const res = await fetch('/api/admin/partner/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      document.getElementById('withdrawAmount').value = '';
      fetchWithdrawals();
      fetchBalances();
    } else {
      alert(data.message || 'Failed to submit withdrawal');
    }
  } catch (err) {
    console.error(err);
    alert('Server network error');
  }
}

async function handleUpdateOwnerEmail(event) {
  event.preventDefault();
  const ownerEmail = document.getElementById('updateOwnerEmail').value;

  if (!ownerEmail) {
    alert('Please enter a new owner email address');
    return;
  }

  try {
    const res = await fetch('/api/admin/partner/update-owner-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ ownerEmail })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      document.getElementById('updateOwnerEmail').value = '';
    } else {
      alert(data.message || 'Update failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server network error');
  }
}
