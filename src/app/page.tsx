'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Products } from '@/generated/prisma'
import Navigation from './components/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Products[]>([])

  useEffect(() => {
    (async () => {
      const res = await axios.get('/api/products')
      if (res.data.data) {
        setProducts(res.data.data)
      }
    })()
  }, [])

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-4 py-1 text-sm font-medium">
              ใหม่ล่าสุด
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-blue-900">
              ร้านเกมมิ่งครบวงจร
            </h2>
            <p className="mt-3 text-base md:text-lg text-blue-700 max-w-2xl mx-auto">
              อุปกรณ์เกมมิ่ง คีย์บอร์ด เมาส์ หูฟัง และสินค้าไอทีคุณภาพ ราคาคุ้มค่า
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a href="#products" className="rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-blue-700 transition">
                ดูสินค้า
              </a>
              <Link
                href="/admin/products"
                onClick={(e) => {
                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
                  if (!token) {
                    e.preventDefault()
                    // stay on the same page, optionally inform user
                    alert('โปรดเข้าสู่ระบบก่อนเข้าหน้าจัดการสินค้า')
                  }
                }}
                className="rounded-md border border-blue-200 text-blue-800 px-5 py-2.5 text-sm font-semibold hover:bg-blue-50 transition"
              >
                จัดการสินค้า
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-40" aria-hidden>
            <svg className="absolute -top-24 right-0 w-[600px] h-[600px] text-blue-200" viewBox="0 0 600 600" fill="currentColor">
              <circle cx="300" cy="300" r="300" />
            </svg>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="container mx-auto px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">สินค้ายอดนิยม</h3>
              <p className="text-sm text-gray-600">อัปเดตใหม่ทุกสัปดาห์ คัดสรรคุณภาพเพื่อคุณ</p>
            </div>
            <a href="#" className="hidden sm:inline-flex text-sm font-medium text-blue-700 hover:text-blue-800">ดูทั้งหมด →</a>
          </div>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map(product => (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name || 'Product image'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-md bg-blue-600/90 text-white text-[11px] font-semibold px-2 py-1">
                      HIT
                    </span>
                    <span className="rounded-md bg-white/90 text-blue-700 text-[11px] font-semibold px-2 py-1 border border-blue-100">
                      {product.category || 'ทั่วไป'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                  <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-2">
                    {product.description || 'ยังไม่มีรายละเอียดสินค้า'}
                  </p>
                  <div className="mt-3 flex items-center">
                    <p className="text-blue-700 font-bold">
                      {product.price ? `฿${product.price.toLocaleString()}` : 'ติดต่อราคา'}
                    </p>
                    <button
                      className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-xs md:text-sm font-semibold hover:bg-blue-700 transition"
                      type="button"
                    >
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur border-t border-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sinsamuth. สงวนลิขสิทธิ์
        </div>
      </footer>
    </>
  )
}