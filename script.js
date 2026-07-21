// ── Firebase ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCyndkr4Hd40UsqlW71yblEEV7ebezVNOc",
  authDomain: "bazarpk-bfe07.firebaseapp.com",
  projectId: "bazarpk-bfe07",
  storageBucket: "bazarpk-bfe07.firebasestorage.app",
  messagingSenderId: "504369900906",
  appId: "1:504369900906:web:db1e16d72cd58121678913"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentPkg = '';

function openModal(pkgLabel, pkgKey) {
  currentPkg = pkgLabel;
  document.getElementById('modalBadge').textContent = pkgKey === '' ? '🚀 Get Started' :
    pkgKey === 'basic' ? '⚡ Basic Package' :
    pkgKey === 'standard' ? '⭐ Standard Package' : '👑 Premium Package';
  document.getElementById('selectedPkgDisplay').textContent = '📦 Selected: ' + pkgLabel;
  document.getElementById('modalForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('submitBtn').textContent = '🚀 Send My Request';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  ['f_name','f_business','f_phone','f_email','f_message'].forEach(id => document.getElementById(id).value = '');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

async function sendEmail() {
  const name     = document.getElementById('f_name').value.trim();
  const business = document.getElementById('f_business').value.trim();
  const phone    = document.getElementById('f_phone').value.trim();
  const email    = document.getElementById('f_email').value.trim();
  const message  = document.getElementById('f_message').value.trim();

  if (!name || !business || !phone || !email) {
    alert('Please fill in all required fields (Name, Business Name, Phone, Email).');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';

  const lead = {
    name:          name,
    businessName:  business,
    phone:         phone,
    email:         email,
    package:       currentPkg,
    message:       message || 'No additional message provided.',
    status:        'new',
    createdAt:     firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('leads').add(lead);
    document.getElementById('modalForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = '🚀 Send My Request';
    alert('Something went wrong. Please try again or contact us on WhatsApp.');
  }
}

// Scroll animations
const obs = new IntersectionObserver(els => {
  els.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.1});
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));