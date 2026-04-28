import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./Home"
import CreateTask from "./pages/CreateTask"
import Chat from "./pages/Chat"





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}