let expenses = [];
let totalSalary = 0;

const salaryInput = document.getElementById("salary");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");

document.getElementById("addExpense").addEventListener("click", () => {
  if (!salaryInput.value) return alert("Enter your salary first!");

  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Enter valid expense details.");
    return;
  }

  totalSalary = parseFloat(salaryInput.value);
  expenses.push({ name, amount });

  updateList();
  updateSummary();

  expenseName.value = "";
  expenseAmount.value = "";
});

function updateList() {
  expenseList.innerHTML = "";
  expenses.forEach((exp, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <span>${exp.name}</span>
      <div>
        ₹${exp.amount}
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeExpense(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    expenseList.appendChild(li);
  });
}

function removeExpense(index) {
  expenses.splice(index, 1);
  updateList();
  updateSummary();
}

function updateSummary() {
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remain = totalSalary - totalExp;

  totalIncome.textContent = totalSalary.toFixed(2);
  totalExpenses.textContent = totalExp.toFixed(2);
  remainingBalance.textContent = remain.toFixed(2);
}

// ------------------------------
// 📌 COPY REPORT BUTTON
// ------------------------------
document.getElementById("copyReport").addEventListener("click", () => {
  const name = document.getElementById("userName").value || "User";
  const message = document.getElementById("userMessage").value;

  let text = `📌 PayPlanner Report\n\n`;
  text += `Name: ${name}\n`;
  if (message) text += `Message: ${message}\n\n`;

  text += `Total Salary: ₹${totalSalary}\n`;
  text += `Total Expenses: ₹${expenses.reduce((a, b) => a + b.amount, 0)}\n`;
  text += `Remaining Balance: ₹${totalSalary - expenses.reduce((a, b) => a + b.amount, 0)}\n\n`;

  text += `📌 Expense Breakdown:\n`;
  expenses.forEach(e => (text += `• ${e.name}: ₹${e.amount}\n`));

  navigator.clipboard.writeText(text);
  alert("Report copied to clipboard!");
});

// ------------------------------
// 📌 PDF DOWNLOAD (Phone Friendly)
// ------------------------------
document.getElementById("downloadPDF").addEventListener("click", () => {
  const name = document.getElementById("userName").value || "User";
  const message = document.getElementById("userMessage").value;

  const reportDiv = document.createElement("div");
  reportDiv.style.padding = "20px";
  reportDiv.style.fontSize = "14px";

  reportDiv.innerHTML = `
    <h2>PayPlanner Report</h2>
    <p><strong>Name:</strong> ${name}</p>
    ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
    <p><strong>Total Salary:</strong> ₹${totalSalary}</p>
    <p><strong>Total Expenses:</strong> ₹${expenses.reduce((s, e) => s + e.amount, 0)}</p>
    <p><strong>Remaining Balance:</strong> ₹${totalSalary - expenses.reduce((s, e) => s + e.amount, 0)}</p>

    <h4>Expense Breakdown:</h4>
    <ul>${expenses.map(e => `<li>${e.name} - ₹${e.amount}</li>`).join("")}</ul>

    <p style="margin-top:20px; font-size:12px;">Generated on ${new Date().toLocaleDateString()}</p>
  `;

  const opt = {
    margin: 10,
    filename: `${name}_PayPlanner_Report.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(reportDiv).set(opt).save();
});
