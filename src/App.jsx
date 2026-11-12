import { Route, Routes } from 'react-router'
import Nav from './components/Nav.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import Kids from './pages/Kids.jsx'

function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/kids" element={<Kids />} />
      </Routes>
    </>
  )
}

export default App
