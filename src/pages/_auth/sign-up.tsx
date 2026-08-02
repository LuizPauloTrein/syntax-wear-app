import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '../../components/RegisterForm/RegisterForm'
import { Logo } from '../../components/Logo/Logo'
import { Separator } from '../../components/Separator/Separator'
import GoogleIcon from "@/assets/images/google-icon.png"

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className='min-h-screen w-full flex justify-center items-center bg-[#f5f5f5] p-5'>
      <div className='w-112.5 bg-white rounded-2xl p-5 flex flex-col'>
        <Logo></Logo>
        <RegisterForm></RegisterForm>
        <Separator></Separator>

        <button className=' cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 hover:bg-gray-50 transition'>
          <img className='w-5 h-5' src={GoogleIcon} alt="Icone do google" />
          <span className='text-sm font-medium text-black'>Continuar com o Google</span>
        </button>

        <p className='text-sm text-gray-600 mt-6 text-center'>Já tem uma conta?{" "}
          <a href="/sign-in" className='text-[#5433eb] hover:underline'>Entrar</a>
        </p>
      </div>
    </section>
  )
}
