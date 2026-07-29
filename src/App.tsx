import { Categories } from "./components/Categories/Categories"
import { Gallery } from "./components/Gallery/Gallery"
import { Header } from "./components/Header/Header"
import { Hero } from "./components/Hero/Hero"

function App() {

  return (
    <>
      <Header></Header>
      <main className="py-10">
        <Hero></Hero>
        <Categories></Categories>
        <Gallery></Gallery>
      </main>
    </>
  )
}

export default App
