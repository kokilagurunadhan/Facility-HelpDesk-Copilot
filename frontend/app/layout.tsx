import "./globals.css"; // <--- THIS IS THE MISSING LINK!

export const metadata = {
  title: 'Facility Helpdesk Copilot',
  description: 'Production Ticketing Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
