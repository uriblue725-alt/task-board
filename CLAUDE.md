# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## デプロイ先

https://uriblue725-alt.github.io/task-board/

`main` ブランチへの push をトリガーに、GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) がビルドして自動デプロイする。

## 技術スタック

- React 18 + Vite 6（`@vitejs/plugin-react`）
- プレーンCSS（CSS Modulesやライブラリは未導入。コンポーネントごとに同名の `.css` を用意する）
- 状態管理はReact標準の `useState` / `useEffect` のみ（外部の状態管理ライブラリは未導入）
- データ永続化は `localStorage`（[src/App.jsx](src/App.jsx) の `STORAGE_KEY` 参照。バックエンド/DBは無し）
- Lint: ESLint（`npm run lint`）
- デプロイ: GitHub Actions + GitHub Pages（`vite.config.js` の `base: '/task-board/'` はリポジトリ名に合わせたパス）

## コンポーネントの命名規約

- コンポーネントファイルはパスカルケース（例: `App.jsx`）、エントリーポイントなど非コンポーネントファイルはキャメルケース（例: `main.jsx`）。
- コンポーネント用CSSは同名の `.css` をコンポーネントファイルと同じディレクトリに置く（例: `App.jsx` ⇔ `App.css`）。ページ全体に関わるグローバルスタイルのみ `index.css` に置く。
- CSSクラス名はケバブケース（例: `task-item`, `task-form`, `delete-button`）。状態を表す修飾クラスはBEM風の単一クラス追加で表現する（例: 完了タスクに `completed` クラスを追加）。
- イベントハンドラ関数は `handle` + 対象 + 動作のキャメルケース（例: `handleAddTask`, `handleToggleTask`, `handleDeleteTask`）。
- state変数はキャメルケースの名詞（例: `tasks`, `inputText`）。

## real-estate-app（不動産管理アプリ）

タスクボードとは別の Vite プロジェクトで、`real-estate-app/` 配下に置く。コマンド（`npm run dev` / `npm run build`）はそのディレクトリで実行する。GitHub Pages のデプロイ対象外（上記デプロイ先はタスクボードのみ）。デプロイは Vercel を想定し、React Router の直接アクセス用に [vercel.json](real-estate-app/vercel.json) で全 URL を `index.html` に書き換える。Vercel 側の Root Directory は `real-estate-app` にし、環境変数（下記2つ）は Vercel ダッシュボードで設定する（`vercel.json` には書かない）。

- 構成: React 18 + Vite 6 + react-router-dom 7 + `@supabase/supabase-js`。Supabase のメールアドレス＋パスワード認証。
- 環境変数: `real-estate-app/.env`（gitignore 済み）に `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定する。ひな形は `.env.example`。未設定だと [supabaseClient.js](real-estate-app/src/lib/supabaseClient.js) が起動時にエラーを投げる。
- 認証の流れ: ログイン状態は [AuthContext.jsx](real-estate-app/src/contexts/AuthContext.jsx) が保持し、未ログインのリダイレクトは [ProtectedRoute.jsx](real-estate-app/src/components/ProtectedRoute.jsx)、ログイン済みユーザーの `/login` `/signup` からの転送は各ページ側で行う。ログイン・会員登録は共通の `AuthForm` を使う。
- 物件データは Supabase の `properties` テーブル（物件名・家賃・エリア・間取り・登録者 `user_id`）。定義と RLS ポリシー（自分の物件だけ参照・登録・編集・削除できる）は [schema.sql](real-estate-app/supabase/schema.sql) にあり、Supabase の SQL Editor で手動実行する（CLI/マイグレーションは未使用）。
- DB 操作は [propertiesApi.js](real-estate-app/src/lib/propertiesApi.js) に集約している（DB の `floor_plan` とアプリ内の `floorPlan` を相互変換）。`user_id` はクライアントから送らず、DB の既定値 `auth.uid()` に任せる。一覧の絞り込みも RLS に任せ、クライアント側では条件を付けない。登録・編集は共通の `PropertyForm` を使う。
- コードコメントは日本語で書く。命名規約は上記タスクボードと同じ（ページは `pages/XxxPage.jsx`）。

## Git workflow

- コードを変更したら、その都度コミットしてGitHubにプッシュすること（変更をローカルに溜め込まない）。
- コミット前に `git status` / `git diff` で変更内容を確認してからコミットする。
- プッシュ先のリモートやブランチについて指示がない場合は、現在のブランチに対して通常の `git push` を行う。force push など破壊的な操作は明示的な指示がない限り行わない。
