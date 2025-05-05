import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authorsData from "../data/authors.json";
import { Book, Author } from "../types/book";
import booksData from "../data/books.json";
import { Card, Image } from "@heroui/react";
import Logo from "../components/Logo";
import ThemeSwitcher from "../components/Themeswitcer";

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const getAuthorNames = (book: Book): string => {
    const matched = book.authorIds
      .map((id) => authorsData.find((a) => a.id === id))
      .filter(Boolean) as Author[];
    return matched.map((a) => a.name).join(", ");
  };

  return (
    <main className="p-6 max-w-7xl mx-auto bg-base-100">
      <div className="flex flex-row justify-between items-center">
      <h1 className="text-3xl font-bold mb-6">Explore Books</h1>
      <ThemeSwitcher/>
      </div>
      <div className="flex flex-row  justify-center gap-6">
        {books.map((book) => (
          <Card
            key={book.id}
            isPressable
            isFooterBlurred
            className="border-none w-[300px] h-fit rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out group"
            radius="lg"
            onPress={() => navigate(`/book/${book.id}`)}
          >
            <div className="relative w-full h-full">
              {/* 🧠 Overlay — only on hover (hidden on mobile via md:block) */}
              <div
                className="absolute inset-0 hidden md:flex flex-col justify-center items-center
                  bg-base-100/70 backdrop-blur-lg p-4 gap-2 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 ease-in-out z-50 pointer-events-none"
              >
                <h1 className="text-2xl font-bold text-base-content text-center ">
                  {book.title}
                </h1>
                <h2 className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {getAuthorNames(book)}
                </h2>
              </div>

              <Image
                alt={book.title}
                className="w-full h-full object-cover"
                src={book.cover}
              />
            </div>
          </Card>
          ))}
        <div>
          <Logo className="text-base-300" size={100}/>
        </div>
      </div>
    </main>
  );
};

export default Home;
