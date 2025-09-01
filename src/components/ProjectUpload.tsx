import React, { useState, useRef } from 'react'
import { Upload, FolderOpen, FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { ProjectAnalyzer, ProjectAnalysis } from '../utils/projectAnalyzer'

interface ProjectUploadProps {
  onProjectAnalyzed: (analysis: ProjectAnalysis) => void
  onClose: () => void
}

export default function ProjectUpload({ onProjectAnalyzed, onClose }: ProjectUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    setErrorMessage('')

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      setUploadStatus('analyzing')
      
      // Analyze the project
      const analysis = await ProjectAnalyzer.analyzeProject(files)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('success')
      
      setTimeout(() => {
        onProjectAnalyzed(analysis)
        onClose()
      }, 1000)

    } catch (error) {
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze project')
      setIsUploading(false)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : uploadStatus === 'success'
                ? 'border-green-500 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFileInput}
              className="hidden"
              disabled={isUploading}
            />

            {uploadStatus === 'idle' && (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your project folder here
                </h3>
                <p className="text-gray-600 mb-4">
                  Or click to browse and select your project directory
                </p>
                <button
                  onClick={openFileDialog}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose Folder
                </button>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Uploading files...
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">{uploadProgress}% complete</p>
              </>
            )}

            {uploadStatus === 'analyzing' && (
              <>
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing project structure...
                </h3>
                <p className="text-gray-600">
                  Extracting dependencies, components, and architecture
                </p>
              </>
            )}

            {uploadStatus === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Project analyzed successfully!
                </h3>
                <p className="text-gray-600">
                  Your project has been processed and is ready for visualization
                </p>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analysis failed
                </h3>
                <p className="text-red-600 mb-4">{errorMessage}</p>
                <button
                  onClick={() => {
                    setUploadStatus('idle')
                    setUploadProgress(0)
                    setErrorMessage('')
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>

          {/* Supported Features */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Supported Features</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">File structure analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Dependency mapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Component detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Architecture visualization</span>
              </div>
            </div>
          </div>

          {/* Supported Languages */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Supported Languages</h4>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'].map(lang => (
                <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
