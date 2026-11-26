# Personal Finance App｜個人理財應用

**繁體中文** | [English](./README.en.md) | [日本語](./README.ja.md)

以 Java / Spring Boot 與 Bootstrap 製作的 **AI 協作學習專案**，將記帳需求做成可在本機操作的 Web 原型。使用者可以管理收支分類與交易，查看月度收入、支出及預算摘要，並切換中文、英文與日文介面。

> 此作品展示需求拆解、AI 工具協作與功能迭代的過程，不代表作者已能獨立完成所有後端、安全或部署工作。現有設定適合本機示範，不是可直接公開上線的正式金融服務。

## 專案動機與我的參與

希望把「記錄收支、查詢每月結餘」從靜態表格變成有資料庫的互動介面，並探索如何透過 AI 協作，把功能需求逐步做成能操作的產品。

- **我負責的部分：** 提出資料庫 CRUD 需求；指定中／英／日語言切換、下拉選單的位置與外觀；透過對話提出修改需求，要求分版本保存到 GitHub，並啟動作品查看。
- **Codex 協助的部分：** 專案架構、程式碼撰寫、資料庫配置、測試與建置、Git 提交及啟動問題排查。
- **目前定位：** 持續補足程式基礎的學習者，以需求表達與 AI 協作為起點，逐步理解 API、資料持久化與前後端資料流。不把 AI 產出的程式碼等同於已獨立掌握的技術。

## 已有功能

- 註冊、登入與 JWT 驗證；密碼使用 BCrypt 雜湊。
- 分類與收支交易的新增、查詢、修改、刪除（CRUD）。
- 依月份查詢交易，彙整收入、支出、結餘、預算總額、預算餘額及前五大支出分類。
- 後端提供月度預算 CRUD API；不將 API 功能一律視為已完成的前端操作。
- 中／英／日介面選單，使用 localStorage 保存語言偏好。
- 檔案型 H2 資料庫，重新啟動後可保留本機資料。
- Bean Validation、集中式 API 錯誤回應與健康檢查端點。

## 使用技術與工具

| 類別 | 專案使用內容 |
| --- | --- |
| 後端 | Java 21、Spring Boot 3.5.3、Spring Web |
| 資料存取 | Spring Data JPA / Hibernate、H2 |
| 登入驗證 | Spring Security、BCrypt、JWT |
| 前端 | HTML、CSS、JavaScript、Bootstrap 5.3.3、Bootstrap Icons |
| 測試 | JUnit 5、Spring Boot Test、MockMvc |
| 建置／版本管理 | Maven Wrapper、Git、GitHub |
| AI 協作 | OpenAI Codex，透過需求描述與迭代修改完成原型 |

以上是作品採用的技術，不是作者的熟練技能清單。PostgreSQL 目前只有驅動依賴，**尚未證明已完成 PostgreSQL 部署**。未確認曾使用特定 `SKILL.md` 套件，因此不列出未經核實的 AI skill 名稱。

## 程式結構

```text
src/main/java/com/gemini/finance/
  auth/          註冊、登入
  category/      收支分類
  transaction/   交易紀錄
  budget/        月度預算
  report/        月度統計
  security/      驗證與授權設定
  common/        共用回應與錯誤處理
src/main/resources/static/    前端 HTML / CSS / JavaScript
src/test/                     自動化測試
```

主要採 Controller → Service → Repository 的分層方式，搭配 DTO 與 JPA Entity。

## 本機執行

需要 **JDK 21**。首次建置需連網下載 Maven／相依套件；前端 Bootstrap 使用 CDN，也需要連網。

Windows PowerShell：

```powershell
.\mvnw.cmd package
java -jar target\personal-finance-app-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
```

macOS / Linux：

```bash
./mvnw package
java -jar target/personal-finance-app-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
```

瀏覽器開啟 http://localhost:8080 。指令將服務綁定本機介面，不應直接把目前的開發設定暴露到公網。

- 本機資料檔：`./data/finance.mv.db`
- API 狀態：`http://localhost:8080/api/status`
- 本機 H2 Console：`http://localhost:8080/h2-console`
- 示範帳號：`demo@finance.dev` / `password123`（僅為公開測試資料，不用於正式環境）

`data/` 與 `target/` 已列入 `.gitignore`。請勿提交自己的真實交易、資料庫、帳密或環境機密。

## 測試與目前驗證範圍

```powershell
.\mvnw.cmd test
```

或執行 `./mvnw test`。目前測試包含 Spring context 載入，以及註冊取得 token 後存取分類 API。現有測試報告記錄兩項通過；本次 README 整理沒有重新執行測試。這不代表完整 CRUD、跨帳號授權、安全性或端對端流程已全部驗證。

## 已知限制與公開展示注意事項

原始碼可以作為學習作品展示，但「公開原始碼」與「安全公開部署」不同。公開部署前至少需要：

- 替換開發用 JWT 預設值，透過部署環境的 `JWT_SECRET` 管理機密，切勿寫進 Git。
- 移除或停用固定示範帳號與示範資料。
- 關閉 H2 Console，採用適當的正式資料庫與憑證管理。
- 檢查 HTTPS、CORS / CSRF 策略、登入防濫用、錯誤資訊與存取控制。
- 評估目前 localStorage 保存 token 的風險，並增加跨帳號資料隔離及安全測試。
- 只使用虛構交易作為展示資料，避免蒐集或公開真實財務資訊。

尚未完成上述部署強化、全面安全稽核或正式環境驗證，不宣稱銀行等級安全，也沒有串接銀行帳戶或投資交易功能。

## 後續學習方向

逐步理解並能自行修改現有 API、補齊 CRUD 與授權測試、改善預算操作介面，以及建立分離的開發／展示環境。這些是計畫，不是已完成成果。

## API 範例

註冊：

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "password123"
}
```

登入：

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@finance.dev",
  "password": "password123"
}
```

使用回傳的權杖：

```http
Authorization: Bearer <accessToken>
```

建立分類：

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

新增交易：

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

月度摘要：

```http
GET /api/reports/monthly-summary?month=2026-07
Authorization: Bearer <accessToken>
```

## 測試指令

```bash
./mvnw test
```
