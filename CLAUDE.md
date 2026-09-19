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

## Git workflow

- コードを変更したら、その都度コミットしてGitHubにプッシュすること（変更をローカルに溜め込まない）。
- コミット前に `git status` / `git diff` で変更内容を確認してからコミットする。
- プッシュ先のリモートやブランチについて指示がない場合は、現在のブランチに対して通常の `git push` を行う。force push など破壊的な操作は明示的な指示がない限り行わない。
