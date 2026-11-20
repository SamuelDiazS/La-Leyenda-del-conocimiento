import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Leyenda del Conocimiento | MMORPG Educativo Saber 11',
  description:
    'MMORPG 2D de fantasía medieval para navegador donde la restauración del mundo de Aethoria se forja a través de competencias de Lectura Crítica, Matemáticas y Física (ICFES Saber 11).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cinzel+Decorative:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-game-bg text-gray-100 flex flex-col">{children}</body>
    </html>
  );
}
