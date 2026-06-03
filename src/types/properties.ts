export type Property = {
  id: string
  title: string
  city?: string
  category?: string
  subcategory?: string
  image?: string
  status?: string

  // 🔥 ADD THIS
  is_my_property?: boolean
}