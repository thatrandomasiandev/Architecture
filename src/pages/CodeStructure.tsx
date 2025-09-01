import React, { useState } from 'react'
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  Search,
  Filter,
  Code,
  FileText,
  Image,
  Database
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'folder' | 'file'
  fileType?: 'tsx' | 'ts' | 'js' | 'jsx' | 'css' | 'json' | 'md' | 'png' | 'jpg' | 'svg' | 'sql'
  size?: number
  children?: FileNode[]
  lastModified?: string
  lines?: number
}

const sampleFileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'Layout.tsx', name: 'Layout.tsx', type: 'file', fileType: 'tsx', size: 2048, lines: 120, lastModified: '2024-01-15' },
          { id: 'Header.tsx', name: 'Header.tsx', type: 'file', fileType: 'tsx', size: 1024, lines: 60, lastModified: '2024-01-14' },
          { id: 'Sidebar.tsx', name: 'Sidebar.tsx', type: 'file', fileType: 'tsx', size: 1536, lines: 90, lastModified: '2024-01-13' },
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        type: 'folder',
        children: [
          { id: 'Dashboard.tsx', name: 'Dashboard.tsx', type: 'file', fileType: 'tsx', size: 3072, lines: 180, lastModified: '2024-01-15' },
          { id: 'Architecture.tsx', name: 'Architecture.tsx', type: 'file', fileType: 'tsx', size: 4096, lines: 240, lastModified: '2024-01-15' },
          { id: 'CodeStructure.tsx', name: 'CodeStructure.tsx', type: 'file', fileType: 'tsx', size: 2560, lines: 150, lastModified: '2024-01-14' },
        ]
      },
      {
        id: 'utils',
        name: 'utils',
        type: 'folder',
        children: [
          { id: 'helpers.ts', name: 'helpers.ts', type: 'file', fileType: 'ts', size: 512, lines: 30, lastModified: '2024-01-12' },
          { id: 'constants.ts', name: 'constants.ts', type: 'file', fileType: 'ts', size: 256, lines: 15, lastModified: '2024-01-11' },
        ]
      },
      { id: 'App.tsx', name: 'App.tsx', type: 'file', fileType: 'tsx', size: 1024, lines: 60, lastModified: '2024-01-15' },
      { id: 'main.tsx', name: 'main.tsx', type: 'file', fileType: 'tsx', size: 128, lines: 8, lastModified: '2024-01-10' },
      { id: 'index.css', name: 'index.css', type: 'file', fileType: 'css', size: 2048, lines: 120, lastModified: '2024-01-09' },
    ]
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    children: [
      { id: 'index.html', name: 'index.html', type: 'file', fileType: 'html', size: 512, lines: 25, lastModified: '2024-01-10' },
      { id: 'favicon.ico', name: 'favicon.ico', type: 'file', fileType: 'ico', size: 1024, lastModified: '2024-01-10' },
    ]
  },
  { id: 'package.json', name: 'package.json', type: 'file', fileType: 'json', size: 1024, lines: 50, lastModified: '2024-01-15' },
  { id: 'tsconfig.json', name: 'tsconfig.json', type: 'file', fileType: 'json', size: 512, lines: 25, lastModified: '2024-01-10' },
  { id: 'README.md', name: 'README.md', type: 'file', fileType: 'md', size: 2048, lines: 100, lastModified: '2024-01-15' },
]

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case 'tsx':
    case 'ts':
    case 'js':
    case 'jsx':
      return <Code className="h-4 w-4 text-blue-500" />
    case 'css':
      return <FileText className="h-4 w-4 text-green-500" />
    case 'json':
      return <FileText className="h-4 w-4 text-yellow-500" />
    case 'md':
      return <FileText className="h-4 w-4 text-gray-500" />
    case 'png':
    case 'jpg':
    case 'svg':
      return <Image className="h-4 w-4 text-purple-500" />
    case 'sql':
      return <Database className="h-4 w-4 text-orange-500" />
    default:
      return <File className="h-4 w-4 text-gray-400" />
  }
}

interface TreeNodeProps {
  node: FileNode
  level: number
  expanded: Set<string>
  onToggle: (id: string) => void
  selectedFile: FileNode | null
  onSelectFile: (file: FileNode) => void
}

function TreeNode({ node, level, expanded, onToggle, selectedFile, onSelectFile }: TreeNodeProps) {
  const isExpanded = expanded.has(node.id)
  const isSelected = selectedFile?.id === node.id

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-primary-100 text-primary-700' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            onToggle(node.id)
          } else {
            onSelectFile(node)
          }
        }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
            )}
            <Folder className="h-4 w-4 text-blue-500 mr-2" />
          </>
        ) : (
          <>
            <div className="w-5 mr-1" />
            {getFileIcon(node.fileType)}
            <span className="ml-2" />
          </>
        )}
        <span className="text-sm font-medium">{node.name}</span>
        {node.type === 'file' && node.size && (
          <span className="ml-auto text-xs text-gray-500">
            {(node.size / 1024).toFixed(1)}KB
          </span>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CodeStructure() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src']))
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const filteredTree = (nodes: FileNode[]): FileNode[] => {
    return nodes.filter(node => {
      const matchesSearch = !searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || node.fileType === filterType || node.type === 'folder'
      
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filteredTree(node.children)
        return matchesSearch && matchesFilter && filteredChildren.length > 0
      }
      
      return matchesSearch && matchesFilter
    }).map(node => {
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: filteredTree(node.children)
        }
      }
      return node
    })
  }

  const getTotalStats = () => {
    let totalFiles = 0
    let totalLines = 0
    let totalSize = 0

    const countStats = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'file') {
          totalFiles++
          if (node.lines) totalLines += node.lines
          if (node.size) totalSize += node.size
        }
        if (node.children) {
          countStats(node.children)
        }
      })
    }

    countStats(sampleFileTree)
    return { totalFiles, totalLines, totalSize }
  }

  const stats = getTotalStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Code Structure</h1>
        <p className="mt-2 text-gray-600">
          Explore your project's file structure and dependencies
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center">
            <File className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Files</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalFiles}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Code className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Lines</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLines.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Size</p>
              <p className="text-2xl font-semibold text-gray-900">{(stats.totalSize / 1024).toFixed(1)}KB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input w-32"
              >
                <option value="all">All Types</option>
                <option value="tsx">TSX</option>
                <option value="ts">TS</option>
                <option value="js">JS</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="md">Markdown</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary px-3 py-2">
              Expand All
            </button>
            <button className="btn-secondary px-3 py-2">
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* File Tree and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree */}
        <div className="lg:col-span-2">
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Structure</h3>
            <div className="max-h-96 overflow-y-auto">
              {filteredTree(sampleFileTree).map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  expanded={expanded}
                  onToggle={toggleExpanded}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                />
              ))}
            </div>
          </div>
        </div>

        {/* File Details */}
        <div>
          {selectedFile ? (
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-sm text-gray-900">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <p className="text-sm text-gray-900 capitalize">{selectedFile.fileType || 'Unknown'}</p>
                </div>
                {selectedFile.size && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Size:</span>
                    <p className="text-sm text-gray-900">{(selectedFile.size / 1024).toFixed(1)}KB</p>
                  </div>
                )}
                {selectedFile.lines && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Lines:</span>
                    <p className="text-sm text-gray-900">{selectedFile.lines.toLocaleString()}</p>
                  </div>
                )}
                {selectedFile.lastModified && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Modified:</span>
                    <p className="text-sm text-gray-900">{selectedFile.lastModified}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Details</h3>
              <p className="text-sm text-gray-500">Select a file to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
