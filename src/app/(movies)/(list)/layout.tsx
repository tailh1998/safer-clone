import ClientLayout from "@/components/client-layout"

export default function ListLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
