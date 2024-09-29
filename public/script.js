const transactionForm = document.getElementById('transaction-form');
const reportOutput = document.getElementById('report-output');
const generateReportButton = document.getElementById('generate-report');
const notifications = document.getElementById('notifications');
const ctx = document.getElementById('incomeExpenseChart').getContext('2d');

let transactions = [];
let incomeExpenseChart;

// Function to update the chart
const updateChart = () => {
    const incomeData = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseData = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Total',
                data: [incomeData, expenseData],
                backgroundColor: ['#4CAF50', '#F44336'],
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

// Add transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const income = parseFloat(document.getElementById('income').value) || 0;
    const expense = parseFloat(document.getElementById('expense').value) || 0;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (income > 0) {
        transactions.push({ type: 'income', amount: income, category, description });
        notifications.innerHTML += `<p>Added Income: $${income} - ${description} (${category})</p>`;
    }
    
    if (expense > 0) {
        transactions.push({ type: 'expense', amount: expense, category, description });
        notifications.innerHTML += `<p>Added Expense: $${expense} - ${description} (${category})</p>`;
    }

    updateChart();
    transactionForm.reset();
});

// Generate report
generateReportButton.addEventListener('click', () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    reportOutput.innerHTML = `
        <h3>Financial Report</h3>
        <p>Total Income: $${totalIncome}</p>
        <p>Total Expenses: $${totalExpense}</p>
        <p>Balance: $${balance}</p>
    `;
});
