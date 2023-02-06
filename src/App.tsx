import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home/Home';
import { Login } from './pages/Login';
import Navbar from './components/Navbar';
import { Posts } from './pages/posts/Posts';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/post' element={<Posts />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
