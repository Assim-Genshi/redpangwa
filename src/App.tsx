import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookInfo from './pages/BookInfo';
import AuthorProfile from './pages/AuthorProfile';
import ReadPage from './pages/ReadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookInfo />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/read/:id" element={<ReadPage />} />
      </Routes>
    </Router>
  );
}

export default App;


/*      
        
        */