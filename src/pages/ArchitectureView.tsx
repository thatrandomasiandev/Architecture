import React, { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

interface Node {
  id: string
  name: string
  type: 'service' | 'database' | 'api' | 'component'
  description?: string
  status: 'active' | 'inactive' | 'warning'
}

interface Link {
  source: string
  target: string
  type: 'http' | 'database' | 'message' | 'dependency'
  label?: string
}

const sampleNodes: Node[] = [
  { id: 'frontend', name: 'Frontend App', type: 'component', description: 'React application', status: 'active' },
  { id: 'api-gateway', name: 'API Gateway', type: 'api', description: 'Kong API Gateway', status: 'active' },
  { id: 'auth-service', name: 'Auth Service', type: 'service', description: 'Authentication microservice', status: 'active' },
  { id: 'user-service', name: 'User Service', type: 'service', description: 'User management service', status: 'active' },
  { id: 'order-service', name: 'Order Service', type: 'service', description: 'Order processing service', status: 'warning' },
  { id: 'user-db', name: 'User Database', type: 'database', description: 'PostgreSQL', status: 'active' },
  { id: 'order-db', name: 'Order Database', type: 'database', description: 'MongoDB', status: 'active' },
  { id: 'cache', name: 'Redis Cache', type: 'database', description: 'Redis cache layer', status: 'active' },
]

const sampleLinks: Link[] = [
  { source: 'frontend', target: 'api-gateway', type: 'http', label: 'HTTPS' },
  { source: 'api-gateway', target: 'auth-service', type: 'http', label: 'Auth' },
  { source: 'api-gateway', target: 'user-service', type: 'http', label: 'Users' },
  { source: 'api-gateway', target: 'order-service', type: 'http', label: 'Orders' },
  { source: 'auth-service', target: 'user-db', type: 'database', label: 'Query' },
  { source: 'user-service', target: 'user-db', type: 'database', label: 'CRUD' },
  { source: 'order-service', target: 'order-db', type: 'database', label: 'CRUD' },
  { source: 'user-service', target: 'cache', type: 'database', label: 'Cache' },
  { source: 'order-service', target: 'cache', type: 'database', label: 'Cache' },
]

export default function ArchitectureView() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 600

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    const g = svg.append('g')

    // Create arrow markers
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#94a3b8')

    // Filter nodes and links based on type
    const filteredNodes = filterType === 'all' 
      ? sampleNodes 
      : sampleNodes.filter(node => node.type === filterType)
    
    const filteredLinks = sampleLinks.filter(link => 
      filteredNodes.some(node => node.id === link.source) &&
      filteredNodes.some(node => node.id === link.target)
    )

    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('class', 'diagram-link')
      .attr('marker-end', 'url(#arrowhead)')

    // Create link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(filteredLinks)
      .enter().append('text')
      .attr('class', 'text-xs fill-gray-600 pointer-events-none')
      .style('opacity', showLabels ? 1 : 0)
      .text(d => d.label || '')

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter().append('g')
      .attr('class', 'diagram-node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add circles for nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        switch (d.status) {
          case 'active': return '#10b981'
          case 'warning': return '#f59e0b'
          case 'inactive': return '#ef4444'
          default: return '#6b7280'
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        setSelectedNode(d)
        event.stopPropagation()
      })

    // Add node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('class', 'text-xs font-medium fill-gray-700')
      .text(d => d.name)

    // Add type indicators
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('class', 'text-xs fill-gray-500')
      .text(d => d.type.toUpperCase())

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Click to deselect
    svg.on('click', () => setSelectedNode(null))

  }, [showLabels, filterType])

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.5
      )
    }
  }

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy, 1 / 1.5
      )
    }
  }

  const handleReset = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().transform,
        d3.zoomIdentity
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Architecture View</h1>
          <p className="mt-2 text-gray-600">
            Interactive visualization of your system architecture
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary px-3 py-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-secondary px-3 py-2">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={handleZoomIn} className="btn-ghost p-2">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={handleZoomOut} className="btn-ghost p-2">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={handleReset} className="btn-ghost p-2">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`btn-ghost p-2 ${showLabels ? 'bg-primary-100 text-primary-700' : ''}`}
              >
                {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <span className="text-sm text-gray-600">Show Labels</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-32"
            >
              <option value="all">All</option>
              <option value="service">Services</option>
              <option value="database">Databases</option>
              <option value="api">APIs</option>
              <option value="component">Components</option>
            </select>
          </div>
        </div>
      </div>

      {/* Diagram */}
      <div className="card p-6">
        <div className="flex">
          <div className="flex-1">
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              className="border rounded-lg bg-gray-50"
            />
          </div>
          {selectedNode && (
            <div className="ml-6 w-80">
              <div className="card p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedNode.name}
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {selectedNode.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`ml-2 text-sm font-medium capitalize ${
                      selectedNode.status === 'active' ? 'text-green-600' :
                      selectedNode.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  {selectedNode.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedNode.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  )
}
