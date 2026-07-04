document.addEventListener('DOMContentLoaded', () => {
  const daysEl = document.getElementById('days');
  const monthLabel = document.getElementById('monthLabel');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  const selectedDayEl = document.getElementById('selectedDay');
  const staffListEl = document.getElementById('staffList');
  const confirmBtn = document.getElementById('confirmBtn');
  const chosenInfo = document.getElementById('chosenInfo');
  const customerName = document.getElementById('customerName');
  const customerEmail = document.getElementById('customerEmail');
  const customerPhone = document.getElementById('customerPhone');

  const services = { corte:45, barba:30, combo:90 };

  // static staff (match equipe.html)
  const staff = [ 'Ricardo', 'Alexandre', 'Bruno' ];

  let viewDate = new Date();
  viewDate.setDate(1);
  let selected = { date: null, staff: null, time: null, service: null };

  function pad(n){ return n<10? '0'+n : ''+n; }
  function formatDate(d){ return d.toLocaleDateString(); }
  function formatTime(h,m){ return pad(h)+':'+pad(m); }

  function isCustomerInfoValid(){
    return [customerName, customerEmail, customerPhone].every((input) => input.value.trim() !== '' && input.checkValidity());
  }

  function updateSlotAvailability(){
    const valid = isCustomerInfoValid();
    const allSlots = document.querySelectorAll('.slot');
    allSlots.forEach((slot) => {
      if (slot.classList.contains('taken')) return;
      if (slot.classList.contains('locked')) slot.classList.remove('locked');
      slot.disabled = !valid;
      if (!valid) slot.classList.add('locked');
    });

    if (!valid && selected.time){
      selected.time = null;
      const previous = document.querySelectorAll('.slot.chosen');
      previous.forEach((slot) => slot.classList.remove('chosen'));
      chosenInfo.textContent = 'Preencha seus dados para confirmar o agendamento';
    }
  }

  function handleCustomerInput(){
    updateSlotAvailability();
  }

  function renderCalendar(){
    daysEl.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const startIndex = firstDay.getDay(); // 0=domingo
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // fill previous month blanks
    for(let i=0;i<startIndex;i++){
      const empty = document.createElement('div');
      empty.className = 'day disabled';
      daysEl.appendChild(empty);
    }

    for(let d=1; d<=daysInMonth; d++){
      const date = new Date(year, month, d);
      const btn = document.createElement('button');
      btn.className = 'day';
      btn.textContent = d;

      // disable Sundays
      if(date.getDay() === 0){ btn.classList.add('disabled'); btn.disabled = true; }

      // mark today
      const today = new Date();
      if(date.toDateString() === today.toDateString()) btn.classList.add('today');

      btn.addEventListener('click', () => selectDay(date, btn));
      daysEl.appendChild(btn);
    }
  }

  function selectDay(date, btnEl){
    // clear prev selection
    const prev = daysEl.querySelector('.day.selected'); if(prev) prev.classList.remove('selected');
    btnEl.classList.add('selected');
    selected.date = date;
    selected.staff = null; selected.time = null;
    selectedDayEl.textContent = date.toLocaleDateString(undefined, { weekday:'long', day:'2-digit', month:'short', year:'numeric' });
    chosenInfo.textContent = 'Nenhum horário escolhido';
    confirmBtn.disabled = true;
    renderStaffAvailability(date);
  }

  // generate 30-min slot times from 08:00 to 19:30
  function generateSlots(){
    const slots = [];
    for(let h=8; h<=19; h++){
      slots.push({ h, m: 0 });
      slots.push({ h, m: 30 });
    }
    return slots;
  }

  function renderStaffAvailability(date){
    staffListEl.innerHTML = '';
    const slots = generateSlots();

    staff.forEach((name, idx) => {
      const card = document.createElement('div'); card.className = 'staff';
      const h5 = document.createElement('h5'); h5.textContent = name; card.appendChild(h5);

      const slotsWrap = document.createElement('div'); slotsWrap.className = 'slots';

      slots.forEach(s => {
        const t = formatTime(s.h, s.m);
        const slotEl = document.createElement('button');
        slotEl.className = 'slot'; slotEl.textContent = t;

        const isClosedSlot = s.h === 19 && s.m === 30;
        const dayNum = date.getDate();
        const infoValid = isCustomerInfoValid();

        if (isClosedSlot) {
          slotEl.classList.add('taken');
          slotEl.disabled = true;
          slotEl.setAttribute('aria-label', 'Horário indisponível');
        } else if ((dayNum + idx + s.h) % 7 === 0) {
          slotEl.classList.add('taken');
          slotEl.disabled = true;
        } else if (!infoValid) {
          slotEl.disabled = true;
          slotEl.classList.add('locked');
        }

        slotEl.addEventListener('click', () => {
          if (slotEl.disabled) return;
          const prev = document.querySelectorAll('.slot.chosen'); prev.forEach(p => p.classList.remove('chosen'));
          slotEl.classList.add('chosen');
          selected.staff = name; selected.time = t; selected.service = document.getElementById('serviceSelect').value;
          chosenInfo.textContent = `${selected.staff} — ${selected.time} — ${selected.service}`;
          confirmBtn.disabled = false;
        });

        slotsWrap.appendChild(slotEl);
      });

      card.appendChild(slotsWrap);
      staffListEl.appendChild(card);
    });
  }

  customerName.addEventListener('input', handleCustomerInput);
  customerEmail.addEventListener('input', handleCustomerInput);
  customerPhone.addEventListener('input', handleCustomerInput);

  prevMonth.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()-1); renderCalendar(); });
  nextMonth.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()+1); renderCalendar(); });

  confirmBtn.addEventListener('click', () => {
    if(!selected.date || !selected.staff || !selected.time) return;
    alert(`Agendamento confirmado:\nData: ${selected.date.toLocaleDateString()}\nHorário: ${selected.time}\nProfissional: ${selected.staff}\nServiço: ${selected.service}`);
    // reset
    confirmBtn.disabled = true;
    chosenInfo.textContent = 'Nenhum horário escolhido';
  });

  renderCalendar();
});
