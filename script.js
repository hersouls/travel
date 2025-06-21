function savePlans(plans) {
  localStorage.setItem('plans', JSON.stringify(plans));
}

function loadPlans() {
  return JSON.parse(localStorage.getItem('plans') || '[]');
}

function getStatus(plan) {
  const today = new Date().toISOString().split('T')[0];
  return plan.end < today ? 'completed' : 'progress';
}

function renderPlans() {
  const plans = loadPlans();
  const container = document.getElementById('plans');
  container.innerHTML = '';
  const template = document.getElementById('plan-card-template');
  const search = document.getElementById('search-input').value.toLowerCase();
  const filter = document.getElementById('status-filter').value;
  const sortOrder = document.getElementById('sort-order').value;
  const filtered = plans
    .filter((p) => p.name.toLowerCase().includes(search))
    .filter((p) => (filter === 'all' ? true : getStatus(p) === filter));

  filtered.sort((a, b) => {
    if (sortOrder === 'oldest') {
      return new Date(a.start) - new Date(b.start);
    }
    return new Date(b.start) - new Date(a.start);
  });

  filtered.forEach((plan, index) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.plan-name').textContent = plan.name;
    node.querySelector('.plan-dates').textContent = `${plan.start} ~ ${plan.end}`;
    node.querySelector('.plan-link').setAttribute('href', `plan.html?id=${plan.id}`);
    node.querySelector('.delete-btn').addEventListener('click', () => {
      const allPlans = loadPlans();
      const idx = allPlans.findIndex((p) => p.id === plan.id);
      if (idx > -1) {
        allPlans.splice(idx, 1);
        savePlans(allPlans);
      }
      renderPlans();
    });
    container.appendChild(node);
  });
}

function openDialog() {
  const dialog = document.getElementById('plan-dialog');
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.getElementById('plan-dialog');
  dialog.close();
}

document.getElementById('new-plan-btn').addEventListener('click', openDialog);
document.getElementById('cancel-btn').addEventListener('click', closeDialog);
document.getElementById('plan-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const plans = loadPlans();
  const name = document.getElementById('plan-name-input').value;
  const start = document.getElementById('start-date-input').value;
  const end = document.getElementById('end-date-input').value;
  const days = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  for (let d = new Date(startDate); d <= endDate && days.length < 30; d.setDate(d.getDate() + 1)) {
    days.push({
      date: d.toISOString().split('T')[0],
      transport: [],
      accommodation: [],
      places: [],
      todos: [],
    });
  }
  plans.unshift({ id: Date.now(), name, start, end, days });
  savePlans(plans);
  closeDialog();
  renderPlans();
  e.target.reset();
});

document.getElementById('search-input').addEventListener('input', renderPlans);
document.getElementById('status-filter').addEventListener('change', renderPlans);
document.getElementById('sort-order').addEventListener('change', renderPlans);

window.addEventListener('DOMContentLoaded', renderPlans);
