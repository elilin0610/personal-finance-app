# Personal Finance App

A Spring Boot portfolio project with a Bootstrap frontend for tracking income, expenses, monthly budgets, and financial summaries.

## Why This Project Is Resume-Friendly

- JWT-based authentication with Spring Security
- Clean layered architecture: controller, service, repository, DTO, entity
- JPA domain modeling for users, categories, transactions, and budgets
- Monthly reporting endpoint with aggregation logic
- Bootstrap, HTML, CSS, and JavaScript frontend served by Spring Boot
- H2 for local development and PostgreSQL driver ready for deployment
- Bean Validation, centralized API errors, actuator health checks, and integration tests

## Tech Stack

- Java 21
- Spring Boot 3.5.3
- Spring Web
- Spring Security
- Spring Data JPA
- H2 Database
- PostgreSQL Driver
- HTML, CSS, JavaScript
- Bootstrap 5
- Maven Wrapper

## Run Locally

```bash
./mvnw package
java -jar target/personal-finance-app-0.0.1-SNAPSHOT.jar
```

On Windows PowerShell:

```powershell
.\mvnw.cmd package
java -jar target\personal-finance-app-0.0.1-SNAPSHOT.jar
```

The app runs at:

```text
http://localhost:8080
```

Open this URL in the browser to use the Bootstrap frontend. The frontend can login with the demo account, load categories, create categories, create transactions, and show monthly summary metrics.

API status JSON:

```text
http://localhost:8080/api/status
```

H2 Console:

```text
http://localhost:8080/h2-console
```

Demo login:

```text
email: demo@finance.dev
password: password123
```

## API Examples

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

Login:

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

## Test

```bash
./mvnw test
```
