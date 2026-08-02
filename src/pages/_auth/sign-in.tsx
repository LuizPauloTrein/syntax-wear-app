import { createFileRoute, Link } from '@tanstack/react-router'
import { LoginForm } from '../../components/LoginForm/LoginForm'
import { Logo } from '../../components/Logo/Logo'
import GoogleIcon from "@/assets/images/google-icon.png"
import { Separator } from '../../components/Separator/Separator'

export const Route = createFileRoute('/_auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className='text-black bg-[#f5f5f5] h-screen w-full flex justify-center items-center p-5'>
      <div className='w-112.5 bg-white rounded-[18px] p-10 shadow-md'>
        <div className='flex flex-col'>
          <Logo></Logo>

          <h2 className='text-black font-bold text-[21px] mb-2'>Entrar</h2>
          <p className='mb-3.5'>Escolha como você gostaria de gazer login</p>

          <button className=' cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 hover:bg-gray-50 transition'>
            <img className='w-5 h-5' src={GoogleIcon} alt="Icone do google" />
            <span className='text-sm font-medium text-black'>Continuar com o Google</span>
          </button>

          <Separator></Separator>
          <LoginForm></LoginForm>
          <p className='mt-3.5'>Ainda não possui conta? <Link to='/sign-up' className='ml-1 text-[#5433eb] hover:underline'>Cadastre-se</Link></p>
        </div>
      </div>
    </section>
  )
}
