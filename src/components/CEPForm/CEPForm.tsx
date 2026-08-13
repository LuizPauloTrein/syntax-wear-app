import { useState } from "react"
import { useCEPForm } from "./cep-form-schema"
import type { Address } from "../../interfaces/address"
import { formatCurrency } from "../../utils/formatCurrency"

const SHIPPING_BY_REGION: Record<string, number> = {
  "Norte": 39.90,
  "Nordeste": 29.90,
  "Centro-Oeste": 24.90,
  "Sudeste": 14.90,
  "Sul": 19.90
}

export const CEPForm = () => {
  const { register, handleSubmit, errors, isSubmitting } = useCEPForm()
  const [address, setAddress] = useState<Address | null>(null)
  const [addressError, setAddressError] = useState<string | null>(null)

  const onSubmit = async ({ cep }: { cep: string }) => {

    setAddressError(null)
    setAddress(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setAddressError("CEP não encontrado")
        return
      }

      const shippingCost = SHIPPING_BY_REGION[data.regiao]

      if (!shippingCost) {
        setAddressError("Região não suportada para entrega")
        return
      }

      setAddress({ ...data, shippingCost: shippingCost })
    } catch {
      setAddressError("Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde")
    }
  }

  return (
    <>
      <form className="flex gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col flex-1">
          <input className={`border border-[#c0c0c0] rounded-md p-3 ${errors.cep ? "border-red-500" : ""}`} {...register("cep")} type="text" placeholder="Insira sue CEP" />
          {errors.cep && (
            <span className="text-red-600 text-sm mt-1">{String(errors.cep.message)}</span>
          )}
        </div>
        <button className="bg-black text-white py-3 px-6 rounded-md cursor-pointer hover:bg-gray-800 disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Calculando..." : "Calcular"}</button>
      </form>

      {addressError && (
        <div className="mt-4">
          <p className="text-sm text-red-600">{addressError}</p>
        </div>
      )}

      {
        address && (
          <div className="mt-4">
            <p><strong>Região:</strong> {address.regiao}</p>
            <p><strong>Custo de entrega:</strong> {formatCurrency(address.shippingCost)}</p>
          </div>
        )}
    </>
  )
}
