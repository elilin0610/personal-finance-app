# Personal Finance App｜家計管理アプリ

[繁體中文](./README.md) | [English](./README.en.md) | **日本語**

Java、Spring Boot、Bootstrap を使い、家計簿の要件をローカルで操作できる Web プロトタイプにした、**AI と協力した学習プロジェクト**です。収入・支出の分類と取引を管理し、月ごとの収入・支出・予算を確認できます。画面は繁体字中国語・英語・日本語に切り替えられます。

> この作品は要件の分解、AI ツールとの協働、機能を反復改善する過程を示すものです。バックエンド、セキュリティ、デプロイのすべてを作者が独力で担当できることを示すものではありません。現在の構成はローカルデモ用であり、公開運用できる本番の金融サービスではありません。

## 開発の動機と私の関わり

収支の記録と毎月の残高確認を、静的な表からデータベースを備えた操作可能な画面に置き換えたかったためです。AI の支援を受けながら、段階的に使える製品へ仕上げる方法も学びました。

- **私の担当：** データベースの CRUD 要件を提示し、中・英・日の言語切り替え、メニューの位置と見た目を指定しました。対話で修正を依頼し、各版を GitHub に保存するよう求め、アプリを起動して確認しました。
- **Codex の支援：** 全体設計、コーディング、データベース設定、テストとビルド、Git コミット、起動時の問題調査です。
- **現在の位置づけ：** プログラミングの基礎を学習中です。要件を伝え、AI と協働するところから始め、API、永続化、フロントエンドとバックエンド間のデータの流れを理解しようとしています。AI が作ったコードは、私自身が技術を習得した証拠ではありません。

## 現在の機能

- ユーザー登録、ログイン、JWT 認証。パスワードは BCrypt でハッシュ化します。
- 収支の分類・取引を作成、取得、更新、削除（CRUD）できます。
- 月ごとに取引を検索し、収入、支出、残高、予算総額、予算残額、支出額が大きい上位 5 分類を集計します。
- バックエンドには月次予算の CRUD API があります。API が提供するすべての機能を画面で操作できるわけではありません。
- 繁体字中国語・英語・日本語の切り替えメニューがあり、設定は localStorage に保存されます。
- ファイルベースの H2 データベースを使用し、再起動後もローカルデータを保持します。
- Bean Validation、共通の API エラーレスポンス、ヘルスチェック用エンドポイントがあります。

## 使用技術とツール

| 分類 | このプロジェクトでの使用技術 |
| --- | --- |
| バックエンド | Java 21、Spring Boot 3.5.3、Spring Web |
| データアクセス | Spring Data JPA / Hibernate、H2 |
| ログイン・認証 | Spring Security、BCrypt、JWT |
| フロントエンド | HTML、CSS、JavaScript、Bootstrap 5.3.3、Bootstrap Icons |
| テスト | JUnit 5、Spring Boot Test、MockMvc |
| ビルド・バージョン管理 | Maven Wrapper、Git、GitHub |
| AI 支援 | OpenAI Codex。要件の説明と反復修正でプロトタイプを作成 |

上記は作品の技術構成であり、作者が習熟した技術の一覧ではありません。PostgreSQL はドライバー依存関係のみが含まれており、**PostgreSQL でのデプロイは未検証**です。特定の `SKILL.md` パッケージの使用は確認できていないため、未確認の AI スキル名は掲載していません。

## コード構成

```text
src/main/java/com/gemini/finance/
  auth/          登録、ログイン
  category/      収入・支出の分類
  transaction/   取引記録
  budget/        月次予算
  report/        月次集計
  security/      認証・認可の設定
  common/        共通レスポンスとエラー処理
src/main/resources/static/    フロントエンド HTML / CSS / JavaScript
src/test/                     自動テスト
```

主に Controller → Service → Repository のレイヤーに分かれ、DTO と JPA エンティティを使用します。

## ローカルで起動する

**JDK 21** が必要です。初回ビルドでは Maven と依存関係をダウンロードするため、インターネット接続が必要です。フロントエンドの Bootstrap CDN にも接続が必要です。

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

ブラウザーで http://localhost:8080 を開きます。これらのコマンドはサービスをローカルインターフェースにバインドします。現在の開発用設定を直接インターネットに公開しないでください。

- ローカルデータ：`./data/finance.mv.db`
- API の状態：`http://localhost:8080/api/status`
- ローカル H2 Console：`http://localhost:8080/h2-console`
- デモアカウント：`demo@finance.dev` / `password123`（公開テストデータ専用。本番では使用しないでください）

`data/` と `target/` は `.gitignore` の対象です。実際の取引、データベース、認証情報、環境の機密情報はコミットしないでください。

## テストと検証範囲

```powershell
.\mvnw.cmd test
```

または `./mvnw test` を実行します。テストは Spring のコンテキスト起動と、ユーザー登録・トークン取得後の分類 API へのアクセスを確認します。既存レポートには 2 件の成功が記録されていますが、README の更新ではテストを再実行していません。CRUD 全体、アカウント間の認可、セキュリティ、E2E フローの全面的な検証は行っていません。

## 既知の制限と公開デモ時の注意

ソースコードは学習作品として紹介できますが、公開することと、安全に本番公開することは別です。公開運用の前に、少なくとも次の対応が必要です。

- 開発用の JWT 既定値を置き換え、デプロイ環境の `JWT_SECRET` で機密を管理し、Git に含めない。
- 固定のデモアカウントとデモデータを削除または無効化する。
- H2 Console を無効化し、本番向けデータベースと適切な認証情報管理を使う。
- HTTPS、CORS / CSRF の方針、ログインの悪用対策、エラー情報の公開範囲、アクセス制御を確認する。
- localStorage にトークンを保存するリスクを評価し、アカウント間のデータ分離とセキュリティのテストを追加する。
- デモには架空取引だけを使用し、実際の金融データを収集・公開しない。

デプロイの安全対策、包括的なセキュリティ監査、本番環境の検証は未完了です。銀行水準のセキュリティをうたうものではなく、銀行口座連携や投資取引機能もありません。

## 今後の学習

既存 API を理解して自分で修正できるようになり、CRUD と認可のテストを補強し、予算操作の画面を改善し、開発環境とデモ環境を分ける予定です。いずれも計画であり、完了した成果ではありません。

## API の例

ユーザー登録：

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "password123"
}
```

ログイン：

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@finance.dev",
  "password": "password123"
}
```

返されたトークンを使う：

```http
Authorization: Bearer <accessToken>
```

分類の作成：

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

取引の作成：

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

月次サマリー：

```http
GET /api/reports/monthly-summary?month=2026-07
Authorization: Bearer <accessToken>
```

## テストコマンド

```bash
./mvnw test
```
