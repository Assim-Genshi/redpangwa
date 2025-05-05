import { useParams, Link } from "react-router-dom";
import authorsData from "../data/authors.json";
import booksData from "../data/books.json";
import { Author, Book } from "../types/book";

const AuthorProfile = () => {
  const { id } = useParams(); // 👈 get author ID from URL

  const author: Author | undefined = authorsData.find((a) => a.id === id); // 👈 find the author

  // If no author found, show error
  if (!author) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Author not found 😢</h2>
        <Link to="/" className="text-blue-500 underline">Go Back Home</Link>
      </div>
    );
  }

  // 👇 Find all books by this author (match their ID in the authorIds array)
  const booksByAuthor: Book[] = booksData.filter((book) =>
    book.authorIds.includes(author.id)
  );

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* 🔹 AUTHOR INFO SECTION */}
      <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
        {author.photo && (
          <img
            src={author.photo}
            alt={author.name}
            className="w-40 h-40 object-cover rounded-full shadow-md"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="text-gray-700 mt-2 max-w-xl">{author.bio}</p>
        </div>
      </div>

      {/* 🔹 BOOKS BY THIS AUTHOR */}
      <h2 className="text-2xl font-semibold mb-4">Books by {author.name}</h2>
      {booksByAuthor.length === 0 ? (
        <p className="text-gray-600">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {booksByAuthor.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id}>
              <div className="bg-white rounded-xl shadow hover:scale-105 transition-transform duration-300">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default AuthorProfile;
