import { useParams, Link } from "react-router-dom";
import booksData from "../data/books.json";
import authorsData from "../data/authors.json";
import { Book, Author } from "../types/book";

const BookInfo = () => {
  const { id } = useParams();
  const book: Book | undefined = booksData.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Book not found 😢</h2>
        <Link to="/" className="text-blue-500 underline">Go Back Home</Link>
      </div>
    );
  }

  const authors: Author[] = book.authorIds
    .map((authorId) => authorsData.find((a) => a.id === authorId))
    .filter(Boolean) as Author[];

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full md:w-64 h-auto object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-2">Year: {book.year}</p>

          <div className="mb-4">
            <span className="font-medium">Author{authors.length > 1 ? "s" : ""}:</span>{" "}
            {authors.map((author, idx) => (
              <span key={author.id}>
                <Link to={`/author/${author.id}`} className="text-blue-500 hover:underline">
                  {author.name}
                </Link>
                {idx < authors.length - 1 && ", "}
              </span>
            ))}
          </div>

          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {book.description}
          </p>

          <Link
            to={`/read/${book.id}`}
            className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start Reading →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BookInfo;
