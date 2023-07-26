import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import axios from 'axios';
import Layout from './Layout';
import BookPage from "./pages/BookPage";
import LoginPage from './pages/LoginPAge';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en);

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/book/:id" element={<BookPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
