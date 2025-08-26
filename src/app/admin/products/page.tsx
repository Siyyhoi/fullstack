"use client"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import type { Products } from "@/generated/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"

type EditableProduct = Pick<Products, "id" | "name" | "description" | "category" | "price" | "image"> | null

export default function AdminProductsPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [products, setProducts] = useState<Products[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const [form, setForm] = useState<EditableProduct>({
    id: "",
    name: "",
    description: "",
    category: "",
    price: 0,
    image: "",
  })

  const isEditing = useMemo(() => Boolean(form && form.id), [form])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/products")
      setProducts(res.data?.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "โหลดข้อมูลล้มเหลว")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Client-side auth guard
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      // Go back to previous page if possible; otherwise fallback to home
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        router.replace('/')
      }
      return
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setAuthorized(true)
    loadProducts()
  }, [])

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", category: "", price: 0, image: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError("")
    setSuccess("")
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        category: form.category || null,
        price: Number(form.price),
        image: form.image,
      }
      if (isEditing && form.id) {
        await axios.put(`/api/products/${form.id}` , payload)
        setSuccess("อัปเดตสินค้าเรียบร้อยแล้ว")
      } else {
        await axios.post("/api/products", payload)
        setSuccess("เพิ่มสินค้าเรียบร้อยแล้ว")
      }
      await loadProducts()
      resetForm()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "บันทึกล้มเหลว")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p: Products) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      category: p.category ?? "",
      price: p.price,
      image: p.image,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันลบสินค้านี้?")) return
    setError("")
    setSuccess("")
    try {
      await axios.delete(`/api/products/${id}`)
      setSuccess("ลบสินค้าเรียบร้อยแล้ว")
      await loadProducts()
      if (form?.id === id) resetForm()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "ลบล้มเหลว")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {!authorized ? (
        <div className="container mx-auto px-4 py-20 text-center text-gray-600">กำลังตรวจสอบสิทธิ์...</div>
      ) : (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">กลับหน้าหลัก</Link>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">ชื่อสินค้า</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={form?.name || ""}
                    onChange={(e) => setForm(v => v ? { ...v, name: e.target.value } : v)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">รายละเอียด</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    rows={3}
                    value={form?.description || ""}
                    onChange={(e) => setForm(v => v ? { ...v, description: e.target.value } : v)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">หมวดหมู่</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={form?.category || ""}
                    onChange={(e) => setForm(v => v ? { ...v, category: e.target.value } : v)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">ราคา (บาท)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={form?.price ?? 0}
                    onChange={(e) => setForm(v => v ? { ...v, price: Number(e.target.value) } : v)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">รูปภาพ (URL)</label>
                  <input
                    type="url"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={form?.image || ""}
                    onChange={(e) => setForm(v => v ? { ...v, image: e.target.value } : v)}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? "กำลังบันทึก..." : isEditing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">รายการสินค้า</h2>
                <button
                  type="button"
                  onClick={loadProducts}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  รีเฟรช
                </button>
              </div>

              {loading ? (
                <div className="py-10 text-center text-gray-500 text-sm">กำลังโหลด...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex gap-3">
                        <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                            <span className="text-blue-700 font-bold text-sm">฿{p.price.toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{p.description || "-"}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-100">
                              {p.category || "ทั่วไป"}
                            </span>
                            <div className="ml-auto flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(p)}
                                className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >แก้ไข</button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.id)}
                                className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                              >ลบ</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500 text-sm">ไม่มีสินค้า</div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      )}
    </main>
  )
}


