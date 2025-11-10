"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Book {
  id: string;
  title: string;
  publishedYear: number;
  genre: string;
  pages: number;
}

interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  nationality: string;
  birthYear: number;
  books: Book[];
  _count: {
    books: number;
  };
}

interface Stats {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number } | null;
  latestBook: { title: string; year: number } | null;
  averagePages: number | null;
  genres: string[];
  longestBook: { title: string; pages: number } | null;
  shortestBook: { title: string; pages: number } | null;
}

function EditAuthorForm({
  author,
  onUpdated,
}: {
  author: Author;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState({
    name: author.name,
    email: author.email,
    nationality: author.nationality,
    birthYear: author.birthYear ?? "",
    bio: author.bio,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const res = await fetch(`/api/authors/${author.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      onUpdated(); // refresca datos del autor
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="font-medium">Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Nacionalidad</label>
        <input
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Año de nacimiento</label>
        <input
          name="birthYear"
          type="number"
          value={form.birthYear}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Biografía</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
        />
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}

function CreateBookForm({
  authorId,
  onCreated,
}: {
  authorId: string;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    pages: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authorId, // ✅ ID oculto del autor
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Error al crear libro");
        return;
      }

      onCreated(); // ✅ refresca lista de libros
      document.body.click(); // ✅ cierra dialog
    } catch (err) {
      setError("Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-1">
        <label className="font-medium">Título *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">ISBN</label>
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Año de publicación</label>
        <input
          name="publishedYear"
          type="number"
          value={form.publishedYear}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Género</label>
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="font-medium">Páginas</label>
        <input
          name="pages"
          type="number"
          value={form.pages}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* ID DEL AUTOR OCULTO ✅ */}
      <input type="hidden" name="authorId" value={authorId} />

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        {saving ? "Guardando..." : "Crear libro"}
      </Button>
    </div>
  );
}

export default function AuthorDetailPage() {
  const { id } = useParams();

  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [authorRes, statsRes] = await Promise.all([
        fetch(`/api/authors/${id}`),
        fetch(`/api/authors/${id}/stats`),
      ]);

      const authorJson = await authorRes.json();
      const statsJson = await statsRes.json();

      setAuthor(authorJson);
      setStats(statsJson);
    } catch (err) {
      console.error("Error cargando datos del autor:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Cargando información...</div>;
  if (!author) return <div className="p-6">Autor no encontrado.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{author.name}</h1>

      {/* ACCIONES */}
      <div className="flex gap-4">
        {/* EDITAR AUTOR */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Editar autor</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar información del autor</DialogTitle>
            </DialogHeader>

            {author && <EditAuthorForm author={author} onUpdated={fetchData} />}
          </DialogContent>
        </Dialog>
        {/* AGREGAR LIBRO */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Agregar nuevo libro</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar libro a {author.name}</DialogTitle>
            </DialogHeader>

            <CreateBookForm authorId={author.id} onCreated={fetchData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA (2 filas) */}
        <div className="flex flex-col gap-6 col-span-1">
          {/* INFO DEL AUTOR */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold mb-2">
                Información del autor
              </h2>

              <p>
                <b>Email:</b> {author.email}
              </p>
              <p>
                <b>Nacionalidad:</b> {author.nationality}
              </p>
              <p>
                <b>Año de nacimiento:</b> {author.birthYear}
              </p>
              <p>
                <b>Biografía:</b>
                <br />
                {author.bio}
              </p>
              <p>
                <b>Total de libros:</b> {author._count.books}
              </p>
            </CardContent>
          </Card>

          {/* ESTADISTICAS */}
          {stats && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>

                <p>
                  <b>Total de libros:</b> {stats.totalBooks}
                </p>
                <p>
                  <b>Primer libro:</b>{" "}
                  {stats.firstBook
                    ? `${stats.firstBook.title} (${stats.firstBook.year})`
                    : "—"}
                </p>
                <p>
                  <b>Último libro:</b>{" "}
                  {stats.latestBook
                    ? `${stats.latestBook.title} (${stats.latestBook.year})`
                    : "—"}
                </p>
                <p>
                  <b>Páginas promedio:</b> {stats.averagePages ?? "—"}
                </p>
                <p>
                  <b>Géneros:</b>{" "}
                  {stats.genres.length ? stats.genres.join(", ") : "—"}
                </p>
                <p>
                  <b>Libro más largo:</b>{" "}
                  {stats.longestBook
                    ? `${stats.longestBook.title} (${stats.longestBook.pages} páginas)`
                    : "—"}
                </p>
                <p>
                  <b>Libro más corto:</b>{" "}
                  {stats.shortestBook
                    ? `${stats.shortestBook.title} (${stats.shortestBook.pages} páginas)`
                    : "—"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* COLUMNA DERECHA (LISTA DE LIBROS) */}
        <div className="col-span-2">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Libros de {author.name}
              </h2>

              {author.books.length === 0 ? (
                <div>No tiene libros registrados.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Género</TableHead>
                      <TableHead>Páginas</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {author.books.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.title}</TableCell>
                        <TableCell>{b.publishedYear}</TableCell>
                        <TableCell>{b.genre}</TableCell>
                        <TableCell>{b.pages}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
