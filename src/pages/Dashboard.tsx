import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Network, 
  FileText, 
  BookOpen, 
  Upload,
  BarChart3,
  GitBranch,
  Database,
  Server
} from 'lucide-react'

const features = [
  {
    name: 'Architecture Diagrams',
    description: 'Visualize system architecture with interactive diagrams',
    icon: Network,
    href: '/architecture',
    color: 'bg-blue-500',
  },
  {
    name: 'Code Structure',
    description: 'Explore code organization and dependencies',
    icon: FileText,
    href: '/code-structure',
    color: 'bg-green-500',
  },
  {
    name: 'Documentation',
    description: 'Generate and view comprehensive documentation',
    icon: BookOpen,
    href: '/documentation',
    color: 'bg-purple-500',
  },
]

const stats = [
  { name: 'Components', value: '24', icon: Network },
  { name: 'Services', value: '8', icon: Server },
  { name: 'APIs', value: '12', icon: GitBranch },
  { name: 'Databases', value: '3', icon: Database },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Architecture Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visualize and explore your software architecture and code structure
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary px-4 py-2">
            <Upload className="h-4 w-4 mr-2" />
            Upload Project
          </button>
          <button className="btn-secondary px-4 py-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button className="btn-secondary px-4 py-2">
            <GitBranch className="h-4 w-4 mr-2" />
            Analyze Dependencies
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Explore Features</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="card p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Architecture diagram updated</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">New component added to structure</p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Documentation generated</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
