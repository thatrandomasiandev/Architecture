import React, { useState } from 'react'
import { 
  BookOpen, 
  FileText, 
  Download, 
  Eye,
  Edit,
  Save,
  Plus,
  Trash2,
  Search
} from 'lucide-react'

interface DocumentationSection {
  id: string
  title: string
  content: string
  lastModified: string
  author: string
  tags: string[]
}

const sampleSections: DocumentationSection[] = [
  {
    id: '1',
    title: 'System Overview',
    content: `# System Overview

This architecture visualizer is a comprehensive tool for documenting and visualizing software architecture. It provides interactive diagrams, code structure analysis, and automated documentation generation.

## Key Features

- **Interactive Architecture Diagrams**: Visualize system components and their relationships
- **Code Structure Analysis**: Explore project file organization and dependencies
- **Real-time Documentation**: Generate and maintain up-to-date documentation
- **Export Capabilities**: Export diagrams and documentation in various formats

## Architecture Principles

The system follows these key principles:

1. **Modularity**: Each component is self-contained and reusable
2. **Scalability**: Designed to handle projects of any size
3. **Extensibility**: Easy to add new visualization types and features
4. **Performance**: Optimized for large codebases and complex diagrams`,
    lastModified: '2024-01-15',
    author: 'Joshua Terranova',
    tags: ['overview', 'architecture', 'features']
  },
  {
    id: '2',
    title: 'API Documentation',
    content: `# API Documentation

## REST Endpoints

### Architecture Analysis
- \`GET /api/architecture/analyze\` - Analyze project structure
- \`POST /api/architecture/generate\` - Generate architecture diagram
- \`GET /api/architecture/export/{format}\` - Export diagram

### Code Structure
- \`GET /api/code/structure\` - Get file tree structure
- \`GET /api/code/dependencies\` - Analyze dependencies
- \`POST /api/code/analyze\` - Perform code analysis

### Documentation
- \`GET /api/docs/sections\` - List documentation sections
- \`POST /api/docs/sections\` - Create new section
- \`PUT /api/docs/sections/{id}\` - Update section
- \`DELETE /api/docs/sections/{id}\` - Delete section

## Authentication

All API endpoints require authentication via JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting

API requests are rate limited to 1000 requests per hour per user.`,
    lastModified: '2024-01-14',
    author: 'Joshua Terranova',
    tags: ['api', 'endpoints', 'authentication']
  },
  {
    id: '3',
    title: 'Deployment Guide',
    content: `# Deployment Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)

## Local Development

1. Clone the repository:
\`\`\`bash
git clone https://github.com/thatrandomasiandev/Architecture.git
cd Architecture
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Production Deployment

### Docker Deployment

1. Build the Docker image:
\`\`\`bash
docker build -t architecture-visualizer .
\`\`\`

2. Run the container:
\`\`\`bash
docker run -p 3000:3000 architecture-visualizer
\`\`\`

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
3. Deploy

## Environment Variables

- \`VITE_API_URL\`: Backend API URL
- \`VITE_APP_NAME\`: Application name
- \`VITE_VERSION\`: Application version`,
    lastModified: '2024-01-13',
    author: 'Joshua Terranova',
    tags: ['deployment', 'docker', 'vercel']
  }
]

export default function Documentation() {
  const [sections, setSections] = useState<DocumentationSection[]>(sampleSections)
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(sections[0])
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const allTags = Array.from(new Set(sections.flatMap(s => s.tags)))

  const filteredSections = sections.filter(section => {
    const matchesSearch = !searchTerm || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'all' || section.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleEdit = () => {
    if (selectedSection) {
      setEditContent(selectedSection.content)
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (selectedSection) {
      const updatedSections = sections.map(section =>
        section.id === selectedSection.id
          ? { ...section, content: editContent, lastModified: new Date().toISOString().split('T')[0] }
          : section
      )
      setSections(updatedSections)
      setSelectedSection({ ...selectedSection, content: editContent, lastModified: new Date().toISOString().split('T')[0] })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent('')
  }

  const handleNewSection = () => {
    const newSection: DocumentationSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '# New Section\n\nAdd your content here...',
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Joshua Terranova',
      tags: ['new']
    }
    setSections([...sections, newSection])
    setSelectedSection(newSection)
  }

  const handleDeleteSection = (id: string) => {
    const updatedSections = sections.filter(section => section.id !== id)
    setSections(updatedSections)
    if (selectedSection?.id === id) {
      setSelectedSection(updatedSections[0] || null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-2 text-gray-600">
            Create and manage comprehensive project documentation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleNewSection} className="btn-primary px-4 py-2">
            <Plus className="h-4 w-4 mr-2" />
            New Section
          </button>
          <button className="btn-secondary px-4 py-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="input w-32"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredSections.length} sections
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSection?.id === section.id
                      ? 'bg-primary-100 border border-primary-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => setSelectedSection(section)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{section.lastModified}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {section.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSection(section.id)
                      }}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {selectedSection ? (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSection.title}</h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Last modified: {selectedSection.lastModified}</span>
                    <span>By: {selectedSection.author}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} className="btn-primary px-3 py-2">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </button>
                      <button onClick={handleCancel} className="btn-secondary px-3 py-2">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={handleEdit} className="btn-secondary px-3 py-2">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Enter your documentation content in Markdown..."
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono bg-gray-50 p-4 rounded-lg">
                    {selectedSection.content}
                  </pre>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSection.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No section selected</h3>
                <p className="text-gray-500">Choose a section from the list to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
