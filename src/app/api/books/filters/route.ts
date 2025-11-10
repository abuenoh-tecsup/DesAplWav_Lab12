import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // -------------------------------
    // OBTENER GENEROS ÚNICOS
    // -------------------------------
    const genresRaw = await prisma.book.findMany({
      where: {
        genre: { not: null },
      },
      select: { genre: true },
    });

    // Extraemos únicos
    const genres = Array.from(
      new Set(genresRaw.map((g) => g.genre as string))
    );

    // -------------------------------
    // OBTENER AUTORES (id + name)
    // -------------------------------
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    // -------------------------------
    // OBTENER AÑOS PUBLICADOS ÚNICOS (opcional)
    // -------------------------------
    const yearsRaw = await prisma.book.findMany({
      where: {
        publishedYear: { not: null },
      },
      select: { publishedYear: true },
    });

    const years = Array.from(
      new Set(yearsRaw.map((y) => y.publishedYear as number))
    ).sort((a, b) => b - a); // años descendente

    // -------------------------------
    // RESPUESTA FINAL
    // -------------------------------
    return NextResponse.json({
      genres,
      authors,
      years,
    });

  } catch (error) {
    console.error("Error GET /api/books/filters:", error);
    return NextResponse.json(
      { error: "Error cargando filtros" },
      { status: 500 }
    );
  }
}
