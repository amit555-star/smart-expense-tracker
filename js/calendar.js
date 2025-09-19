// Calendar Elements
const weekRangeElement = document.getElementById('currentWeekRange');
const calendarGrid = document.querySelector('.calendar-grid');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');

let currentWeekStart = new Date();
currentWeekStart.setDate(currentWeekStart.getDate() - (currentWeekStart.getDay() + 6) % 7);
currentWeekStart.setHours(0, 0, 0, 0);
let selectedDate = new Date();

let editingTransactionId = null; // Stores ID if in edit mode
let selectedTransactionType = null; // Stores the chosen type (income/expense)

// --- Initial Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial render of calendar
    renderCalendar();
    // Load transaction for editing if navigating from home page
    loadTransactionForEdit();
});

// --- Event Listeners ---
backToHomeBtn.addEventListener('click', () => {
    window.location.href = 'home.html'; // Navigate back to dashboard
});

// --- Calendar Logic ---
function renderCalendar() {
    const existingDateItems = calendarGrid.querySelectorAll('.date-item');
    existingDateItems.forEach(item => item.remove());

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    const startMonth = currentWeekStart.toLocaleString('default', { month: 'long' });
    const startDay = currentWeekStart.getDate();
    const endMonth = currentWeekEnd.toLocaleString('default', { month: 'long' });
    const endDay = currentWeekEnd.getDate();
    const year = currentWeekStart.getFullYear();

    if (currentWeekStart.getMonth() === currentWeekEnd.getMonth()) {
        weekRangeElement.textContent = `${startMonth}, ${year}`;
    } else {
        weekRangeElement.textContent = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }

    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);

        const dateItem = document.createElement('span');
        dateItem.classList.add('date-item');
        dateItem.textContent = date.getDate();

        if (date.toDateString() === selectedDate.toDateString()) {
            dateItem.classList.add('selected');
        }

        dateItem.addEventListener('click', (event) => {
            document.querySelectorAll('.calendar-grid .date-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
            selectedDate = date;
        });
        calendarGrid.appendChild(dateItem);
    }
}

prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    selectedDate = new Date(currentWeekStart); // Select Monday of the new week
    renderCalendar();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    selectedDate = new Date(currentWeekStart); // Select Monday of the new week
    renderCalendar();
});