/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const authorName = searchParams.get("authorName") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    const skip = (page - 1) * limit;

    // Construcción dinámica del filtro
    const filters: any = {};

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (genre) {
      filters.genre = genre;
    }

    if (authorName) {
      filters.author = {
        name: {
          contains: authorName,
          mode: "insensitive",
        },
      };
    }

    // Obtener total para paginación
    const total = await prisma.book.count({
      where: filters,
    });

    const books = await prisma.book.findMany({
      where: filters,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en búsqueda de libros" },
      { status: 500 }
    );
  }
}
