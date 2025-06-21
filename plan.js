function savePlans(plans) {
  localStorage.setItem('plans', JSON.stringify(plans));
}

function loadPlans() {
  return JSON.parse(localStorage.getItem('plans') || '[]');
}

const params = new URLSearchParams(location.search);
const id = Number(params.get('id'));
let plans = loadPlans();
const plan = plans.find((p) => p.id === id);

if (!plan) {
  document.body.innerHTML = '<p>일정을 찾을 수 없습니다.</p>';
} else {
  document.getElementById('plan-title').textContent = plan.name;
  renderDays();
}

function renderDays() {
  const container = document.getElementById('days');
  container.innerHTML = '';
  const template = document.getElementById('day-template');
  plan.days.forEach((day, idx) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.day-title').textContent = `${idx + 1}일차 - ${day.date}`;
    node.querySelectorAll('.category').forEach((catEl) => {
      const cat = catEl.getAttribute('data-cat');
      const list = catEl.querySelector('.item-list');
      list.innerHTML = '';
      day[cat].forEach((item, i) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      const form = catEl.querySelector('.item-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.item-input');
        if (input.value.trim() !== '') {
          day[cat].push(input.value.trim());
          savePlans(plans);
          renderDays();
          input.value = '';
        }
      });
    });
    container.appendChild(node);
  });
}
