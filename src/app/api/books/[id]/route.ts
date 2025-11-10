/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = (await params).id;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        author: true,
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Libro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener libro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ igual que en authors:
    const { id: bookId } = await params;

    const body = await request.json();

    const {
      title,
      description,
      isbn,
      publishedYear,
      genre,
      pages,
      authorId,
    } = body;

    // ✅ Tus validaciones, tal cual estaban:
    if (title !== undefined && title.length < 3) {
      return NextResponse.json(
        { error: "El titulo debe tener al menos 3 carácteres" },
        { status: 400 }
      );
    }

    if (pages !== undefined && pages < 1) {
      return NextResponse.json(
        { error: "El número de páginas debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (authorId !== undefined) {
      const authorExists = await prisma.author.findUnique({
        where: { id: authorId },
      });
      if (!authorExists) {
        return NextResponse.json(
          { error: "El autor especificado no existe" },
          { status: 404 }
        );
      }
    }

    // ✅ Tu misma construcción dinámica:
    const data: Record<string, unknown> = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (isbn !== undefined) data.isbn = isbn;
    if (genre !== undefined) data.genre = genre;
    if (authorId !== undefined) data.authorId = authorId;

    if (publishedYear !== undefined) {
      data.publishedYear =
        publishedYear === "" ? null : parseInt(publishedYear);
    }

    if (pages !== undefined) {
      data.pages = pages === "" ? null : parseInt(pages);
    }

    const book = await prisma.book.update({
      where: { id: bookId },
      data,
      include: { author: true },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Libro no encontrado" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El ISBN ya existe" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar el libro" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = (await params).id;

    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({
      message: "Libro eliminado correctamente",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Libro no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar el libro" },
      { status: 500 }
    );
  }
}
