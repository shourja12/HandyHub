import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./Home"
import CreateTask from "./pages/CreateTask"
import Chat from "./pages/Chat"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create"   element={<CreateTask />} />
        <Route path="/chat"     element={<Chat />} />

        {/* Common alias redirects */}
        <Route path="/create-task" element={<Navigate replace to="/create" />} />
        <Route path="/profile"     element={<Navigate replace to="/" />} />
        <Route path="/home"        element={<Navigate replace to="/" />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}