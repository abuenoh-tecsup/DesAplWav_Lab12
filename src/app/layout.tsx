import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

import { Alegreya } from "next/font/google";

const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "700"], // agrega los pesos que usarás
});

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={alegreya.className}>
      <body className="min-h-screen flex flex-col">
        {/* NAVBAR */}
        <nav className="w-full bg-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* IZQUIERDA */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-xl">BookManagement</span>

              <Separator orientation="vertical" className="h-6" />

              <span className="text-sm text-muted-foreground">
                Hecha por Alvaro Bueno
              </span>
            </div>

            {/* DERECHA */}
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="text-sm hover:underline">
                      Inicio
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/books" className="text-sm hover:underline">
                      Búsqueda de libros
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>

        {/* CONTENEDOR PRINCIPAL */}
        <main className="flex-1 bg-cream-texture py-8">
          <div className="max-w-5xl mx-auto px-4">{children}</div>
          
        </main>
        <Toaster />
      </body>
    </html>
  );
}
