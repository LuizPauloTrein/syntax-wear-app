import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sing-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_auth/sing-up"!</div>
}
