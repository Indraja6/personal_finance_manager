const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure the data directory exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Ensure data.json exists with the correct structure
const dataFilePath = 'data/data.json';
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ transactions: [] }));
}

// Endpoint to add an income transaction
app.post('/api/income', (req, res) => {
  const { amount, description } = req.body;

  if (!amount || !description) {
    return res.status(400).json({ error: 'Amount and description are required.' });
  }

  const newIncome = {
    type: 'income',
    amount: parseFloat(amount),
    description,
    timestamp: new Date(),
  };

  // Read existing transactions
  fs.readFile(dataFilePath, (err, data) => {
    if (err) return res.status(500).send(err);
    const jsonData = JSON.parse(data);

    // Ensure transactions is an array
    if (!Array.isArray(jsonData.transactions)) {
      jsonData.transactions = [];
    }

    jsonData.transactions.push(newIncome);

    // Save updated transactions
    fs.writeFile(dataFilePath, JSON.stringify(jsonData), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(newIncome);
    });
  });
});

// Endpoint to add an expense transaction
app.post('/api/expenses', (req, res) => {
  const { amount, category, description } = req.body;

  if (!amount || !category || !description) {
    return res.status(400).json({ error: 'Amount, category, and description are required.' });
  }

  const newExpense = {
    type: 'expense',
    amount: parseFloat(amount),
    category,
    description,
    timestamp: new Date(),
  };

  // Read existing transactions
  fs.readFile(dataFilePath, (err, data) => {
    if (err) return res.status(500).send(err);
    const jsonData = JSON.parse(data);

    // Ensure transactions is an array
    if (!Array.isArray(jsonData.transactions)) {
      jsonData.transactions = [];
    }

    jsonData.transactions.push(newExpense);

    // Save updated transactions
    fs.writeFile(dataFilePath, JSON.stringify(jsonData), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(newExpense);
    });
  });
});

// Endpoint to generate a financial report
app.get('/api/report', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) return res.status(500).send(err);
    const jsonData = JSON.parse(data);

    const report = {
      totalIncome: 0,
      totalExpenses: 0,
      categories: {},
    };

    jsonData.transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        report.totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        report.totalExpenses += transaction.amount;
        report.categories[transaction.category] = (report.categories[transaction.category] || 0) + transaction.amount;
      }
    });

    res.json(report);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
