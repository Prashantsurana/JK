/* ---------- Theme toggle ---------- */
var themeToggle = document.getElementById('themeToggle');
var root = document.documentElement;

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyTheme(t) {
  if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
  else root.removeAttribute('data-theme');
  var isDark = t === 'dark' || (!t && systemPrefersDark());
  themeToggle.classList.toggle('is-dark', isDark);
}
var savedTheme = null;
try { savedTheme = localStorage.getItem('jk-theme'); } catch (e) {}
applyTheme(savedTheme);
themeToggle.addEventListener('click', function () {
  var current = root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
  var next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('jk-theme', next); } catch (e) {}
});

var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
var indicator = document.getElementById('tabIndicator');

function moveIndicator(tab) {
  indicator.style.width = tab.offsetWidth + 'px';
  indicator.style.transform = 'translateX(' + (tab.offsetLeft - 4) + 'px)';
}

function setActiveTab(tab) {
  tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  moveIndicator(tab);
  views.forEach(function (v) { v.classList.remove('active'); });
  document.getElementById('view-' + tab.dataset.view).classList.add('active');
}

tabs.forEach(function (t) { t.addEventListener('click', function () { setActiveTab(t); }); });
document.getElementById('tabs').addEventListener('keydown', function (e) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  var idx = tabs.indexOf(document.activeElement);
  if (idx === -1) idx = tabs.indexOf(document.querySelector('.tab.active'));
  var next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
  tabs[next].focus();
  setActiveTab(tabs[next]);
});
window.addEventListener('resize', function () { moveIndicator(document.querySelector('.tab.active')); });
moveIndicator(document.querySelector('.tab.active'));

/* ---------- Biodata modal ---------- */
var PROFILES = {
  M15111: { name: 'Yash Jain', id: 'M15111', initials: 'YJ', gradient: 'var(--accent)', match: 96,
    age: '30 yrs', height: '6\'0"', marital: 'Never married', tongue: 'Marathi', sect: 'Shwetamber — Sthanakwasi',
    native: 'Jalgaon', education: 'MBA Finance — Duke Fuqua (USA)', occupation: 'Service, Akurdi', income: '> ₹1 Cr / yr',
    city: 'Akurdi, Pune', father: 'Business', siblings: '1 younger sister, unmarried',
    note: 'Family prefers a Pune-based alliance; open on sect within Shwetamber. Comfortable with a working match.' },
  J11674: { name: 'Pritam Meher', id: 'J11674', initials: 'PM', gradient: 'var(--info)', match: 94,
    age: '30 yrs', height: '5\'9"', marital: 'Never married', tongue: 'Marathi', sect: 'Shwetamber — Sthanakwasi',
    native: 'Chinchwad, Pune', education: 'M.S. Computer Science (USA)', occupation: 'Service', income: '> ₹1 Cr / yr',
    city: 'Chinchwad, Pune', father: 'Retired govt. officer', siblings: '1 elder brother, married',
    note: 'Family prefers a working professional; open to relocating after marriage.' },
  M17078: { name: 'Urvish Chokshi', id: 'M17078', initials: 'UC', gradient: 'var(--warning)', match: 88,
    age: '30 yrs', height: '5\'11"', marital: 'Never married', tongue: 'Gujarati', sect: 'Shwetamber — Mandirmargi',
    native: 'Pune', education: 'CA, LLB, ADIT', occupation: 'Service', income: '₹30–40 L / yr',
    city: 'Pune', father: 'Chartered Accountant, own practice', siblings: '2 elder sisters, married',
    note: 'Seeking a graduate-or-above match; family-oriented, sect flexible within Shwetamber.' },
  J19086: { name: 'Mihir Shah', id: 'J19086', initials: 'MS', gradient: 'var(--success)', match: 85,
    age: '31 yrs', height: '6\'0"', marital: 'Never married', tongue: 'Gujarati', sect: 'Shwetamber — Mandirmargi',
    native: 'Pune', education: 'CA & Registered Valuer', occupation: 'Private job', income: '₹30–40 L / yr',
    city: 'Pune', father: 'Business — real estate', siblings: '1 younger brother, studying',
    note: 'Prefers a working match; family comfortable with a joint household.' },
  J13761: { name: 'Bhagyesh Kocheta', id: 'J13761', initials: 'BK', gradient: 'var(--ink-soft)', match: 79,
    age: '32 yrs', height: '5\'10"', marital: 'Never married', tongue: 'Marathi', sect: 'Shwetamber — Sthanakwasi',
    native: 'Pune', education: 'Chartered Accountant', occupation: 'Professional', income: '₹20–30 L / yr',
    city: 'Pune', father: 'Chartered Accountant', siblings: '1 elder sister, married',
    note: 'Family values simplicity; open on income and career choice for the match.' }
};

var overlay = document.getElementById('modalOverlay');
var lastFocused = null;
var currentModalId = null;
var RING_R = 30;
var RING_C = 2 * Math.PI * RING_R;

function openModal(id) {
  var p = PROFILES[id];
  if (!p) return;
  currentModalId = id;
  document.getElementById('modalAvatar').textContent = p.initials;
  document.getElementById('modalAvatar').style.background = p.gradient;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalIdTag').textContent = p.id;
  document.getElementById('mAge').textContent = p.age;
  document.getElementById('mHeight').textContent = p.height;
  document.getElementById('mMarital').textContent = p.marital;
  document.getElementById('mTongue').textContent = p.tongue;
  document.getElementById('mSect').textContent = p.sect;
  document.getElementById('mNative').textContent = p.native;
  document.getElementById('mEducation').textContent = p.education;
  document.getElementById('mOccupation').textContent = p.occupation;
  document.getElementById('mIncome').textContent = p.income;
  document.getElementById('mCity').textContent = p.city;
  document.getElementById('mFather').textContent = p.father;
  document.getElementById('mSiblings').textContent = p.siblings;
  document.getElementById('modalNote').textContent = p.note;
  document.getElementById('modalMatchText').textContent = p.match + '%';
  document.getElementById('modalRingProgress').setAttribute('stroke-dasharray', (p.match / 100 * RING_C).toFixed(1) + ' ' + RING_C.toFixed(1));

  lastFocused = document.activeElement;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.p-action').forEach(function (btn) {
  btn.addEventListener('click', function () { openModal(btn.dataset.id); });
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalContact').addEventListener('click', closeModal);
document.getElementById('modalShortlist').addEventListener('click', closeModal);
overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

/* ---------- Admin: preference switches + notes ---------- */
document.querySelectorAll('.switch').forEach(function (sw) {
  sw.addEventListener('click', function () {
    var isOn = sw.classList.toggle('on');
    sw.setAttribute('aria-checked', isOn ? 'true' : 'false');
  });
});

var addNoteBtn = document.getElementById('addNoteBtn');
var newNoteText = document.getElementById('newNoteText');
var notesList = document.getElementById('notesList');
if (addNoteBtn) {
  addNoteBtn.addEventListener('click', function () {
    var text = newNoteText.value.trim();
    if (!text) return;
    var item = document.createElement('div');
    item.className = 'note-item';
    var meta = document.createElement('div');
    meta.className = 'note-meta';
    var author = document.createElement('span');
    author.className = 'note-author';
    author.textContent = 'You';
    var time = document.createElement('span');
    time.className = 'note-time';
    time.textContent = 'Just now';
    meta.appendChild(author);
    meta.appendChild(time);
    var p = document.createElement('p');
    p.textContent = text;
    item.appendChild(meta);
    item.appendChild(p);
    var tagMatch = text.match(/\b([MJ]\d{5})\b/);
    if (tagMatch) {
      var tag = document.createElement('span');
      tag.className = 'note-tag';
      tag.textContent = tagMatch[1];
      item.appendChild(tag);
    }
    notesList.insertBefore(item, notesList.firstChild);
    newNoteText.value = '';
  });
}

var currentStep = 1;
var totalSteps = 5;
var labels = Array.prototype.slice.call(document.querySelectorAll('.step-labels span'));
var panes = Array.prototype.slice.call(document.querySelectorAll('.step-pane'));
var stepFill = document.getElementById('stepFill');
var btnBack = document.getElementById('btnBack');
var btnNext = document.getElementById('btnNext');
var wizardForm = document.getElementById('wizardForm');
var wizardTitle = document.getElementById('wizardTitle');
var wizardSubtitle = document.getElementById('wizardSubtitle');
var editingId = null;

function fillText(id, value) {
  var el = document.getElementById(id);
  if (el && value) el.value = value;
}
function fillSelectLoose(id, value) {
  var el = document.getElementById(id);
  if (!el || !value) return;
  var v = value.toLowerCase();
  var opts = Array.prototype.slice.call(el.options);
  var match = opts.filter(function (o) {
    var t = o.text.toLowerCase();
    return v.indexOf(t) !== -1 || t.indexOf(v) !== -1;
  })[0];
  if (match) el.value = match.value;
}

function resetWizardToNew() {
  editingId = null;
  wizardForm.reset();
  wizardTitle.textContent = 'Create a new profile';
  wizardSubtitle.textContent = 'Add a candidate to the registry. Progress is saved automatically at every step.';
  currentStep = 1;
  renderStep();
}

function openEditProfile(id) {
  var p = PROFILES[id];
  if (!p) return;
  wizardForm.reset();
  editingId = id;
  wizardTitle.textContent = 'Edit profile — ' + p.name;
  wizardSubtitle.textContent = 'Updating ' + p.id + '. Changes save to this registry entry, not a new one.';
  fillText('wFullName', p.name);
  fillText('wHeight', p.height);
  fillSelectLoose('wMarital', p.marital);
  fillSelectLoose('wTongue', p.tongue);
  fillSelectLoose('wSect', p.sect);
  fillSelectLoose('wSubsect', p.sect);
  fillText('wNative', p.native);
  fillText('wFatherOcc', p.father);
  fillText('wSiblings', p.siblings);
  fillText('wEducation', p.education);
  fillText('wOccupation', p.occupation);
  fillSelectLoose('wIncome', p.income);
  fillText('wCity', p.city);
  fillText('wNote', p.note);
  currentStep = 1;
  renderStep();
  setActiveTab(document.querySelector('.tab[data-view="create"]'));
  closeModal();
}

document.querySelector('.tab[data-view="create"]').addEventListener('click', resetWizardToNew);
document.getElementById('modalEdit').addEventListener('click', function () { openEditProfile(currentModalId); });

function buildReview() {
  var grid = document.getElementById('reviewGrid');
  grid.innerHTML = '';
  var fields = document.querySelectorAll(
    '#wizardForm .step-pane[data-pane="1"] .form-field, ' +
    '#wizardForm .step-pane[data-pane="2"] .form-field, ' +
    '#wizardForm .step-pane[data-pane="3"] .form-field, ' +
    '#wizardForm .step-pane[data-pane="4"] .form-field'
  );
  fields.forEach(function (field) {
    var input = field.querySelector('.form-input');
    if (!input) return;
    var labelEl = field.querySelector('label');
    var labelText = labelEl ? labelEl.textContent.replace('*', '').trim() : '';
    var value = input.value ? input.value : '—';
    var kv = document.createElement('div');
    kv.className = 'kv';
    var kEl = document.createElement('span');
    kEl.className = 'k';
    kEl.textContent = labelText;
    var vEl = document.createElement('span');
    vEl.className = 'v';
    vEl.textContent = value;
    kv.appendChild(kEl);
    kv.appendChild(vEl);
    grid.appendChild(kv);
  });
}

function renderStep() {
  panes.forEach(function (p) { p.classList.toggle('active', Number(p.dataset.pane) === currentStep); });
  labels.forEach(function (el) {
    var n = Number(el.dataset.step);
    el.classList.remove('current', 'done');
    if (n < currentStep) el.classList.add('done');
    else if (n === currentStep) el.classList.add('current');
  });
  stepFill.style.width = (currentStep / totalSteps * 100) + '%';
  btnBack.disabled = currentStep === 1;
  btnNext.textContent = currentStep === totalSteps ? (editingId ? 'Save changes' : 'Create profile') : 'Continue';
  if (currentStep === totalSteps) buildReview();
}

labels.forEach(function (el) {
  el.addEventListener('click', function () { currentStep = Number(el.dataset.step); renderStep(); });
});
btnNext.addEventListener('click', function () {
  if (currentStep < totalSteps) { currentStep++; renderStep(); }
  else { btnNext.textContent = editingId ? 'Changes saved ✓' : 'Profile created ✓'; }
});
btnBack.addEventListener('click', function () { if (currentStep > 1) { currentStep--; renderStep(); } });

renderStep();
