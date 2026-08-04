import { Link } from "@tanstack/react-router"
import { MdAddShoppingCart } from "react-icons/md"
import type { Product } from "../../interfaces/product"

interface ProductCardPorps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardPorps) => {
  return (
    <div className="rounded-2xl bg-white shadow-md">
      <Link to="/products/$productId" params={{ productId: String(product.id) }}>
        <img className="w-full max-h-100 object-cover rounded-md mb-2" src={product.image} alt={product.name} />
      </Link>

      <div className="text-black rounded-2xl p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p>{product.color}</p>

        <div className="flex justify-between mt-2.5">
          <p className="font-bold">R${product.price},00</p>

          <button className="cursor-pointer">
            <MdAddShoppingCart className="2-7 h-7"></MdAddShoppingCart>
          </button>
        </div>
      </div>
    </div>
  )
}