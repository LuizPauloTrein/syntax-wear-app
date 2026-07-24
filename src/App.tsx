import { Categories } from "./components/Categories/Categories"
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"

function App() {

  return (
    <>
      <Header></Header>
      <main className="py-10">
        <Hero></Hero>
        <Categories></Categories>
      </main>
    </>
  )
}

export default App
