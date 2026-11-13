// --- Configuração do Roteador (Não utilizada neste arquivo) ---
// As linhas abaixo preparam o sistema de rotas, mas o roteador não é ativado aqui.
// A ativação provavelmente acontece em `src/main.tsx`.

// Importa as funções necessárias da biblioteca de roteamento TanStack Router.
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Importa a "árvore de rotas", um arquivo gerado automaticamente que lista todas as páginas do app.
import { routeTree } from "./router-tree-gen";
import { CartProvider } from "./contexts/CartContext/CartProvider";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import .meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>  
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
