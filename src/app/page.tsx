"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

export type Book = {
  id: string;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  pages: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type Author = {
  id: string;
  name: string;
  email: string;
  bio: string;
  nationality: string;
  birthYear: number;
  createdAt: string;
  updatedAt: string;
  books: Book[];
  _count: {
    books: number;
  };
};

export default function HomePage() {
  const [authors, setAuthors] = useState<Author[] | null>(null);

  useEffect(() => {
    fetch("/api/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data))
      .catch(() => setAuthors([]));
  }, []);

  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    bio: "",
    nationality: "",
    birthYear: "",
  });

  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="space-y-10">
      {/* TITULO */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Panel de Gestión Literaria
        </h1>

        <p className="text-gray-700 text-lg mt-1">
          Administra autores, sus obras y estadísticas generales del sistema.
        </p>
      </div>

      {/* TARJETA DE ESTADISTICAS */}
      <Card className="border-l-4 border-l-blue-600 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Estadísticas generales
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total de autores</p>
            <div className="text-3xl font-bold">
              {authors ? authors.length : <Skeleton className="h-8 w-16" />}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Total de libros</p>
            <div className="text-3xl font-bold">
              {authors ? (
                authors.reduce((sum, a) => sum + a._count.books, 0)
              ) : (
                <Skeleton className="h-8 w-20" />
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Promedio de libros/autor</p>
            <div className="text-3xl font-bold">
              {authors ? (
                (
                  authors.reduce((s, a) => s + a._count.books, 0) /
                  (authors.length || 1)
                ).toFixed(1)
              ) : (
                <Skeleton className="h-8 w-20" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOTÓN CREAR AUTOR */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Crear nuevo autor</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo autor</DialogTitle>
            <DialogDescription>
              Completa los campos para registrar un nuevo autor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                placeholder="Gabriel García Márquez"
                value={newAuthor.name}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                placeholder="gabo@example.com"
                value={newAuthor.email}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Biografía</Label>
              <Textarea
                placeholder="Escribe una breve biografía..."
                value={newAuthor.bio}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, bio: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Nacionalidad</Label>
              <Input
                placeholder="Colombia"
                value={newAuthor.nationality}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, nationality: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Año de nacimiento</Label>
              <Input
                type="number"
                placeholder="1927"
                value={newAuthor.birthYear}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, birthYear: e.target.value })
                }
              />
            </div>

            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
          </div>

          <DialogFooter>
            <Button
              disabled={creating}
              onClick={async () => {
                setErrorMsg("");

                if (!newAuthor.name || !newAuthor.email) {
                  setErrorMsg("Nombre y email son requeridos");
                  return;
                }

                setCreating(true);

                const res = await fetch("/api/authors", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newAuthor),
                });

                const data = await res.json();

                if (!res.ok) {
                  toast.error(data.error || "Error al crear autor");
                  setCreating(false);
                  return;
                }

                setAuthors((prev) => {
                  const normalized = {
                    ...data,
                    _count: { books: data.books?.length ?? 0 },
                  };

                  return prev ? [...prev, normalized] : [normalized];
                });

                setNewAuthor({
                  name: "",
                  email: "",
                  bio: "",
                  nationality: "",
                  birthYear: "",
                });

                document.body.click();
                setCreating(false);

                toast.success("Autor creado correctamente ✅");
              }}
            >
              {creating ? "Creando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LISTADO DE AUTORES */}
      <h2 className="text-2xl font-bold mt-6">Autores registrados</h2>

      {!authors ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : authors.length === 0 ? (
        <p className="text-gray-600">No hay autores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authors.map((author) => (
            <Card key={author.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {author.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  Nacionalidad: <b>{author.nationality}</b>
                </p>
                <p className="text-gray-700">
                  Año de nacimiento: <b>{author.birthYear ?? "-"}</b>
                </p>

                <Badge variant="secondary">Libros: {author._count.books}</Badge>

                <div className="flex gap-3 pt-2">
                  {/* VER LIBROS */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Ver libros</Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Libros de {author.name}</DialogTitle>
                      </DialogHeader>

                      {author.books.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                          Este autor no tiene libros registrados.
                        </p>
                      ) : (
                        <div className="space-y-3 mt-3">
                          {author.books.map((book) => (
                            <div
                              key={book.id}
                              className="border rounded-md p-3 bg-gray-50 shadow-sm"
                            >
                              <p className="font-semibold">{book.title}</p>
                              <p className="text-sm text-gray-700">
                                {book.genre}
                              </p>
                              <p className="text-xs text-gray-500">
                                Año de publicación: {book.publishedYear}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* EDITAR */}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/authors/${author.id}`}>Editar</Link>
                  </Button>

                  {/* ELIMINAR */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Eliminar
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Eliminar autor</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de eliminar a <b>{author.name}</b>?
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `/api/authors/${author.id}`,
                                { method: "DELETE" }
                              );

                              if (!res.ok) {
                                toast.error("Error al eliminar autor");
                                return;
                              }

                              setAuthors((prev) =>
                                prev
                                  ? prev.filter((a) => a.id !== author.id)
                                  : prev
                              );

                              toast.success("Autor eliminado ✅");
                              document.body.click();
                            } catch (e) {
                              toast.error("Error inesperado");
                            }
                          }}
                        >
                          Confirmar eliminación
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
