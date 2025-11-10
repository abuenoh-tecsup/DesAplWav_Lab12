/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Tipos opcionales
interface Author {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
  author: Author;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BooksPage() {
  // ESTADOS DE TABLA
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [loading, setLoading] = useState(false);

  // FILTROS ACTIVOS
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // NUEVO: ESTADOS DE LISTAS PARA DROPDOWNS
  const [genresList, setGenresList] = useState<string[]>([]);
  const [authorsList, setAuthorsList] = useState<Author[]>([]);
  const [yearsList, setYearsList] = useState<number[]>([]);

  // Estados del formulario de creación
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIsbn, setCreateIsbn] = useState("");
  const [createYear, setCreateYear] = useState("");
  const [createGenre, setCreateGenre] = useState("");
  const [createPages, setCreatePages] = useState("");
  const [createAuthorId, setCreateAuthorId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Control del modal
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // EDITAR LIBRO
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string>("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsbn, setEditIsbn] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editPages, setEditPages] = useState("");
  const [editAuthorId, setEditAuthorId] = useState("");

  const [editLoading, setEditLoading] = useState(false);

  // ===========================================
  // FETCH DE FILTROS (solo una vez)
  // ===========================================
  const fetchFilters = async () => {
    try {
      const res = await fetch("/api/books/filters");
      const json = await res.json();

      setGenresList(json.genres || []);
      setAuthorsList(json.authors || []);
      setYearsList(json.years || []);
    } catch (err) {
      console.error("Error fetchFilters:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchFilters();
    };
    load();
  }, []);

  // ===========================================
  // FETCH REAL DE LIBROS
  // ===========================================
  const fetchBooks = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      genre,
      authorName,
      sortBy,
      order,
      page: String(page),
      limit: "10",
    });

    try {
      const res = await fetch(
        `/api/books/search?${params.toString()}`
      );

      const json = await res.json();

      setBooks(json.data || []);
      setPagination(json.pagination || {});
    } catch (error) {
      console.error("Error fetchBooks:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchBooks();
    }, 0);
    return () => clearTimeout(t);
  }, [search, genre, authorName, sortBy, order, page]);

  const openEditDialog = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditDescription((book as any).description || "");
    setEditIsbn((book as any).isbn || "");
    setEditYear(String(book.publishedYear || ""));
    setEditGenre(book.genre || "");
    setEditPages(String((book as any).pages || ""));
    setEditAuthorId(book.author?.id || "");

    setEditDialogOpen(true);
  };

  // ===========================================
  // UI
  // ===========================================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Libros</h1>

      {/* MODAL EDITAR LIBRO */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Editar libro</DialogTitle>
          </DialogHeader>

          {/* Título */}
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          {/* ISBN */}
          <div className="space-y-1">
            <Label>ISBN</Label>
            <Input
              value={editIsbn}
              onChange={(e) => setEditIsbn(e.target.value)}
            />
          </div>

          {/* Año */}
          <div className="space-y-1">
            <Label>Año de publicación</Label>
            <Input
              type="number"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
            />
          </div>

          {/* Género */}
          <div className="space-y-1">
            <Label>Género</Label>
            <Input
              value={editGenre}
              onChange={(e) => setEditGenre(e.target.value)}
            />
          </div>

          {/* Páginas */}
          <div className="space-y-1">
            <Label>Páginas</Label>
            <Input
              type="number"
              value={editPages}
              onChange={(e) => setEditPages(e.target.value)}
            />
          </div>

          {/* Autor */}
          <div className="space-y-1">
            <Label>Autor *</Label>
            <Select value={editAuthorId} onValueChange={setEditAuthorId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar autor" />
              </SelectTrigger>
              <SelectContent>
                {authorsList.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón GUARDAR */}
          <Button
            disabled={editLoading}
            onClick={async () => {
              try {
                setEditLoading(true);

                const res = await fetch(`/api/books/${editId}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    isbn: editIsbn,
                    publishedYear: editYear,
                    genre: editGenre,
                    pages: editPages,
                    authorId: editAuthorId,
                  }),
                });

                const data = await res.json();
                if (!res.ok) {
                  alert(data.error || "Error al editar libro");
                  return;
                }

                fetchBooks();
                fetchFilters();

                setEditDialogOpen(false);
              } catch (e) {
                console.error(e);
                alert("Error inesperado");
              } finally {
                setEditLoading(false);
              }
            }}
          >
            {editLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* FORMULARIO CREAR */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>Crear libro</Button>
        </DialogTrigger>

        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Crear nuevo libro</DialogTitle>
          </DialogHeader>

          {/* TÍTULO */}
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              placeholder="Título del libro"
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Input
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              placeholder="Descripción breve"
            />
          </div>

          {/* ISBN */}
          <div className="space-y-1">
            <Label>ISBN</Label>
            <Input
              value={createIsbn}
              onChange={(e) => setCreateIsbn(e.target.value)}
              placeholder="ISBN"
            />
          </div>

          {/* AÑO */}
          <div className="space-y-1">
            <Label>Año de publicación</Label>
            <Input
              type="number"
              value={createYear}
              onChange={(e) => setCreateYear(e.target.value)}
              placeholder="Ej: 1999"
            />
          </div>

          {/* GÉNERO */}
          <div className="space-y-1">
            <Label>Género</Label>
            <Input
              value={createGenre}
              onChange={(e) => setCreateGenre(e.target.value)}
              placeholder="Ej: Novela"
            />
          </div>

          {/* PÁGINAS */}
          <div className="space-y-1">
            <Label>Páginas</Label>
            <Input
              type="number"
              value={createPages}
              onChange={(e) => setCreatePages(e.target.value)}
              placeholder="Ej: 350"
            />
          </div>

          {/* AUTOR */}
          <div className="space-y-1">
            <Label>Autor *</Label>
            <Select value={createAuthorId} onValueChange={setCreateAuthorId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar autor" />
              </SelectTrigger>
              <SelectContent>
                {authorsList.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BOTÓN CREAR */}
          <Button
            disabled={createLoading}
            onClick={async () => {
              try {
                setCreateLoading(true);

                const res = await fetch("/api/books", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: createTitle,
                    description: createDescription,
                    isbn: createIsbn,
                    publishedYear: createYear,
                    genre: createGenre,
                    pages: createPages,
                    authorId: createAuthorId,
                  }),
                });

                const data = await res.json();
                if (!res.ok) {
                  alert(data.error || "Error al crear libro");
                  return;
                }

                // limpiar campos
                setCreateTitle("");
                setCreateDescription("");
                setCreateIsbn("");
                setCreateYear("");
                setCreateGenre("");
                setCreatePages("");
                setCreateAuthorId("");

                // refrescar lista
                fetchBooks();
                fetchFilters();

                // cerrar modal
                setCreateDialogOpen(false);
              } catch (e) {
                alert("Error desconocido");
              } finally {
                setCreateLoading(false);
              }
            }}
          >
            {createLoading ? "Creando..." : "Crear libro"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* FILTROS */}
      <Card>
        <CardContent className="p-4 grid md:grid-cols-4 gap-4">
          {/* BUSQUEDA */}
          <div>
            <Label>Búsqueda</Label>
            <Input
              placeholder="Buscar por título"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          {/* GENERO */}
          <div>
            <Label>Género</Label>
            <Select
              onValueChange={(v) => {
                setGenre(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>

                {genresList.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AUTOR */}
          <div>
            <Label>Autor</Label>
            <Select
              onValueChange={(v) => {
                setAuthorName(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>

                {authorsList.map((a) => (
                  <SelectItem key={a.id} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ORDEN */}
          <div>
            <Label>Ordenar por</Label>
            <Select onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="publishedYear">Año</SelectItem>
                <SelectItem value="createdAt">Fecha creación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="p-6 text-center">Cargando libros...</div>
          ) : books.length === 0 ? (
            <div className="p-6 text-center">No se encontraron resultados</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {books.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>{b.genre}</TableCell>
                    <TableCell>{b.publishedYear}</TableCell>
                    <TableCell>{b.author?.name}</TableCell>

                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(b)}
                      >
                        Editar
                      </Button>

                      {/* ELIMINAR CON DIÁLOGO */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Eliminar
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Eliminar libro</DialogTitle>
                            <DialogDescription>
                              ¿Estás seguro de eliminar <b>{b.title}</b>? Esta
                              acción no puede deshacerse.
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                try {
                                  const res = await fetch(
                                    `/api/books/${b.id}`,
                                    { method: "DELETE" }
                                  );

                                  if (!res.ok) {
                                    console.error("Error al eliminar libro");
                                    return;
                                  }

                                  setBooks((prev) =>
                                    prev.filter((bk) => bk.id !== b.id)
                                  );
                                  fetchBooks(); // refresca la página actual
                                  document.body.click();
                                } catch (e) {
                                  console.error("Error inesperado", e);
                                }
                              }}
                            >
                              Confirmar eliminación
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* PAGINACIÓN */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => pagination.hasPrev && setPage(page - 1)}
            />
          </PaginationItem>

          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <PaginationItem key={n}>
                <PaginationLink
                  isActive={n === page}
                  onClick={() => setPage(n)}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => pagination.hasNext && setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
