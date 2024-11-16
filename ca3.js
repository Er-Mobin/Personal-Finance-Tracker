// Transaction data storage
let transactions = [];

// Selecting DOM elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionListEl = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');

// Update balance, income, and expenses
function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  expenseEl.textContent = `$${totalExpense.toFixed(2)}`;
}

// Render the transaction list
function renderTransactions() {
  transactionListEl.innerHTML = '';
  transactions.forEach(transaction => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${transaction.type}</td>
      <td>$${transaction.amount.toFixed(2)}</td>
      <td>${transaction.category}</td>
      <td>${transaction.date}</td>
    `;
    transactionListEl.appendChild(tr);
  });
}

// Add a new transaction
function addTransaction(event) {
  event.preventDefault();

  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  const newTransaction = { type, amount, category, date };
  transactions.push(newTransaction);

  updateSummary();
  renderTransactions();
  updateChart();

  transactionForm.reset();
}

// Initialize chart
const ctx = document.getElementById('expense-chart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food', 'Rent', 'Transport', 'Entertainment',],
    datasets: [{
      label: 'Expenses',
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', ],
    }],
  },
});

// Update chart with expenses breakdown
function updateChart() {
  let expenseCategories = { food: 0, rent: 0, transport: 0, entertainment: 0 };

  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      expenseCategories[transaction.category] += transaction.amount;
    }
  });

  expenseChart.data.datasets[0].data = [
    expenseCategories.food,
    expenseCategories.rent,
    expenseCategories.transport,
    expenseCategories.entertainment,
  ];

  expenseChart.update();
}

// Event listener for form submission
transactionForm.addEventListener('submit', addTransaction);

// Initial update
updateSummary();