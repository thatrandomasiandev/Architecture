import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ArchitectureNode } from '../utils/projectAnalyzer'

interface ArchitectureGraphProps {
  nodes: ArchitectureNode[]
  width?: number
  height?: number
}

interface GraphNode extends ArchitectureNode {
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  level?: number
  parent?: string
  children?: string[]
}

export default function ArchitectureGraph({ nodes, width = 800, height = 600 }: ArchitectureGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [viewMode, setViewMode] = useState<'structure' | 'dependencies' | 'both'>('both')

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    const g = svg.append('g')

    // Create arrow markers for dependencies
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'dependency-arrow')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#ef4444')
      .attr('stroke', '#ef4444')

    // Create arrow markers for structure
    defs.append('marker')
      .attr('id', 'structure-arrow')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#6b7280')
      .attr('stroke', '#6b7280')

    // Enhance nodes with structure information
    const enhancedNodes: GraphNode[] = nodes.map(node => {
      const pathParts = node.path.split('/')
      const level = pathParts.length - 1
      const parent = pathParts.slice(0, -1).join('/') || null
      
      return {
        ...node,
        level,
        parent: parent || undefined,
        children: nodes.filter(n => n.path.startsWith(node.path + '/')).map(n => n.id)
      }
    })

    // Create structure links (parent-child relationships)
    const structureLinks: Array<{ source: string; target: string; type: 'structure' }> = []
    enhancedNodes.forEach(node => {
      if (node.parent) {
        const parentNode = enhancedNodes.find(n => n.path === node.parent)
        if (parentNode) {
          structureLinks.push({ 
            source: parentNode.id, 
            target: node.id, 
            type: 'structure' 
          })
        }
      }
    })

    // Create dependency links
    const dependencyLinks: Array<{ source: string; target: string; type: 'dependency' }> = []
    enhancedNodes.forEach(node => {
      node.dependencies.forEach(dep => {
        const targetNode = enhancedNodes.find(n => 
          n.name === dep || 
          n.path.includes(dep) || 
          dep.includes(n.name)
        )
        if (targetNode && targetNode.id !== node.id) {
          dependencyLinks.push({ 
            source: node.id, 
            target: targetNode.id, 
            type: 'dependency' 
          })
        }
      })
    })

    // Combine links based on view mode
    let allLinks: Array<{ source: string; target: string; type: string }> = []
    if (viewMode === 'structure' || viewMode === 'both') {
      allLinks = [...allLinks, ...structureLinks]
    }
    if (viewMode === 'dependencies' || viewMode === 'both') {
      allLinks = [...allLinks, ...dependencyLinks]
    }

    // Create force simulation
    const simulation = d3.forceSimulation(enhancedNodes as any)
      .force('link', d3.forceLink(allLinks).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(allLinks)
      .enter().append('line')
      .attr('class', (d: any) => `diagram-link ${d.type}`)
      .attr('marker-end', (d: any) => `url(#${d.type}-arrow)`)
      .attr('stroke', (d: any) => d.type === 'dependency' ? '#ef4444' : '#6b7280')
      .attr('stroke-width', (d: any) => d.type === 'dependency' ? 2 : 1)
      .attr('stroke-dasharray', (d: any) => d.type === 'structure' ? '5,5' : 'none')

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(enhancedNodes)
      .enter().append('g')
      .attr('class', 'diagram-node')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add shapes for nodes based on type
    node.each(function(d) {
      const nodeGroup = d3.select(this)
      
      // Different shapes for different types
      if (d.type === 'page') {
        // Rectangle for pages
        nodeGroup.append('rect')
          .attr('width', Math.max(40, Math.min(80, (d.complexity || 10) * 4)))
          .attr('height', Math.max(30, Math.min(60, (d.complexity || 10) * 3)))
          .attr('x', -Math.max(20, Math.min(40, (d.complexity || 10) * 2)))
          .attr('y', -Math.max(15, Math.min(30, (d.complexity || 10) * 1.5)))
          .attr('rx', 8)
          .attr('fill', '#8b5cf6')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
      } else if (d.type === 'service') {
        // Diamond for services
        const size = Math.max(20, Math.min(40, d.complexity || 10))
        nodeGroup.append('path')
          .attr('d', `M 0,-${size} L ${size},0 L 0,${size} L -${size},0 Z`)
          .attr('fill', '#10b981')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
      } else if (d.type === 'database') {
        // Cylinder for databases
        const width = Math.max(30, Math.min(60, (d.complexity || 10) * 3))
        const height = Math.max(20, Math.min(40, (d.complexity || 10) * 2))
        nodeGroup.append('ellipse')
          .attr('cx', 0)
          .attr('cy', -height/2)
          .attr('rx', width/2)
          .attr('ry', height/4)
          .attr('fill', '#ef4444')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
        nodeGroup.append('rect')
          .attr('x', -width/2)
          .attr('y', -height/2)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#ef4444')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
        nodeGroup.append('ellipse')
          .attr('cx', 0)
          .attr('cy', height/2)
          .attr('rx', width/2)
          .attr('ry', height/4)
          .attr('fill', '#ef4444')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
      } else {
        // Circle for components and others
        nodeGroup.append('circle')
          .attr('r', Math.max(20, Math.min(40, d.complexity || 10)))
          .attr('fill', (() => {
            switch (d.type) {
              case 'component': return '#3b82f6'
              case 'api': return '#f59e0b'
              case 'utility': return '#6b7280'
              default: return '#9ca3af'
            }
          })())
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
      }
    })

    // Add node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => {
        const baseOffset = d.type === 'page' ? 25 : d.type === 'service' ? 30 : 25
        return Math.max(baseOffset, Math.min(baseOffset + 20, (d.complexity || 10) + baseOffset))
      })
      .attr('class', 'text-xs font-medium fill-white')
      .text(d => d.name)

    // Add type labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => {
        const baseOffset = d.type === 'page' ? -20 : d.type === 'service' ? -25 : -30
        return Math.max(baseOffset - 10, Math.min(baseOffset, -(d.complexity || 10) + baseOffset))
      })
      .attr('class', 'text-xs fill-gray-600')
      .text(d => d.type.toUpperCase())

    // Add path labels for structure
    if (viewMode === 'structure' || viewMode === 'both') {
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', (d) => {
          const baseOffset = d.type === 'page' ? 40 : d.type === 'service' ? 45 : 40
          return Math.max(baseOffset, Math.min(baseOffset + 20, (d.complexity || 10) + baseOffset))
        })
        .attr('class', 'text-xs fill-gray-500')
        .text(d => d.path.split('/').slice(-2).join('/'))
    }

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

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

  }, [nodes, width, height, viewMode])

  return (
    <div className="w-full">
      {/* View Mode Controls */}
      <div className="mb-4 flex justify-center space-x-2">
        <button
          onClick={() => setViewMode('structure')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            viewMode === 'structure' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📁 Structure Only
        </button>
        <button
          onClick={() => setViewMode('dependencies')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            viewMode === 'dependencies' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔗 Dependencies Only
        </button>
        <button
          onClick={() => setViewMode('both')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            viewMode === 'both' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🎯 Both
        </button>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={height}
        className="border rounded-lg bg-gray-50"
      />
    </div>
  )
}
