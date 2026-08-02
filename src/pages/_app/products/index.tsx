import { createFileRoute } from '@tanstack/react-router'
import { ProductList } from '../../../components/ProductList/ProductList'
import { products } from '../../../mocks/products'

export const Route = createFileRoute('/_app/products/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className='container pt-44 md:pt-54 pb-10 md:px-10 px-10 mb-10 text-black bg-surface'>
      <h1 className='text-center mb-3 text-3xl'>Lista de Produtos</h1>
      <h2 className='text-center p-2 mb-10'>Conforto excepcional para suas aventuras do dia a dia </h2>
      <ProductList products={products}></ProductList>
    </div>
  )
}
