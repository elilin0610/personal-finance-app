const state = {
    token: localStorage.getItem("financeToken"),
    user: JSON.parse(localStorage.getItem("financeUser") || "null"),
    categories: [],
    transactions: []
};

const currency = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
});

const today = new Date();
const month = today.toISOString().slice(0, 7);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dateInput").value = today.toISOString().slice(0, 10);
    document.getElementById("loginForm").addEventListener("submit", login);
    document.getElementById("demoLoginButton").addEventListener("click", demoLogin);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("categoryForm").addEventListener("submit", createCategory);
    document.getElementById("transactionForm").addEventListener("submit", createTransaction);
    document.getElementById("transactionTypeInput").addEventListener("change", renderCategoryOptions);
    refreshSessionUi();
    if (state.token) {
        loadDashboard().catch(showError);
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
        showAlert("登入成功，已載入你的財務資料。", "success");
        refreshSessionUi();
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
    renderCategories();
    renderTransactions();
    renderSummary(null);
    showAlert("已登出。", "secondary");
}

async function loadDashboard() {
    if (!state.token) {
        showAlert("請先登入，才能載入受保護的理財資料。", "warning");
        return;
    }
    const [categories, transactions, summary] = await Promise.all([
        api("/api/categories"),
        api(`/api/transactions?month=${month}`),
        api(`/api/reports/monthly-summary?month=${month}`)
    ]);
    state.categories = categories;
    state.transactions = transactions;
    renderCategories();
    renderCategoryOptions();
    renderTransactions();
    renderSummary(summary);
}

async function createCategory(event) {
    event.preventDefault();
    try {
        requireLogin();
        const payload = {
            name: document.getElementById("categoryNameInput").value,
            type: document.getElementById("categoryTypeInput").value,
            color: document.getElementById("categoryColorInput").value
        };
        await api("/api/categories", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        event.target.reset();
        document.getElementById("categoryColorInput").value = "#2563eb";
        showAlert("分類已新增。", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

async function createTransaction(event) {
    event.preventDefault();
    try {
        requireLogin();
        const payload = {
            type: document.getElementById("transactionTypeInput").value,
            categoryId: Number(document.getElementById("transactionCategoryInput").value),
            amount: Number(document.getElementById("amountInput").value),
            occurredOn: document.getElementById("dateInput").value,
            merchant: document.getElementById("merchantInput").value,
            note: document.getElementById("noteInput").value
        };
        await api("/api/transactions", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        showAlert("交易已儲存。", "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
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
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

function renderCategories() {
    document.getElementById("categoryCount").textContent = `${state.categories.length} 筆`;
    document.getElementById("categoryList").innerHTML = state.categories.map(category => `
        <div class="category-pill">
            <div class="d-flex align-items-center gap-2">
                <span class="color-dot" style="background:${category.color}"></span>
                <strong>${escapeHtml(category.name)}</strong>
            </div>
            <span class="badge ${category.type === "INCOME" ? "text-bg-success" : "text-bg-danger"}">
                ${category.type === "INCOME" ? "收入" : "支出"}
            </span>
        </div>
    `).join("") || emptyState("尚未載入分類");
}

function renderCategoryOptions() {
    const type = document.getElementById("transactionTypeInput").value;
    const options = state.categories
        .filter(category => category.type === type)
        .map(category => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
        .join("");
    document.getElementById("transactionCategoryInput").innerHTML = options || "<option value=''>請先新增分類</option>";
}

function renderTransactions() {
    document.getElementById("transactionCount").textContent = `${state.transactions.length} 筆`;
    document.getElementById("transactionList").innerHTML = state.transactions.map(item => {
        const isIncome = item.type === "INCOME";
        const amountClass = isIncome ? "amount-income" : "amount-expense";
        const sign = isIncome ? "+" : "-";
        return `
            <div class="transaction-item">
                <div>
                    <strong>${escapeHtml(item.merchant)}</strong>
                    <div><small>${item.occurredOn} · ${escapeHtml(item.categoryName)} · ${escapeHtml(item.note || "無備註")}</small></div>
                </div>
                <strong class="${amountClass}">${sign}${currency.format(item.amount)}</strong>
            </div>
        `;
    }).join("") || emptyState("尚未有本月交易");
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
        userBadge.textContent = `${state.user.name} · ${state.user.email}`;
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
    showAlert(error.message || "發生未知錯誤。", "danger");
}

function requireLogin() {
    if (!state.token) {
        throw new Error("請先登入。");
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
