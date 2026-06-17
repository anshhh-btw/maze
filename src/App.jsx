import Navbar from "./components/navbar/navbar";
import Homepage from "./components/homepage/homepage";
import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./components/footer/footer";
import './App.css'
import './components/homepage/responsive.css'
import TitleManager from "./components/titleManager/titleManager";
import About from "./components/about/about";
import Algorithms from "./components/algorithms/algorithms";
import Generate from "./components/generate/generate";
import Play from "./components/play/play";
function App() {

  return (
    <BrowserRouter>
      <TitleManager></TitleManager>
      <div className="screen-fade-overlay"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/generate/?" element={<Generate />} />
        <Route path="/play/:mazeData" element={<Play />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
