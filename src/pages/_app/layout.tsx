import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Header } from "../../components/Header/Header"
import { Footer } from "../../components/Footer/Footer"

export const Route = createFileRoute("/_app")({
  component: AppLayout
})

function AppLayout() {
  return (
    <div>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}