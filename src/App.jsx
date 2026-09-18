import { Route, Routes } from 'react-router'
import Nav from './components/Nav.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
