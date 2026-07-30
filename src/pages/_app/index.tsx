import { createFileRoute } from "@tanstack/react-router"
import { Hero } from "../../components/Hero/Hero"
import { Categories } from "../../components/Categories/Categories"
import { Gallery } from "../../components/Gallery/Gallery"

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="py-10">
      <Hero></Hero>
      <Categories></Categories>
      <Gallery></Gallery>
    </main>
  )
}