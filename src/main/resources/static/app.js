const state = {
    token: localStorage.getItem("financeToken"),
    user: JSON.parse(localStorage.getItem("financeUser") || "null"),
    lang: localStorage.getItem("financeLanguage") || "en",
    categories: [],
    transactions: [],
    categoryEditing: false,
    transactionEditing: false
};

const translations = {
    en: {
        appTitle: "Personal Finance App",
        brand: "Personal Finance",
        languageButton: "Language",
        logout: "Logout",
        eyebrow: "Spring Boot + Bootstrap Portfolio",
        heroTitle: "Personal Finance Manager",
        heroLead: "A full-stack portfolio app with JWT login, database-backed CRUD, monthly summaries, and a clean Bootstrap dashboard.",
        demoLogin: "Demo Login",
        apiStatus: "API Status",
        monthlyIncome: "Monthly Income",
        monthlyExpense: "Monthly Expense",
        netCashFlow: "Net Cash Flow",
        budgetRemaining: "Budget Remaining",
        loginTitle: "Login",
        email: "Email",
        password: "Password",
        loginButton: "Login",
        createCategory: "Create Category",
        editCategory: "Edit Category",
        updateCategory: "Update Category",
        cancelEdit: "Cancel edit",
        categoryPlaceholder: "Food, Salary, Transport",
        categoryColor: "Category color",
        createTransaction: "Create Transaction",
        editTransaction: "Edit Transaction",
        updateTransaction: "Update Transaction",
        type: "Type",
        category: "Category",
        amount: "Amount",
        date: "Date",
        merchant: "Merchant / Source",
        note: "Note",
        optional: "Optional",
        categories: "Categories",
        thisMonthTransactions: "This Month Transactions",
        income: "Income",
        expense: "Expense",
        records: "records",
        noNote: "No note",
        editCategoryTitle: "Edit category",
        deleteCategoryTitle: "Delete category",
        editTransactionTitle: "Edit transaction",
        deleteTransactionTitle: "Delete transaction",
        categoriesEmpty: "Login to load categories.",
        transactionsEmpty: "Login to load transactions.",
        createMatchingCategory: "Create a matching category first",
        loginSuccess: "Login successful. Data loaded from the database.",
        loggedOut: "Logged out.",
        categoryUpdated: "Category updated.",
        categoryCreated: "Category created.",
        categoryDeleted: "Category deleted.",
        transactionUpdated: "Transaction updated.",
        transactionCreated: "Transaction created.",
        transactionDeleted: "Transaction deleted.",
        selectCategoryFirst: "Please create or select a category first.",
        deleteCategoryConfirm: "Delete this category? Transactions using this category may block deletion.",
        deleteTransactionConfirm: "Delete this transaction?",
        somethingWrong: "Something went wrong.",
        loginRequired: "Please login first.",
        requestFailed: "Request failed"
    },
    zh: {
        appTitle: "\u500b\u4eba\u7406\u8ca1 App",
        brand: "\u500b\u4eba\u7406\u8ca1",
        languageButton: "\u8a9e\u8a00",
        logout: "\u767b\u51fa",
        eyebrow: "Spring Boot + Bootstrap \u5c65\u6b77\u4f5c\u54c1",
        heroTitle: "\u500b\u4eba\u7406\u8ca1\u7ba1\u7406\u7cfb\u7d71",
        heroLead: "\u4e00\u500b\u5168\u7aef\u4f5c\u54c1\uff0c\u5305\u542b JWT \u767b\u5165\u3001\u8cc7\u6599\u5eab CRUD\u3001\u6708\u5ea6\u7d71\u8a08\u548c\u4e7e\u6de8\u7684 Bootstrap \u5100\u8868\u677f\u3002",
        demoLogin: "\u8a66\u7528\u767b\u5165",
        apiStatus: "API \u72c0\u614b",
        monthlyIncome: "\u672c\u6708\u6536\u5165",
        monthlyExpense: "\u672c\u6708\u652f\u51fa",
        netCashFlow: "\u6de8\u73fe\u91d1\u6d41",
        budgetRemaining: "\u9810\u7b97\u5269\u9918",
        loginTitle: "\u767b\u5165",
        email: "\u96fb\u5b50\u90f5\u4ef6",
        password: "\u5bc6\u78bc",
        loginButton: "\u767b\u5165",
        createCategory: "\u65b0\u589e\u5206\u985e",
        editCategory: "\u7de8\u8f2f\u5206\u985e",
        updateCategory: "\u66f4\u65b0\u5206\u985e",
        cancelEdit: "\u53d6\u6d88\u7de8\u8f2f",
        categoryPlaceholder: "\u9910\u98f2\u3001\u85aa\u8cc7\u3001\u4ea4\u901a",
        categoryColor: "\u5206\u985e\u984f\u8272",
        createTransaction: "\u65b0\u589e\u4ea4\u6613",
        editTransaction: "\u7de8\u8f2f\u4ea4\u6613",
        updateTransaction: "\u66f4\u65b0\u4ea4\u6613",
        type: "\u985e\u578b",
        category: "\u5206\u985e",
        amount: "\u91d1\u984d",
        date: "\u65e5\u671f",
        merchant: "\u5546\u5bb6 / \u4f86\u6e90",
        note: "\u5099\u8a3b",
        optional: "\u9078\u586b",
        categories: "\u5206\u985e",
        thisMonthTransactions: "\u672c\u6708\u4ea4\u6613",
        income: "\u6536\u5165",
        expense: "\u652f\u51fa",
        records: "\u7b46\u8cc7\u6599",
        noNote: "\u7121\u5099\u8a3b",
        editCategoryTitle: "\u7de8\u8f2f\u5206\u985e",
        deleteCategoryTitle: "\u522a\u9664\u5206\u985e",
        editTransactionTitle: "\u7de8\u8f2f\u4ea4\u6613",
        deleteTransactionTitle: "\u522a\u9664\u4ea4\u6613",
        categoriesEmpty: "\u767b\u5165\u5f8c\u8f09\u5165\u5206\u985e\u3002",
        transactionsEmpty: "\u767b\u5165\u5f8c\u8f09\u5165\u4ea4\u6613\u3002",
        createMatchingCategory: "\u8acb\u5148\u5efa\u7acb\u5c0d\u61c9\u985e\u578b\u7684\u5206\u985e",
        loginSuccess: "\u767b\u5165\u6210\u529f\uff0c\u5df2\u5f9e\u8cc7\u6599\u5eab\u8f09\u5165\u8cc7\u6599\u3002",
        loggedOut: "\u5df2\u767b\u51fa\u3002",
        categoryUpdated: "\u5206\u985e\u5df2\u66f4\u65b0\u3002",
        categoryCreated: "\u5206\u985e\u5df2\u65b0\u589e\u3002",
        categoryDeleted: "\u5206\u985e\u5df2\u522a\u9664\u3002",
        transactionUpdated: "\u4ea4\u6613\u5df2\u66f4\u65b0\u3002",
        transactionCreated: "\u4ea4\u6613\u5df2\u65b0\u589e\u3002",
        transactionDeleted: "\u4ea4\u6613\u5df2\u522a\u9664\u3002",
        selectCategoryFirst: "\u8acb\u5148\u65b0\u589e\u6216\u9078\u64c7\u5206\u985e\u3002",
        deleteCategoryConfirm: "\u8981\u522a\u9664\u9019\u500b\u5206\u985e\u55ce\uff1f\u82e5\u6709\u4ea4\u6613\u6b63\u5728\u4f7f\u7528\u53ef\u80fd\u6703\u7121\u6cd5\u522a\u9664\u3002",
        deleteTransactionConfirm: "\u8981\u522a\u9664\u9019\u7b46\u4ea4\u6613\u55ce\uff1f",
        somethingWrong: "\u767c\u751f\u932f\u8aa4\u3002",
        loginRequired: "\u8acb\u5148\u767b\u5165\u3002",
        requestFailed: "\u8acb\u6c42\u5931\u6557"
    },
    ja: {
        appTitle: "\u500b\u4eba\u8cc7\u7523\u7ba1\u7406\u30a2\u30d7\u30ea",
        brand: "\u500b\u4eba\u8cc7\u7523\u7ba1\u7406",
        languageButton: "\u8a00\u8a9e",
        logout: "\u30ed\u30b0\u30a2\u30a6\u30c8",
        eyebrow: "Spring Boot + Bootstrap \u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa",
        heroTitle: "\u500b\u4eba\u8cc7\u7523\u7ba1\u7406\u30de\u30cd\u30fc\u30b8\u30e3\u30fc",
        heroLead: "JWT \u30ed\u30b0\u30a4\u30f3\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9 CRUD\u3001\u6708\u6b21\u30b5\u30de\u30ea\u30fc\u3001Bootstrap \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u5099\u3048\u305f\u30d5\u30eb\u30b9\u30bf\u30c3\u30af\u4f5c\u54c1\u3067\u3059\u3002",
        demoLogin: "\u30c7\u30e2\u30ed\u30b0\u30a4\u30f3",
        apiStatus: "API \u72b6\u614b",
        monthlyIncome: "\u6708\u9593\u53ce\u5165",
        monthlyExpense: "\u6708\u9593\u652f\u51fa",
        netCashFlow: "\u7d14\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc",
        budgetRemaining: "\u4e88\u7b97\u6b8b\u9ad8",
        loginTitle: "\u30ed\u30b0\u30a4\u30f3",
        email: "\u30e1\u30fc\u30eb",
        password: "\u30d1\u30b9\u30ef\u30fc\u30c9",
        loginButton: "\u30ed\u30b0\u30a4\u30f3",
        createCategory: "\u30ab\u30c6\u30b4\u30ea\u30fc\u4f5c\u6210",
        editCategory: "\u30ab\u30c6\u30b4\u30ea\u30fc\u7de8\u96c6",
        updateCategory: "\u30ab\u30c6\u30b4\u30ea\u30fc\u66f4\u65b0",
        cancelEdit: "\u7de8\u96c6\u3092\u30ad\u30e3\u30f3\u30bb\u30eb",
        categoryPlaceholder: "\u98df\u8cbb\u3001\u7d66\u4e0e\u3001\u4ea4\u901a",
        categoryColor: "\u30ab\u30c6\u30b4\u30ea\u30fc\u306e\u8272",
        createTransaction: "\u53d6\u5f15\u4f5c\u6210",
        editTransaction: "\u53d6\u5f15\u7de8\u96c6",
        updateTransaction: "\u53d6\u5f15\u66f4\u65b0",
        type: "\u7a2e\u5225",
        category: "\u30ab\u30c6\u30b4\u30ea\u30fc",
        amount: "\u91d1\u984d",
        date: "\u65e5\u4ed8",
        merchant: "\u5e97\u8217 / \u5165\u91d1\u5143",
        note: "\u30e1\u30e2",
        optional: "\u4efb\u610f",
        categories: "\u30ab\u30c6\u30b4\u30ea\u30fc",
        thisMonthTransactions: "\u4eca\u6708\u306e\u53d6\u5f15",
        income: "\u53ce\u5165",
        expense: "\u652f\u51fa",
        records: "\u4ef6",
        noNote: "\u30e1\u30e2\u306a\u3057",
        editCategoryTitle: "\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u7de8\u96c6",
        deleteCategoryTitle: "\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u524a\u9664",
        editTransactionTitle: "\u53d6\u5f15\u3092\u7de8\u96c6",
        deleteTransactionTitle: "\u53d6\u5f15\u3092\u524a\u9664",
        categoriesEmpty: "\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u8aad\u307f\u8fbc\u307f\u307e\u3059\u3002",
        transactionsEmpty: "\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\u53d6\u5f15\u3092\u8aad\u307f\u8fbc\u307f\u307e\u3059\u3002",
        createMatchingCategory: "\u5148\u306b\u540c\u3058\u7a2e\u5225\u306e\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u4f5c\u6210\u3057\u3066\u304f\u3060\u3055\u3044",
        loginSuccess: "\u30ed\u30b0\u30a4\u30f3\u6210\u529f\u3002\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u304b\u3089\u8aad\u307f\u8fbc\u307f\u307e\u3057\u305f\u3002",
        loggedOut: "\u30ed\u30b0\u30a2\u30a6\u30c8\u3057\u307e\u3057\u305f\u3002",
        categoryUpdated: "\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002",
        categoryCreated: "\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3057\u305f\u3002",
        categoryDeleted: "\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u524a\u9664\u3057\u307e\u3057\u305f\u3002",
        transactionUpdated: "\u53d6\u5f15\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002",
        transactionCreated: "\u53d6\u5f15\u3092\u4f5c\u6210\u3057\u307e\u3057\u305f\u3002",
        transactionDeleted: "\u53d6\u5f15\u3092\u524a\u9664\u3057\u307e\u3057\u305f\u3002",
        selectCategoryFirst: "\u5148\u306b\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u4f5c\u6210\u307e\u305f\u306f\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
        deleteCategoryConfirm: "\u3053\u306e\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f\u4f7f\u7528\u4e2d\u306e\u53d6\u5f15\u304c\u3042\u308b\u3068\u524a\u9664\u3067\u304d\u306a\u3044\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002",
        deleteTransactionConfirm: "\u3053\u306e\u53d6\u5f15\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
        somethingWrong: "\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002",
        loginRequired: "\u5148\u306b\u30ed\u30b0\u30a4\u30f3\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
        requestFailed: "\u30ea\u30af\u30a8\u30b9\u30c8\u5931\u6557"
    }
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
    document.querySelectorAll("[data-lang]").forEach(button => {
        button.addEventListener("click", () => setLanguage(button.dataset.lang));
    });

    applyTranslations();
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
        showAlert(t("loginSuccess"), "success");
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
    showAlert(t("loggedOut"), "secondary");
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
        showAlert(id ? t("categoryUpdated") : t("categoryCreated"), "success");
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
    state.categoryEditing = true;
    document.getElementById("categoryFormTitle").textContent = t("editCategory");
    setButtonHtml("saveCategoryButton", "bi-save", t("updateCategory"));
    document.getElementById("cancelCategoryEditButton").classList.remove("d-none");
}

async function deleteCategory(id) {
    if (!confirm(t("deleteCategoryConfirm"))) return;
    try {
        requireLogin();
        await api(`/api/categories/${id}`, { method: "DELETE" });
        showAlert(t("categoryDeleted"), "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function resetCategoryForm() {
    document.getElementById("categoryForm").reset();
    state.categoryEditing = false;
    document.getElementById("categoryIdInput").value = "";
    document.getElementById("categoryColorInput").value = "#2563eb";
    document.getElementById("categoryFormTitle").textContent = t("createCategory");
    setButtonHtml("saveCategoryButton", "bi-plus-circle", t("createCategory"));
    document.getElementById("cancelCategoryEditButton").classList.add("d-none");
}

async function saveTransaction(event) {
    event.preventDefault();
    try {
        requireLogin();
        const id = document.getElementById("transactionIdInput").value;
        const categoryId = Number(document.getElementById("transactionCategoryInput").value);
        if (!categoryId) {
            throw new Error(t("selectCategoryFirst"));
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
        showAlert(id ? t("transactionUpdated") : t("transactionCreated"), "success");
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
    state.transactionEditing = true;
    document.getElementById("transactionFormTitle").textContent = t("editTransaction");
    setButtonHtml("saveTransactionButton", "bi-save", t("updateTransaction"));
    document.getElementById("cancelTransactionEditButton").classList.remove("d-none");
}

async function deleteTransaction(id) {
    if (!confirm(t("deleteTransactionConfirm"))) return;
    try {
        requireLogin();
        await api(`/api/transactions/${id}`, { method: "DELETE" });
        showAlert(t("transactionDeleted"), "success");
        await loadDashboard();
    } catch (error) {
        showError(error);
    }
}

function resetTransactionForm() {
    document.getElementById("transactionForm").reset();
    state.transactionEditing = false;
    document.getElementById("transactionIdInput").value = "";
    document.getElementById("dateInput").value = today.toISOString().slice(0, 10);
    document.getElementById("amountInput").value = "120";
    document.getElementById("merchantInput").value = "Coffee Shop";
    document.getElementById("transactionFormTitle").textContent = t("createTransaction");
    setButtonHtml("saveTransactionButton", "bi-check2-circle", t("createTransaction"));
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
        throw new Error(error.message || `${t("requestFailed")}: ${response.status}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function renderCategories() {
    document.getElementById("categoryCount").textContent = `${state.categories.length} ${t("records")}`;
    document.getElementById("categoryList").innerHTML = state.categories.map(category => `
        <div class="category-pill">
            <div class="d-flex align-items-center gap-2 min-width-0">
                <span class="color-dot" style="background:${category.color}"></span>
                <strong class="text-truncate">${escapeHtml(category.name)}</strong>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge ${category.type === "INCOME" ? "text-bg-success" : "text-bg-danger"}">
                    ${category.type === "INCOME" ? t("income") : t("expense")}
                </span>
                <button class="icon-button" type="button" title="${escapeHtml(t("editCategoryTitle"))}" onclick="editCategory(${category.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="icon-button text-danger" type="button" title="${escapeHtml(t("deleteCategoryTitle"))}" onclick="deleteCategory(${category.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join("") || emptyState(t("categoriesEmpty"));
}

function renderCategoryOptions(selectedId) {
    const type = document.getElementById("transactionTypeInput").value;
    const options = state.categories
        .filter(category => category.type === type)
        .map(category => `<option value="${category.id}" ${Number(selectedId) === category.id ? "selected" : ""}>${escapeHtml(category.name)}</option>`)
        .join("");
    document.getElementById("transactionCategoryInput").innerHTML = options || `<option value="">${escapeHtml(t("createMatchingCategory"))}</option>`;
}

function renderTransactions() {
    document.getElementById("transactionCount").textContent = `${state.transactions.length} ${t("records")}`;
    document.getElementById("transactionList").innerHTML = state.transactions.map(item => {
        const isIncome = item.type === "INCOME";
        const amountClass = isIncome ? "amount-income" : "amount-expense";
        const sign = isIncome ? "+" : "-";
        return `
            <div class="transaction-item">
                <div class="min-width-0">
                    <strong class="d-block text-truncate">${escapeHtml(item.merchant)}</strong>
                    <small>${item.occurredOn} / ${escapeHtml(item.categoryName)} / ${escapeHtml(item.note || t("noNote"))}</small>
                </div>
                <div class="text-end">
                    <strong class="${amountClass}">${sign}${currency.format(item.amount)}</strong>
                    <div class="mt-2">
                        <button class="icon-button" type="button" title="${escapeHtml(t("editTransactionTitle"))}" onclick="editTransaction(${item.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="icon-button text-danger" type="button" title="${escapeHtml(t("deleteTransactionTitle"))}" onclick="deleteTransaction(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("") || emptyState(t("transactionsEmpty"));
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
    showAlert(error.message || t("somethingWrong"), "danger");
}

function requireLogin() {
    if (!state.token) {
        throw new Error(t("loginRequired"));
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

function setLanguage(lang) {
    if (!translations[lang]) return;
    state.lang = lang;
    localStorage.setItem("financeLanguage", lang);
    applyTranslations();
    renderCategories();
    renderCategoryOptions();
    renderTransactions();
}

function applyTranslations() {
    document.documentElement.lang = state.lang;
    document.title = t("appTitle");
    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(element => {
        element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll("#categoryTypeInput option, #transactionTypeInput option").forEach(option => {
        option.textContent = option.value === "INCOME" ? t("income") : t("expense");
    });
    document.querySelectorAll("[data-lang]").forEach(button => {
        button.classList.toggle("active", button.dataset.lang === state.lang);
    });
    document.getElementById("categoryFormTitle").textContent = state.categoryEditing ? t("editCategory") : t("createCategory");
    setButtonHtml("saveCategoryButton", state.categoryEditing ? "bi-save" : "bi-plus-circle", state.categoryEditing ? t("updateCategory") : t("createCategory"));
    document.getElementById("transactionFormTitle").textContent = state.transactionEditing ? t("editTransaction") : t("createTransaction");
    setButtonHtml("saveTransactionButton", state.transactionEditing ? "bi-save" : "bi-check2-circle", state.transactionEditing ? t("updateTransaction") : t("createTransaction"));
}

function t(key) {
    return translations[state.lang]?.[key] || translations.en[key] || key;
}

function setButtonHtml(id, icon, label) {
    document.getElementById(id).innerHTML = `<i class="bi ${icon} me-1"></i>${escapeHtml(label)}`;
}
