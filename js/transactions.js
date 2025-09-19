// ==== Transactions Page (transactions.html) Logic ====

// DOM Elements
const backToHomeBtn = document.getElementById('backToHome');
const formTitleElement = document.getElementById('formTitle');
const transactionForm = document.getElementById('transactionForm');
const transactionIdInput = document.getElementById('transactionId'); // Hidden input for edit mode
const transactionTitleInput = document.getElementById('transactionTitle');
const amountInput = document.getElementById('amount');
const transactionTypeButtons = document.querySelectorAll('.transaction-type-button');
const addUpdateBtn = document.getElementById('addUpdateBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');



// --- Transaction Type Button Logic ---
transactionTypeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        transactionTypeButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        selectedTransactionType = event.currentTarget.dataset.type;
    });
});

// --- Load Transaction for Editing ---
function loadTransactionForEdit() {
    const storedTransactionId = localStorage.getItem('editTransactionId');
    const storedTransactionData = localStorage.getItem('editTransactionData');

    if (storedTransactionId && storedTransactionData) {
        try {
            const transaction = JSON.parse(storedTransactionData);
            formTitleElement.textContent = 'Edit Transaction';
            addUpdateBtn.textContent = 'Update Transaction';
            cancelEditBtn.style.display = 'block';

            transactionIdInput.value = storedTransactionId; // Populate hidden ID field
            transactionTitleInput.value = transaction.title;
            amountInput.value = transaction.amount;

            // Set selected date on calendar
            selectedDate = new Date(transaction.date);
            currentWeekStart.setDate(selectedDate.getDate() - (selectedDate.getDay() + 6) % 7);
            currentWeekStart.setHours(0, 0, 0, 0);
            renderCalendar();

            // Select transaction type button
            transactionTypeButtons.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.type === transaction.type) {
                    btn.classList.add('selected');
                    selectedTransactionType = transaction.type;
                }
            });
            editingTransactionId = storedTransactionId; // Set editing ID
        } catch (e) {
            console.error("Error parsing stored transaction data:", e);
            alert("Failed to load transaction for editing.");
            resetFormAndEditState();
        }
    } else {
        // Not in edit mode, ensure form is clean
        resetFormAndEditState();
    }
}

// --- Reset Form and Edit State ---
function resetFormAndEditState() {
    formTitleElement.textContent = 'Add Transaction';
    addUpdateBtn.textContent = 'Add Transaction';
    cancelEditBtn.style.display = 'none';
    transactionForm.reset();
    transactionIdInput.value = '';
    editingTransactionId = null;
    selectedTransactionType = null;
    transactionTypeButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Reset calendar to today's date
    selectedDate = new Date();
    currentWeekStart.setDate(selectedDate.getDate() - (selectedDate.getDay() + 6) % 7);
    currentWeekStart.setHours(0, 0, 0, 0);
    renderCalendar();

    // Clear localStorage edit data
    localStorage.removeItem('editTransactionId');
    localStorage.removeItem('editTransactionData');
}

// --- Add/Update Transaction to Local Storage ---
transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = transactionTitleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = selectedTransactionType;
    const date = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format (e.g., "2023-10-27")

    // Validation
    if (!title) {
        alert("Please enter a Transaction Title.");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid Amount greater than 0.");
        return;
    }
    if (!type) {
        alert("Please select a Transaction Type (Income or Expense).");
        return;
    }

    // Get current transactions from Local Storage
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    const transactionData = {
        id: editingTransactionId || Date.now().toString(), // Use existing ID or generate new unique ID
        title: title,
        amount: amount,
        type: type,
        date: date,
        timestamp: new Date().toISOString() // Use ISO string for consistent sorting
    };

    if (editingTransactionId) {
        // Update existing transaction
        const index = transactions.findIndex(t => t.id === editingTransactionId);
        if (index !== -1) {
            transactions[index] = transactionData;
            alert("Transaction updated successfully!");
        }
    } else {
        // Add new transaction
        transactions.push(transactionData);
        alert("Transaction added successfully!");
    }

    // Save updated transactions back to Local Storage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Reset form and redirect after a short delay
    resetFormAndEditState();
    setTimeout(() => {
        window.location.href = 'home.html'; // Go back to home page
    }, 500); // Shorter delay for local storage
});

cancelEditBtn.addEventListener('click', () => {
    resetFormAndEditState();
    window.location.href = 'home.html'; // Go back to home page
});
