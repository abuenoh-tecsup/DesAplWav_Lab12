/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authorId = (await params).id;

    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: {
        books: {
          orderBy: { publishedYear: "desc" },
        },
        _count: { select: { books: true } },
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener autor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: authorId } = await params;

    const body = await request.json();
    const { name, email, bio, nationality, birthYear } = body;

    const data: any = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (bio !== undefined) data.bio = bio;
    if (nationality !== undefined) data.nationality = nationality;

    if (birthYear !== undefined) {
      data.birthYear =
        birthYear === "" ? null : parseInt(birthYear);
    }

    const updated = await prisma.author.update({
      where: { id: authorId },
      data,
      include: { books: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Error al actualizar autor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authorId = (await params).id;

    await prisma.author.delete({
      where: { id: authorId },
    });

    return NextResponse.json({
      message: "Autor eliminado correctamente",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar autor" },
      { status: 500 }
    );
  }
}
