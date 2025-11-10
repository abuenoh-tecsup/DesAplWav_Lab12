/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id: authorId } = await params;

    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    const books = await prisma.book.findMany({
      where: { authorId },
      orderBy: {
        publishedYear: "asc",
      },
    });

    const totalBooks = books.length;

    if (totalBooks === 0) {
      return NextResponse.json({
        authorId,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: null,
        genres: [],
        longestBook: null,
        shortestBook: null,
      });
    }

    const firstBook = books[0];
    const latestBook = books[books.length - 1];

    const averagePages =
      books.reduce((sum, b) => sum + (b.pages || 0), 0) / totalBooks;

    const genres = Array.from(new Set(books.map((b) => b.genre)));

    const longestBook = books.reduce((max, b) => {
      const maxPages = max.pages ?? 0;
      const bPages = b.pages ?? 0;
      return bPages > maxPages ? b : max;
    });

    const shortestBook = books.reduce((min, b) => {
      const minPages = min.pages ?? Infinity;
      const bPages = b.pages ?? Infinity;
      return bPages < minPages ? b : min;
    });

    return NextResponse.json({
      authorId,
      authorName: author.name,
      totalBooks,
      firstBook: firstBook
        ? { title: firstBook.title, year: firstBook.publishedYear }
        : null,
      latestBook: latestBook
        ? { title: latestBook.title, year: latestBook.publishedYear }
        : null,
      averagePages: Math.round(averagePages),
      genres,
      longestBook: {
        title: longestBook.title,
        pages: longestBook.pages,
      },
      shortestBook: {
        title: shortestBook.title,
        pages: shortestBook.pages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener estadísticas del autor" },
      { status: 500 }
    );
  }
}
