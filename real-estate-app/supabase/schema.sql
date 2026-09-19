-- 不動産管理アプリ用のテーブルとRLS（行レベルセキュリティ）の設定
-- Supabaseダッシュボードの「SQL Editor」に貼り付けて実行する（何度実行しても安全）

-- 物件テーブル
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  -- 登録したユーザー。指定しなければログイン中のユーザーのIDが自動で入る
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  name text not null,                        -- 物件名
  rent integer not null check (rent >= 0),   -- 家賃（円）
  area text not null,                        -- エリア名
  floor_plan text not null,                  -- 間取り（例：1LDK）
  created_at timestamptz not null default now()
);

-- 「自分の物件」を絞り込む検索が速くなるようにする
create index if not exists properties_user_id_idx
  on public.properties (user_id);

-- RLSを有効にする（以降、ポリシーで許可した行にしかアクセスできない）
alter table public.properties enable row level security;

-- API経由で使える権限：ログイン済みユーザー（authenticated）のみ。未ログイン（anon）には与えない
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- 自分が登録した物件だけ参照できる
drop policy if exists "properties_select_own" on public.properties;
create policy "properties_select_own"
  on public.properties for select to authenticated
  using ((select auth.uid()) = user_id);

-- 登録できるのは、登録者（user_id）が自分自身の物件だけ
drop policy if exists "properties_insert_own" on public.properties;
create policy "properties_insert_own"
  on public.properties for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分の物件だけ編集でき、user_id を他人に書き換えることもできない
drop policy if exists "properties_update_own" on public.properties;
create policy "properties_update_own"
  on public.properties for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分の物件だけ削除できる
drop policy if exists "properties_delete_own" on public.properties;
create policy "properties_delete_own"
  on public.properties for delete to authenticated
  using ((select auth.uid()) = user_id);
