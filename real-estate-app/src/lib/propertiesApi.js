import { supabase } from './supabaseClient'

const TABLE = 'properties'

// DBの列名（floor_plan）とアプリ内の名前（floorPlan）を相互に変換する
const toProperty = (row) => ({
  id: row.id,
  name: row.name,
  rent: row.rent,
  area: row.area,
  floorPlan: row.floor_plan,
})

const toRow = (values) => ({
  name: values.name,
  rent: values.rent,
  area: values.area,
  floor_plan: values.floorPlan,
})

// 物件一覧を新しい順に取得する
// 自分の物件だけが返る（絞り込みは DB 側の RLS ポリシーが行うため、ここでは条件を付けない）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(toProperty)
}

// 物件を登録する（user_id は送らない。DB の既定値 auth.uid() でログイン中のユーザーが入る）
export async function createProperty(values) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(values))
    .select()
    .single()
  if (error) throw error
  return toProperty(data)
}

// 物件を更新する（他人の物件は RLS により対象外になり、エラーになる）
export async function updateProperty(id, values) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(toRow(values))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toProperty(data)
}

// 物件を削除する
export async function deleteProperty(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .select('id')
  if (error) throw error
  // RLS で対象外の行は「エラーなしで0件削除」になるため、件数で確認する
  if (data.length === 0) throw new Error('対象の物件が見つかりませんでした')
}
