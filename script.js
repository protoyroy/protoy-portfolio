const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const label = document.querySelector('.theme-label');
const icon = document.querySelector('.theme-icon');

function applyTheme(theme){
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  root.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);

  const isDark = selectedTheme === 'dark';
  if (icon) icon.textContent = isDark ? '🔆' : '🌙';
  if (label) label.textContent = isDark ? 'Light' : 'Dark';
  if (toggle){
    const text = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', text);
    toggle.setAttribute('title', text);
  }
}

// First visit opens in light mode. Existing visitors keep their saved choice.
applyTheme(localStorage.getItem('theme') || 'light');

if (toggle){
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('#navLinks');
menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', open ? 'true' : 'false');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const portraitButton = document.querySelector('.portrait-button');
const profileModal = document.querySelector('#profileModal');
const closeProfileButtons = document.querySelectorAll('[data-close-profile]');
function openProfileModal(){
  profileModal.classList.add('open');
  profileModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeProfileModal(){
  profileModal.classList.remove('open');
  profileModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
if(portraitButton && profileModal){
  portraitButton.addEventListener('click', (e) => {
    const touchLike = window.matchMedia('(hover: none)').matches;
    if (touchLike) {
      e.preventDefault();
      portraitButton.classList.toggle('active');
      return;
    }
    openProfileModal();
  });
  portraitButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProfileModal(); }
  });
  closeProfileButtons.forEach(btn => btn.addEventListener('click', closeProfileModal));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeProfileModal(); });
}

const imageButtons = document.querySelectorAll('.image-open');
const imageModal = document.querySelector('#imageModal');
const imageModalImg = document.querySelector('#imageModalImg');
const imageModalTitle = document.querySelector('#imageModalTitle');
const imageModalDesc = document.querySelector('#imageModalDesc');
const closeImageButtons = document.querySelectorAll('[data-close-image]');
function openImageModal(button){
  if(!imageModal || !imageModalImg || !imageModalTitle) return;
  imageModalImg.src = button.dataset.image || '';
  imageModalImg.alt = button.dataset.title || 'Project screenshot preview';
  imageModalTitle.textContent = button.dataset.title || 'Project screenshot preview';
  if(imageModalDesc) imageModalDesc.textContent = button.dataset.desc || 'Screenshot included as supporting evidence for the project workflow and analytical interface.';
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeImageModal(){
  if(!imageModal) return;
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden','true');
  imageModalImg.src='';
  if(imageModalDesc) imageModalDesc.textContent='';
  if(!profileModal.classList.contains('open')) document.body.style.overflow='';
}
imageButtons.forEach(btn => btn.addEventListener('click', () => openImageModal(btn)));
closeImageButtons.forEach(btn => btn.addEventListener('click', closeImageModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeImageModal(); });


// On mobile, tapping outside the portrait closes the preview overlay.
document.addEventListener('click', (e) => {
  if (!portraitButton) return;
  if (!window.matchMedia('(hover: none)').matches) return;
  if (!portraitButton.contains(e.target)) portraitButton.classList.remove('active');
});

// v8: role-based HouseBoard modal with grouped screenshots and concise descriptions.
const roleData = {
  member: {
    eyebrow: 'HouseBoard · Member View',
    title: 'Member dashboard, payments and messaging',
    desc: 'The member side focuses on day-to-day shared-house tasks: personal dashboard, grocery/payment status, receipts and direct or group messaging.',
    images: ['assets/houseboard-member-dashboard.png','assets/houseboard-member-payments.png','assets/houseboard-member-messages.png'],
    points: ['Personal bills, grocery shares and cleaning tasks stay separated from admin controls.', 'Payment receipts and confirmations support clearer household records.', 'Direct and group chat keeps household communication inside the same platform.']
  },
  admin: {
    eyebrow: 'HouseBoard · Admin View',
    title: 'Admin control centre for household operations',
    desc: 'The admin side brings operational control into one interface, including bills, grocery submissions, rosters, member access, announcements, concerns and audit-style follow-up.',
    images: ['assets/houseboard-admin-dashboard.png','assets/houseboard-admin-operations.png'],
    points: ['Role-based admin dashboard for bills, groceries, rosters and announcements.', 'Action audit and pending task areas support follow-up and accountability.', 'Designed for practical household administration rather than a generic demo screen.']
  },
  owner: {
    eyebrow: 'HouseBoard · Owner View',
    title: 'Owner dashboard and document visibility',
    desc: 'The owner view provides a read-focused property overview, payment summaries, resident stay information and document access without mixing owner controls with resident tasks.',
    images: ['assets/houseboard-owner-dashboard.png','assets/houseboard-owner-documents.png'],
    points: ['Owner dashboard separates property-level records from daily resident workflows.', 'Payment graph and summaries support quick review of paid and due amounts.', 'Resident stay periods and owner/admin documents are organised for easier reference.']
  },
  login: {
    eyebrow: 'HouseBoard · Secure Access',
    title: 'Clean sign-in and account access flow',
    desc: 'The login screen keeps the product entry point simple and professional, with controlled access for approved HouseBoard users.',
    images: ['assets/houseboard-login.png'],
    points: ['Minimal login screen focused on approved users.', 'Forgot-password and access-request paths are visible without crowding the page.', 'Consistent HouseBoard branding across public and internal screens.']
  }
};
const roleButtons = document.querySelectorAll('.role-open');
const roleModal = document.querySelector('#roleModal');
const roleMainImg = document.querySelector('#roleMainImg');
const roleThumbs = document.querySelector('#roleThumbs');
const roleEyebrow = document.querySelector('#roleEyebrow');
const roleTitle = document.querySelector('#roleTitle');
const roleDesc = document.querySelector('#roleDesc');
const rolePoints = document.querySelector('#rolePoints');
const closeRoleButtons = document.querySelectorAll('[data-close-role]');
function setRoleImage(src){
  if(!roleMainImg) return;
  roleMainImg.src = src;
  roleMainImg.alt = roleTitle ? roleTitle.textContent + ' screenshot' : 'HouseBoard screenshot';
  if(roleThumbs){
    [...roleThumbs.querySelectorAll('button')].forEach(btn => btn.classList.toggle('active', btn.dataset.src === src));
  }
}
function openRoleModal(role){
  const data = roleData[role];
  if(!data || !roleModal) return;
  roleEyebrow.textContent = data.eyebrow;
  roleTitle.textContent = data.title;
  roleDesc.textContent = data.desc;
  rolePoints.innerHTML = data.points.map(point => `<li>${point}</li>`).join('');
  roleThumbs.innerHTML = data.images.map((src, index) => `<button type="button" data-src="${src}" aria-label="Open screenshot ${index+1}"><img src="${src}" alt="${data.title} screenshot ${index+1}"></button>`).join('');
  roleThumbs.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => setRoleImage(btn.dataset.src)));
  setRoleImage(data.images[0]);
  roleModal.classList.add('open');
  roleModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeRoleModal(){
  if(!roleModal) return;
  roleModal.classList.remove('open');
  roleModal.setAttribute('aria-hidden','true');
  if(!imageModal?.classList.contains('open') && !profileModal?.classList.contains('open')) document.body.style.overflow='';
}
roleButtons.forEach(btn => btn.addEventListener('click', () => openRoleModal(btn.dataset.role)));
closeRoleButtons.forEach(btn => btn.addEventListener('click', closeRoleModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeRoleModal(); });

// v9: reliable back-to-top for local preview and deployed hosting.
const backButtons = document.querySelectorAll('.back-to-top, .footer-back-to-top, a[href="#top"]');
function scrollToTopReliable(){
  const scrollingElement = document.scrollingElement || document.documentElement;
  try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch(e) { window.scrollTo(0, 0); }
  try { scrollingElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch(e) { scrollingElement.scrollTop = 0; }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  setTimeout(() => {
    window.scrollTo(0, 0);
    scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 250);
}
backButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToTopReliable();
  });
});
const floatingBackTop = document.querySelector('.back-to-top');
function updateBackTop(){
  if(!floatingBackTop) return;
  floatingBackTop.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', updateBackTop, { passive: true });
updateBackTop();
