import ClientShell from './client-shell';

export const metadata = {
  title: 'Thaw — An adaptive co-pilot for getting unstuck',
  description: 'An energy-aware, AI-powered planner for university students experiencing task paralysis, overwhelm, or burnout.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-thaw-950 text-thaw-100 selection:bg-sage-500 selection:text-thaw-950">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
