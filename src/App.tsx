import React, { useState } from 'react'
import ProjectUpload from './components/ProjectUpload'
import ArchitectureGraph from './components/ArchitectureGraph'
import { ProjectAnalysis } from './utils/projectAnalyzer'
import { createTestProject } from './utils/testAnalyzer'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [showUpload, setShowUpload] = useState(false)
  const [currentProject, setCurrentProject] = useState<ProjectAnalysis | null>(null)

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">📊 Dashboard</h2>
              {!currentProject && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Project
                </button>
              )}
            </div>
            
            {currentProject ? (
              <>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    📁 {currentProject.name}
                  </h3>
                  <p className="text-blue-700">
                    {currentProject.statistics.totalFiles} files • {currentProject.statistics.totalLines.toLocaleString()} lines • {(currentProject.statistics.totalSize / 1024).toFixed(1)}KB
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Components</h3>
                    <p className="text-3xl font-bold text-blue-600">{currentProject.statistics.components}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Services</h3>
                    <p className="text-3xl font-bold text-green-600">{currentProject.statistics.services}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Pages</h3>
                    <p className="text-3xl font-bold text-purple-600">{currentProject.statistics.pages}</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Files</h3>
                    <p className="text-3xl font-bold text-orange-600">{currentProject.statistics.totalFiles}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                    <div className="space-y-2">
                      {Object.entries(currentProject.statistics.languages).map(([lang, count]) => (
                        <div key={lang} className="flex justify-between items-center">
                          <span className="text-gray-700">{lang}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">File Types</h3>
                    <div className="space-y-2">
                      {Object.entries(currentProject.statistics.fileTypes).slice(0, 5).map(([ext, count]) => (
                        <div key={ext} className="flex justify-between items-center">
                          <span className="text-gray-700">{ext || 'no extension'}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Project Loaded</h3>
                <p className="text-gray-600 mb-6">
                  Upload a project folder to start analyzing its architecture and structure
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Project
                </button>
              </div>
            )}
          </div>
        )
      
      case 'architecture':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🏗️ Architecture View</h2>
            
            {currentProject ? (
              <>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    📁 {currentProject.name} - Architecture Analysis
                  </h3>
                  <p className="text-blue-700">
                    {currentProject.architecture.length} components analyzed
                  </p>
                </div>
                
                {/* Interactive Architecture Graph */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Architecture Graph</h3>
                    <div className="text-sm text-gray-600">
                      Drag nodes to rearrange • Scroll to zoom • Click and drag to pan
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <ArchitectureGraph nodes={currentProject.architecture} height={500} />
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
                    
                    {/* Node Types */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Node Types & Shapes</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Components</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 transform rotate-45"></div>
                          <span className="text-sm text-gray-600">Services</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-purple-500 rounded"></div>
                          <span className="text-sm text-gray-600">Pages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">APIs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm text-gray-600">Databases</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Utilities</span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Types */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Connection Types</h5>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-0.5 bg-red-500"></div>
                          <span className="text-sm text-gray-600">Dependencies</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-0.5 bg-gray-500 border-dashed border-t-2 border-gray-500"></div>
                          <span className="text-sm text-gray-600">File Structure</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Node size represents complexity • Use view mode buttons to toggle connection types
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Architecture Nodes */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Details</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {currentProject.architecture.map((node) => (
                        <div key={node.id} className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                node.type === 'component' ? 'bg-blue-500' :
                                node.type === 'service' ? 'bg-green-500' :
                                node.type === 'page' ? 'bg-purple-500' :
                                node.type === 'api' ? 'bg-orange-500' :
                                node.type === 'database' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}></div>
                              <span className="font-medium text-gray-900">{node.name}</span>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {node.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{node.path}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{node.dependencies.length} dependencies</span>
                            <span>{node.dependents.length} dependents</span>
                            <span>{node.complexity || 0} complexity</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dependencies Graph */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependency Overview</h3>
                    <div className="space-y-4">
                      {Object.entries(currentProject.dependencies).slice(0, 10).map(([filePath, deps]) => (
                        <div key={filePath} className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {filePath.split('/').pop()}
                          </h4>
                          <div className="space-y-1">
                            {deps.imports.slice(0, 3).map((imp, idx) => (
                              <div key={idx} className="text-xs text-gray-600 flex items-center space-x-2">
                                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                <span className="truncate">{imp}</span>
                              </div>
                            ))}
                            {deps.imports.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{deps.imports.length - 3} more imports
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Project Loaded</h3>
                <p className="text-gray-600 mb-6">
                  Upload a project to see its architecture analysis and component relationships
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Project
                </button>
              </div>
            )}
          </div>
        )
      
      case 'code':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📁 Code Structure</h2>
            
            {currentProject ? (
              <>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    📁 {currentProject.name} - File Structure
                  </h3>
                  <p className="text-blue-700">
                    {currentProject.statistics.totalFiles} files in project
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Structure</h3>
                  <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
                    {renderFileTree(currentProject.files, 0)}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Project Loaded</h3>
                <p className="text-gray-600 mb-6">
                  Upload a project to explore its file structure and organization
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Project
                </button>
              </div>
            )}
          </div>
        )
      
      case 'documentation':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 Documentation</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Overview</h3>
                <p className="text-gray-600 mb-4">This architecture visualizer provides comprehensive tools for documenting and visualizing software architecture.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">overview</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">architecture</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
                <p className="text-gray-600 mb-4">REST endpoints for architecture analysis and code structure exploration.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">api</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">endpoints</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveView('dashboard')}
            >
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-600">Project overview with statistics and quick actions</p>
            </div>
            
            <div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveView('architecture')}
            >
              <div className="text-3xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Architecture</h3>
              <p className="text-gray-600">Interactive D3.js system diagrams with zoom and filtering</p>
            </div>
            
            <div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveView('code')}
            >
              <div className="text-3xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Code Structure</h3>
              <p className="text-gray-600">File tree visualization with search and statistics</p>
            </div>
            
            <div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveView('documentation')}
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600">Markdown-based documentation management</p>
            </div>
          </div>
        )
    }
  }

  const renderFileTree = (files: any[], depth: number) => {
    return files.map((file, index) => (
      <div key={index} className="flex items-center space-x-2" style={{ paddingLeft: `${depth * 16}px` }}>
        <span className={file.type === 'directory' ? 'text-blue-500' : 'text-green-500'}>
          {file.type === 'directory' ? '📁' : '📄'}
        </span>
        <span className="text-gray-700">{file.name}</span>
        {file.size && file.type === 'file' && (
          <span className="text-gray-500 text-xs">
            ({(file.size / 1024).toFixed(1)}KB)
          </span>
        )}
      </div>
    )).concat(
      files.flatMap(file => 
        file.children ? renderFileTree(file.children, depth + 1) : []
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏗️ Architecture Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            A comprehensive companion website for visualizing software architecture and code structure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              📁 Upload Your Project
            </button>
            <button
              onClick={() => setCurrentProject(createTestProject())}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              🧪 Try Test Project
            </button>
          </div>
        </div>

        {/* Navigation */}
        {activeView !== 'home' && (
          <div className="mb-6">
            <button 
              onClick={() => setActiveView('home')}
              className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              ← Back to Home
            </button>
          </div>
        )}

        {/* Content */}
        {renderContent()}

        {/* Status */}
        <div className="text-center">
          <div className="bg-green-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl inline-block">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">✅</span>
              <span className="text-lg font-semibold">Architecture Visualizer is running successfully!</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">React 18</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">TypeScript</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">Vite</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">Tailwind CSS</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">D3.js</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Built by <span className="font-semibold text-gray-700">Joshua Terranova</span> - Software Engineer</p>
          <p className="mt-2">
            <a href="https://github.com/thatrandomasiandev/Architecture" className="text-blue-600 hover:text-blue-800 underline">
              View on GitHub
            </a>
          </p>
        </div>
      </div>

      {/* Project Upload Modal */}
      {showUpload && (
        <ProjectUpload
          onProjectAnalyzed={(analysis) => {
            setCurrentProject(analysis)
            setShowUpload(false)
          }}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}

export default App