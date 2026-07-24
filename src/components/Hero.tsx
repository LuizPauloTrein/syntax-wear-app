import Banner from "@/assets/images/banner.jpg"
import { Button } from "./Button/Button"

export const Hero = () => {
  return (
    <div className="container">
      <section className="relative h-125 rounded-[20px] mb-10">
        <img src={Banner} alt="Banner homem sentado com os tenis da SyntaxWear" className="w-full h-full object-cover rounded-[20px]" />

        <div className="absolute w-full bottom-0 flex justify-end items-center text-center px-6 md:px-24 pb-32">
          <div className="text-white flex flex-col items-center w-97">
            <h2 className="text-xl font-medium leading-normal tracking-wider mb-2.5">Krypton One</h2>
            <h1 className="text-2xl leading-9 tracking-widest mb-10">Transforme qualquer passo em presenca</h1>

            <div className="flex gap-3.5">
              <Button variant="secondary" size="sm">Ver modelos</Button>
              <Button variant="primary">Comprar</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}