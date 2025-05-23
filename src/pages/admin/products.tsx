import { useState, useEffect, ChangeEvent, FormEvent } from 'react'

type Image = {
  id: string
  url: string
}

type Seller = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  brand: string
  yearSeries: number
  yearCar: number
  modelCode: string
  color: string
  condition: string
  priceINR: number
  priceKWD: number
  quantity: number
  description: string
  tags: string[]
  sku: string
  sellerId: string
  images: Image[]
  seller: Seller
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    yearSeries: undefined,
    yearCar: undefined,
    modelCode: '',
    color: '',
    condition: '',
    priceINR: undefined,
    priceKWD: undefined,
    quantity: undefined,
    description: '',
    tags: [],
    sku: '',
    sellerId: '',
    images: [],
  })

  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchSellers()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
  }

  async function fetchSellers() {
    const res = await fetch('/api/sellers')
    if (res.ok) {
      const data = await res.json()
      setSellers(data)
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'tags' ? value.split(',').map((t) => t.trim()) :
        name === 'yearSeries' || name === 'yearCar' || name === 'priceINR' || name === 'priceKWD' || name === 'quantity'
          ? Number(value)
          : value,
    }))
  }

  function onSellerChange(e: ChangeEvent<HTMLSelectElement>) {
    setFormData((prev) => ({
      ...prev,
      sellerId: e.target.value,
    }))
  }

  function addImage() {
    if (newImageUrl.trim() === '') return
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { id: crypto.randomUUID(), url: newImageUrl.trim() }],
    }))
    setNewImageUrl('')
  }

  function removeImage(id: string) {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img.id !== id),
    }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const isUpdate = Boolean(formData.id)
    const url = isUpdate ? `/api/products/${formData.id}` : '/api/products'
    const method = isUpdate ? 'PUT' : 'POST'

    const payload = {
      ...formData,
      tags: formData.tags || [],
      images: (formData.images || []).map((img) => img.url),
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchProducts()
      setFormData({
        name: '',
        brand: '',
        yearSeries: undefined,
        yearCar: undefined,
        modelCode: '',
        color: '',
        condition: '',
        priceINR: undefined,
        priceKWD: undefined,
        quantity: undefined,
        description: '',
        tags: [],
        sku: '',
        sellerId: '',
        images: [],
      })
    } else {
      alert('Failed to save product')
    }
  }

  function editProduct(p: Product) {
    setFormData({
      ...p,
      tags: p.tags || [],
      images: p.images || [],
    })
  }

  return (
    <div>
      <h2>Products Admin</h2>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={formData.name || ''} onChange={onChange} required />
        <input name="brand" placeholder="Brand" value={formData.brand || ''} onChange={onChange} required />
        <input name="yearSeries" type="number" placeholder="Year Series" value={formData.yearSeries || ''} onChange={onChange} />
        <input name="yearCar" type="number" placeholder="Year Car" value={formData.yearCar || ''} onChange={onChange} />
        <input name="modelCode" placeholder="Model Code" value={formData.modelCode || ''} onChange={onChange} />
        <input name="color" placeholder="Color" value={formData.color || ''} onChange={onChange} />
        <input name="condition" placeholder="Condition" value={formData.condition || ''} onChange={onChange} />
        <input name="priceINR" type="number" placeholder="Price INR" value={formData.priceINR || ''} onChange={onChange} />
        <input name="priceKWD" type="number" placeholder="Price KWD" value={formData.priceKWD || ''} onChange={onChange} />
        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity || ''} onChange={onChange} />
        <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={onChange} />
        <input name="tags" placeholder="Tags (comma separated)" value={(formData.tags || []).join(', ')} onChange={onChange} />
        <input name="sku" placeholder="SKU" value={formData.sku || ''} onChange={onChange} />

        <select name="sellerId" value={formData.sellerId || ''} onChange={onSellerChange} required>
          <option value="">Select Seller</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>{seller.name}</option>
          ))}
        </select>

        <div>
          <input
            placeholder="New Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <button type="button" onClick={addImage}>Add Image</button>
        </div>

        <ul>
          {(formData.images || []).map((img) => (
            <li key={img.id}>
              {img.url} <button type="button" onClick={() => removeImage(img.id)}>Remove</button>
            </li>
          ))}
        </ul>

        <button type="submit">{formData.id ? 'Update' : 'Create'} Product</button>
      </form>

      <hr />

      <h3>Existing Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <b>{p.name}</b> - Seller: {p.seller.name} - Qty: {p.quantity}{' '}
            <button onClick={() => editProduct(p)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  )
}