import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Chat from "./pages/Chat";

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">RusChi</h1>
      <p className="mb-4">Приложение для общения русских и китайцев</p>
      <Link to="/chat" className="text-blue-600 hover:underline">
        Перейти в чат
      </Link>
    </div>
  );
}

// function Chat() {
//   return (
//     <div className="p-8">
//       <h2 className="text-2xl">Чат (в разработке)</h2>
//     </div>
//   );
// }

function App() {
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
  );
}

export default App;
