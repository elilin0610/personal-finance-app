# Personal Finance App

[繁體中文](./README.md) | **English** | [日本語](./README.ja.md)

A **learning project built with AI assistance** that turns personal bookkeeping into a local web prototype using Java, Spring Boot, and Bootstrap. Users can manage income and expense categories and transactions, view monthly income, spending, and budget summaries, and switch the UI between Traditional Chinese, English, and Japanese.

> This project demonstrates how I broke down requirements, worked with AI tools, and iterated on features. It does not claim that I can independently handle all backend, security, or deployment work. The current configuration is for local demonstrations, not for running a public production financial service.

## Motivation and my involvement

I wanted to turn recording income and expenses and checking monthly balances into an interactive, database-backed experience, and to learn how to build a usable product incrementally with AI assistance.

- **What I did:** Defined the database CRUD requirements; specified the language switch and the position and appearance of the menu; requested revisions in conversation, asked for versions to be saved on GitHub, and launched the app to inspect it.
- **What Codex helped with:** Architecture, coding, database configuration, tests and builds, Git commits, and troubleshooting startup.
- **Where I am now:** I am still building up my programming fundamentals. I started by learning to communicate requirements and work with AI, and I am now working to understand APIs, persistence, and data flow between the frontend and backend. AI-generated code is not evidence of mastery.

## Features available now

- Registration, sign-in, and JWT authentication; passwords are hashed with BCrypt.
- Create, read, update, and delete (CRUD) income and expense categories and transactions.
- Search transactions by month and summarize income, spending, balance, total budget, budget remaining, and the five largest expense categories.
- Backend CRUD API for monthly budgets. Not every API operation has a completed frontend control.
- UI language menu for Traditional Chinese, English, and Japanese; preference persists in localStorage.
- File-based H2 database that preserves local data across restarts.
- Bean Validation, centralized API error responses, and a health-check endpoint.

## Technologies and tools

| Area | What the project uses |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5.3, Spring Web |
| Data access | Spring Data JPA / Hibernate, H2 |
| Login and authentication | Spring Security, BCrypt, JWT |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5.3.3, Bootstrap Icons |
| Testing | JUnit 5, Spring Boot Test, MockMvc |
| Build and version control | Maven Wrapper, Git, GitHub |
| AI assistance | OpenAI Codex; prototype built through requirements and iterative revisions |

This is the project's technology stack, not a list of tools I claim to have mastered. The PostgreSQL driver is included as a dependency, but **PostgreSQL deployment has not been verified**. No specific `SKILL.md` package has been confirmed, so no unverified AI skills are listed here.

## Project layout

```text
src/main/java/com/gemini/finance/
  auth/          Registration and sign-in
  category/      Income and expense categories
  transaction/   Transaction records
  budget/        Monthly budgets
  report/        Monthly statistics
  security/      Authentication and authorization configuration
  common/        Shared responses and error handling
src/main/resources/static/    Frontend HTML / CSS / JavaScript
src/test/                     Automated tests
```

The application is mainly layered as Controller → Service → Repository, with DTOs and JPA entities.

## Run locally

**JDK 21** is required. The first build needs internet access to download Maven and its dependencies. The Bootstrap CDN used by the frontend also requires internet access.

Windows PowerShell:

```powershell
.\mvnw.cmd package
java -jar target\personal-finance-app-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
```

macOS / Linux:

```bash
./mvnw package
java -jar target/personal-finance-app-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
```

Open http://localhost:8080 in a browser. The commands bind the service to the local interface. Do not expose the current development configuration directly to the public internet.

- Local data file: `./data/finance.mv.db`
- API status: `http://localhost:8080/api/status`
- Local H2 Console: `http://localhost:8080/h2-console`
- Demo account: `demo@finance.dev` / `password123` (public test data only; do not use in production)

`data/` and `target/` are in `.gitignore`. Do not commit real transactions, databases, credentials, or environment secrets.

## Tests and verification scope

```powershell
.\mvnw.cmd test
```

Alternatively, run `./mvnw test`. Current tests cover Spring context loading and reaching the categories API after registering and receiving a token. Existing test reports record two passing tests, but the README revision did not rerun them. This does not establish complete coverage of CRUD, cross-account authorization, security, or end-to-end flows.

## Known limits and considerations for public demos

The source code can be shown as a learning project, but publicly sharing source code is not the same as safely deploying it. Before public deployment:

- Replace the development JWT default and manage the secret through the deployment environment's `JWT_SECRET`. Never commit it to Git.
- Remove or disable the fixed demo account and demo data.
- Disable the H2 Console and use appropriate production database and credential management.
- Review HTTPS, CORS / CSRF policy, login abuse prevention, error disclosure, and access control.
- Assess the risks of storing tokens in localStorage and add cross-account isolation and security tests.
- Use only fictional demo transactions and do not collect or publish real financial data.

Deployment hardening, full security assessment, and production verification are unfinished. The app does not claim bank-grade security and does not connect to bank accounts or execute investment transactions.

## What I plan to learn next

Understand the existing APIs well enough to modify them independently, fill gaps in CRUD and authorization tests, improve the budget controls, and separate development from demo environments. These are plans, not finished work.

## API examples

Register:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "password123"
}
```

Sign in:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@finance.dev",
  "password": "password123"
}
```

Use the returned token:

```http
Authorization: Bearer <accessToken>
```

Create a category:

```http
POST /api/categories
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "name": "Food",
  "type": "EXPENSE",
  "color": "#EF4444"
}
```

Create a transaction:

```http
POST /api/transactions
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "categoryId": 1,
  "type": "EXPENSE",
  "amount": 120.50,
  "occurredOn": "2026-07-09",
  "merchant": "Lunch",
  "note": "Business district"
}
```

Monthly summary:

```http
GET /api/reports/monthly-summary?month=2026-07
Authorization: Bearer <accessToken>
```

## Test command

```bash
./mvnw test
```
