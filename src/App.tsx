import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ArchitectureView from './pages/ArchitectureView'
import CodeStructure from './pages/CodeStructure'
import Documentation from './pages/Documentation'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/architecture" element={<ArchitectureView />} />
          <Route path="/code-structure" element={<CodeStructure />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
