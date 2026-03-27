export const siteConfig = {
  brandName: 'De Todo Un Poco',
  tagline: 'tienda de variedades',
  description:
    'Mini e-commerce para vender productos de distintas categorías, con compra rápida por carrito, Mercado Pago, transferencia o WhatsApp.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493815642773',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@detodounpoco.com.ar',
  location: process.env.NEXT_PUBLIC_LOCATION || 'Tucumán, Argentina',
  bankInfo: {
    banco: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco a definir',
    titular: process.env.NEXT_PUBLIC_BANK_HOLDER || 'De Todo Un Poco',
    cbu: process.env.NEXT_PUBLIC_BANK_CBU || '0000000000000000000000',
    alias: process.env.NEXT_PUBLIC_BANK_ALIAS || 'REEMPLAZAR.ALIAS',
    cuit: process.env.NEXT_PUBLIC_BANK_CUIT || '00-00000000-0',
  },
}

export const fallbackProducts = [
  {
    id: 'dto-1',
    name: 'Set Organizador de Cocina',
    description: 'Organizador multiuso ideal para frascos, especias y accesorios pequeños.',
    price: 18990,
    originalPrice: 22990,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
    category: 'Hogar',
    stock: 14,
    featured: true,
  },
  {
    id: 'dto-2',
    name: 'Lámpara Decorativa LED',
    description: 'Luz cálida decorativa para escritorio, dormitorio o rincón de lectura.',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    category: 'Decoración',
    stock: 9,
    featured: true,
  },
  {
    id: 'dto-3',
    name: 'Botella Térmica 500 ml',
    description: 'Botella reutilizable con excelente conservación de temperatura.',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    category: 'Accesorios',
    stock: 21,
    featured: false,
  },
  {
    id: 'dto-4',
    name: 'Kit Escolar Creativo',
    description: 'Set con cuaderno, resaltadores y accesorios para estudio u oficina.',
    price: 15990,
    originalPrice: 18500,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
    category: 'Librería',
    stock: 18,
    featured: true,
  },
  {
    id: 'dto-5',
    name: 'Canasto Textil Plegable',
    description: 'Solución práctica para ordenar ropa, juguetes o accesorios.',
    price: 13990,
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    category: 'Organización',
    stock: 7,
    featured: false,
  },
  {
    id: 'dto-6',
    name: 'Combo Regalo Relax',
    description: 'Incluye vela aromática, taza y mini libreta. Perfecto para regalar.',
    price: 27990,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80',
    category: 'Regalos',
    stock: 5,
    featured: true,
  },
]

export const benefits = [
  {
    title: 'Variedad real',
    description: 'Podés vender productos de distintas categorías en una sola tienda.',
  },
  {
    title: 'Compra simple',
    description: 'Carrito rápido, checkout claro y opciones de pago adaptadas al cliente.',
  },
  {
    title: 'Atención cercana',
    description: 'WhatsApp integrado para consultas, pedidos y seguimiento.',
  },
  {
    title: 'Escalable',
    description: 'La base quedó preparada para sumar más productos y categorías.',
  },
]

export const faqs = [
  {
    question: '¿Qué medios de pago acepta la tienda?',
    answer: 'Podés cobrar con Mercado Pago, transferencia bancaria o cerrar la venta por WhatsApp.',
  },
  {
    question: '¿Los productos se pueden gestionar desde un panel?',
    answer: 'Sí. La base incluye una sección de administración para alta, edición y seguimiento de pedidos.',
  },
  {
    question: '¿La tienda usa Supabase?',
    answer: 'Sí. Se utiliza para productos, pedidos, contactos y demás datos del mini e-commerce.',
  },
  {
    question: '¿Puedo cambiar categorías, colores y textos?',
    answer: 'Sí. Ya quedó rebrandizada para “De Todo Un Poco”, pero la estructura es flexible para seguir personalizándola.',
  },
]
