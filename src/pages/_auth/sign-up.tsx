import { createFileRoute, Link } from "@tanstack/react-router"
import { RegisterForm } from "../../components/RegisterForm/RegisterForm"
import { Logo } from "../../components/Logo/Logo"
import { Separator } from "../../components/Separator/Separator"
import { GoogleAuthButton } from "../../components/GoogleAuthButton/GoogleAuthButton"

export const Route = createFileRoute("/_auth/sign-up")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {title: "Cadastre-se - SyntaxWear"}
    ]
  })
})

function RouteComponent() {
  return (
    <section className="min-h-screen w-full flex justify-center items-center bg-surface p-5">
      <div className="w-112.5 bg-white rounded-2xl p-5 flex flex-col">
        <Logo></Logo>
        <RegisterForm></RegisterForm>
        <Separator></Separator>

        <div className="flex flex-col items-center">
          <GoogleAuthButton />
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center">Já tem uma conta? {" "}
          <Link to="/sign-in" className="text-accent hover:underline">Entrar</Link>
        </p>
      </div>
    </section>
  )
}
