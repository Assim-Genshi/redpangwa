export interface Book {
    id: string;
    title: string;
    description: string;
    authorIds: string[];
    cover: string;
    content: string;
    year: number;
  }
  
  export interface Author {
    id: string;
    name: string;
    bio: string;
    photo?: string;
  }
  