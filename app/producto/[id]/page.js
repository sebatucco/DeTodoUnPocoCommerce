import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

async function getProduct(id) {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  try {
    const res = await fetch(`${protocol}://${host}/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const text = await res.text()

    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      console.error('La API devolvió una respuesta no válida:', text)
      return null
    }
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return null
  }
}

export default async function ProductoPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name || 'Producto'}
            className="w-full rounded-xl shadow"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-4">
            {product.description || 'Sin descripción'}
          </p>

          <div className="text-2xl font-semibold mb-6">
            ${product.price}
          </div>
        </div>
      </div>
    </div>
  )
}