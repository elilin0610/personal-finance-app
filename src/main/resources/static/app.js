const state = {
    token: localStorage.getItem("financeToken"),
    user: JSON.parse(localStorage.getItem("financeUser") || "null"),
    categories: [],
    transactions: []
};

const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
});

const today = new Date();
const currentMonth = today.toISOString().slice(0, 7);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dateInput").value = today.toISOString().slice(0, 10);
    document.getElementById("loginForm").addEventListener("submit", login);
    document.getElementById("demoLoginButton").addEventListener("click", demoLogin);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("categoryForm").addEventListener("submit", saveCategory);
    document.getElementById("transactionForm").addEventListener("submit", saveTransaction);
    document.getElementById("cancelCategoryEditButton").addEventListener("click", resetCategoryForm);
    document.getElementById("cancelTransactionEditButton").addEventListener("click", resetTransactionForm);
    document.getElementById("transactionTypeInput").addEventListener("change", () => renderCategoryOptions());

    refreshSessionUi();
    if (state.token) {
        loadDashboard().catch(showError);
    } else {
        renderCategories();
        renderTransactions();
    }
});

async function demoLogin() {
    document.getElementById("emailInput").value = "demo@finance.dev";
    document.getElementById("passwordInput").value = "password123";
    await login();
}

async function login(event) {
    event?.preventDefault();
    try {
        const payload = {
            email: document.getElementById("emailInput").value,
            password: document.getElementById("passwordInput").value
        };
        const data = await api("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(payload)
        }, false);

        state.token = data.accessToken;
        state.user = data.user;
        localStorage.setItem("financeToken", state.token);
        localStorage.setItem("financeUser", JSON.stringify(state.user));

        refreshSessionUi();
        showAlert("Login successful. Data loaded from the database.", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function logout() {
    state.token = null;
    state.user = null;
    state.categories = [];
    state.transactions = [];
    localStorage.removeItem("financeToken");
    localStorage.removeItem("financeUser");
    refreshSessionUi();
    resetCategoryForm();
    resetTransactionForm();
    renderCategories();
    renderTransactions();
    renderSummary(null);
    showAlert("Logged out.", "secondary");
}

async function loadDashboard() {
    requireLogin();
    const [categories, transactions, summary] = await Promise.all([
        api("/api/categories"),
        api(`/api/transactions?month=${currentMonth}`),
        api(`/api/reports/monthly-summary?month=${currentMonth}`)
    ]);

    state.categories = categories;
    state.transactions = transactions;
    renderCategories();
    renderCategoryOptions();
    renderTransactions();
    renderSummary(summary);
}

async function saveCategory(event) {
    event.preventDefault();
    try {
        requireLogin();
        const id = document.getElementById("categoryIdInput").value;
        const payload = {
            name: document.getElementById("categoryNameInput").value.trim(),
            type: document.getElementById("categoryTypeInput").value,
            color: document.getElementById("categoryColorInput").value
        };
        await api(id ? `/api/categories/${id}` : "/api/categories", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        resetCategoryForm();
        showAlert(id ? "Category updated." : "Category created.", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function editCategory(id) {
    const category = state.categories.find(item => item.id === id);
    if (!category) return;
    document.getElementById("categoryIdInput").value = category.id;
    document.getElementById("categoryNameInput").value = category.name;
    document.getElementById("categoryTypeInput").value = category.type;
    document.getElementById("categoryColorInput").value = category.color;
    document.getElementById("categoryFormTitle").textContent = "Edit Category";
    document.getElementById("saveCategoryButton").innerHTML = '<i class="bi bi-save me-1"></i>Update Category';
    document.getElementById("cancelCategoryEditButton").classList.remove("d-none");
}

async function deleteCategory(id) {
    if (!confirm("Delete this category? Transactions using this category may block deletion.")) return;
    try {
        requireLogin();
        await api(`/api/categories/${id}`, { method: "DELETE" });
        showAlert("Category deleted.", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function resetCategoryForm() {
    document.getElementById("categoryForm").reset();
    document.getElementById("categoryIdInput").value = "";
    document.getElementById("categoryColorInput").value = "#2563eb";
    document.getElementById("categoryFormTitle").textContent = "Create Category";
    document.getElementById("saveCategoryButton").innerHTML = '<i class="bi bi-plus-circle me-1"></i>Create Category';
    document.getElementById("cancelCategoryEditButton").classList.add("d-none");
}

async function saveTransaction(event) {
    event.preventDefault();
    try {
        requireLogin();
        const id = document.getElementById("transactionIdInput").value;
        const categoryId = Number(document.getElementById("transactionCategoryInput").value);
        if (!categoryId) {
            throw new Error("Please create or select a category first.");
        }
        const payload = {
            type: document.getElementById("transactionTypeInput").value,
            categoryId,
            amount: Number(document.getElementById("amountInput").value),
            occurredOn: document.getElementById("dateInput").value,
            merchant: document.getElementById("merchantInput").value.trim(),
            note: document.getElementById("noteInput").value.trim()
        };
        await api(id ? `/api/transactions/${id}` : "/api/transactions", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        resetTransactionForm();
        showAlert(id ? "Transaction updated." : "Transaction created.", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function editTransaction(id) {
    const transaction = state.transactions.find(item => item.id === id);
    if (!transaction) return;
    document.getElementById("transactionIdInput").value = transaction.id;
    document.getElementById("transactionTypeInput").value = transaction.type;
    renderCategoryOptions(transaction.categoryId);
    document.getElementById("amountInput").value = transaction.amount;
    document.getElementById("dateInput").value = transaction.occurredOn;
    document.getElementById("merchantInput").value = transaction.merchant;
    document.getElementById("noteInput").value = transaction.note || "";
    document.getElementById("transactionFormTitle").textContent = "Edit Transaction";
    document.getElementById("saveTransactionButton").innerHTML = '<i class="bi bi-save me-1"></i>Update Transaction';
    document.getElementById("cancelTransactionEditButton").classList.remove("d-none");
}

async function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
        requireLogin();
        await api(`/api/transactions/${id}`, { method: "DELETE" });
        showAlert("Transaction deleted.", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function resetTransactionForm() {
    document.getElementById("transactionForm").reset();
    document.getElementById("transactionIdInput").value = "";
    document.getElementById("dateInput").value = today.toISOString().slice(0, 10);
    document.getElementById("amountInput").value = "120";
    document.getElementById("merchantInput").value = "Coffee Shop";
    document.getElementById("transactionFormTitle").textContent = "Create Transaction";
    document.getElementById("saveTransactionButton").innerHTML = '<i class="bi bi-check2-circle me-1"></i>Create Transaction';
    document.getElementById("cancelTransactionEditButton").classList.add("d-none");
    renderCategoryOptions();
}

async function api(path, options = {}, authenticated = true) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    if (authenticated && state.token) {
        headers.Authorization = `Bearer ${state.token}`;
    }
    const response = await fetch(path, {
        ...options,
        headers
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${response.status}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function renderCategories() {
    document.getElementById("categoryCount").textContent = `${state.categories.length} records`;
    document.getElementById("categoryList").innerHTML = state.categories.map(category => `
        <div class="category-pill">
            <div class="d-flex align-items-center gap-2 min-width-0">
                <span class="color-dot" style="background:${category.color}"></span>
                <strong class="text-truncate">${escapeHtml(category.name)}</strong>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge ${category.type === "INCOME" ? "text-bg-success" : "text-bg-danger"}">
                    ${category.type === "INCOME" ? "Income" : "Expense"}
                </span>
                <button class="icon-button" type="button" title="Edit category" onclick="editCategory(${category.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="icon-button text-danger" type="button" title="Delete category" onclick="deleteCategory(${category.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join("") || emptyState("Login to load categories.");
}

function renderCategoryOptions(selectedId) {
    const type = document.getElementById("transactionTypeInput").value;
    const options = state.categories
        .filter(category => category.type === type)
        .map(category => `<option value="${category.id}" ${Number(selectedId) === category.id ? "selected" : ""}>${escapeHtml(category.name)}</option>`)
        .join("");
    document.getElementById("transactionCategoryInput").innerHTML = options || "<option value=''>Create a matching category first</option>";
}

function renderTransactions() {
    document.getElementById("transactionCount").textContent = `${state.transactions.length} records`;
    document.getElementById("transactionList").innerHTML = state.transactions.map(item => {
        const isIncome = item.type === "INCOME";
        const amountClass = isIncome ? "amount-income" : "amount-expense";
        const sign = isIncome ? "+" : "-";
        return `
            <div class="transaction-item">
                <div class="min-width-0">
                    <strong class="d-block text-truncate">${escapeHtml(item.merchant)}</strong>
                    <small>${item.occurredOn} / ${escapeHtml(item.categoryName)} / ${escapeHtml(item.note || "No note")}</small>
                </div>
                <div class="text-end">
                    <strong class="${amountClass}">${sign}${currency.format(item.amount)}</strong>
                    <div class="mt-2">
                        <button class="icon-button" type="button" title="Edit transaction" onclick="editTransaction(${item.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="icon-button text-danger" type="button" title="Delete transaction" onclick="deleteTransaction(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("") || emptyState("Login to load transactions.");
}

function renderSummary(summary) {
    document.getElementById("incomeMetric").textContent = currency.format(summary?.income || 0);
    document.getElementById("expenseMetric").textContent = currency.format(summary?.expense || 0);
    document.getElementById("cashFlowMetric").textContent = currency.format(summary?.netCashFlow || 0);
    document.getElementById("budgetMetric").textContent = currency.format(summary?.budgetRemaining || 0);
}

function refreshSessionUi() {
    const userBadge = document.getElementById("userBadge");
    const logoutButton = document.getElementById("logoutButton");
    if (state.user) {
        userBadge.textContent = `${state.user.name} / ${state.user.email}`;
        userBadge.classList.remove("d-none");
        logoutButton.classList.remove("d-none");
    } else {
        userBadge.classList.add("d-none");
        logoutButton.classList.add("d-none");
    }
}

function showAlert(message, type) {
    const alertBox = document.getElementById("alertBox");
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    setTimeout(() => alertBox.classList.add("d-none"), 4500);
}

function showError(error) {
    showAlert(error.message || "Something went wrong.", "danger");
}

function requireLogin() {
    if (!state.token) {
        throw new Error("Please login first.");
    }
}

function emptyState(text) {
    return `<div class="text-secondary border rounded p-3 bg-white">${text}</div>`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
