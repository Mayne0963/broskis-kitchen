export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  popular?: boolean
  infused?: boolean // Flag for items that require age verification
}
