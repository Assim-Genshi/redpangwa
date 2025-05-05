import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../types/book";
import booksData from "../data/books.json";
import {Card, CardFooter, Image, Button} from "@heroui/react";

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app you'd fetch from an API
    setBooks(booksData);
  }, []);
  
  return (
    <main className="p-6 max-w-7xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Explore Books</h1>
      <div className="flex flex-wrap justify-center gap-6">
      {books.map((book) => (
  <Card 
    key={book.id}
    isPressable
    isFooterBlurred
    className="border-none w-[300px] h-fit rounded-xl shadow-xl"
    radius="lg"
    onPress={() => navigate(`/book/${book.id}`)}
  >
    <Image
      alt={book.title}
      className="w-full h-full object-cover"
      src={book.cover}
    />
    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 px-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
      <p className="text-tiny text-white/80">Available now.</p>
      <Button
        key={book.id}
        className="text-md font-semibold text-white bg-black/20"
        color="default"
        radius="md"
        size="md"
        variant="flat"
        onPress={() => navigate(`/book/${book.id}`)}
      >
        Read
      </Button>
    </CardFooter>
  </Card>
        ))}
      </div>
    </main>
  );
};

export default Home;
