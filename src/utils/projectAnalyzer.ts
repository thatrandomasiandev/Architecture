export interface ProjectFile {
  path: string
  name: string
  type: 'file' | 'directory'
  extension?: string
  size: number
  content?: string
  children?: ProjectFile[]
  dependencies?: string[]
  exports?: string[]
  imports?: string[]
  lastModified?: Date
}

export interface ProjectAnalysis {
  name: string
  rootPath: string
  files: ProjectFile[]
  dependencies: DependencyMap
  architecture: ArchitectureNode[]
  statistics: ProjectStatistics
}

export interface DependencyMap {
  [filePath: string]: {
    imports: string[]
    exports: string[]
    dependencies: string[]
  }
}

export interface ArchitectureNode {
  id: string
  name: string
  type: 'component' | 'service' | 'utility' | 'page' | 'api' | 'database' | 'config'
  path: string
  dependencies: string[]
  dependents: string[]
  size: number
  complexity?: number
}

export interface ProjectStatistics {
  totalFiles: number
  totalLines: number
  totalSize: number
  fileTypes: { [extension: string]: number }
  languages: { [language: string]: number }
  dependencies: number
  components: number
  services: number
  pages: number
}

export class ProjectAnalyzer {
  private static readonly SUPPORTED_EXTENSIONS = [
    '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte',
    '.py', '.java', '.cs', '.cpp', '.c', '.h',
    '.php', '.rb', '.go', '.rs', '.swift', '.kt',
    '.html', '.css', '.scss', '.sass', '.less',
    '.json', '.yaml', '.yml', '.xml', '.md'
  ]

  private static readonly COMPONENT_PATTERNS = [
    /component/i, /widget/i, /ui/i, /view/i, /screen/i
  ]

  private static readonly SERVICE_PATTERNS = [
    /service/i, /api/i, /controller/i, /handler/i, /manager/i
  ]

  private static readonly PAGE_PATTERNS = [
    /page/i, /route/i, /view/i, /screen/i
  ]

  static async analyzeProject(files: FileList): Promise<ProjectAnalysis> {
    const projectFiles: ProjectFile[] = []
    const dependencyMap: DependencyMap = {}
    
    // Process all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const relativePath = file.webkitRelativePath || file.name
      
      if (this.isSupportedFile(relativePath)) {
        const content = await this.readFileContent(file)
        const projectFile = await this.analyzeFile(relativePath, file, content)
        projectFiles.push(projectFile)
        
        // Analyze dependencies
        if (content && this.isCodeFile(relativePath)) {
          dependencyMap[relativePath] = this.extractDependencies(content, relativePath)
        }
      }
    }

    // Build file tree
    const fileTree = this.buildFileTree(projectFiles)
    
    // Generate architecture nodes
    const architecture = this.generateArchitectureNodes(projectFiles, dependencyMap)
    
    // Calculate statistics
    const statistics = this.calculateStatistics(projectFiles)

    return {
      name: this.extractProjectName(files),
      rootPath: '/',
      files: fileTree,
      dependencies: dependencyMap,
      architecture,
      statistics
    }
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string || '')
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  private static async analyzeFile(path: string, file: File, content: string): Promise<ProjectFile> {
    const extension = this.getFileExtension(path)
    const isDirectory = file.type === '' && file.size === 0

    return {
      path,
      name: this.getFileName(path),
      type: isDirectory ? 'directory' : 'file',
      extension,
      size: file.size,
      content: isDirectory ? undefined : content,
      lastModified: new Date(file.lastModified)
    }
  }

  private static extractDependencies(content: string, filePath: string) {
    const imports: string[] = []
    const exports: string[] = []
    const dependencies: string[] = []

    // Extract imports
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]
      imports.push(importPath)
      dependencies.push(importPath)
    }

    // Extract exports
    const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1])
    }

    return { imports, exports, dependencies }
  }

  private static generateArchitectureNodes(files: ProjectFile[], dependencyMap: DependencyMap): ArchitectureNode[] {
    const nodes: ArchitectureNode[] = []

    files.forEach(file => {
      if (file.type === 'file' && this.isCodeFile(file.path)) {
        const nodeType = this.determineNodeType(file.path, file.content || '')
        const dependencies = dependencyMap[file.path]?.dependencies || []
        
        nodes.push({
          id: file.path,
          name: this.getFileName(file.path),
          type: nodeType,
          path: file.path,
          dependencies,
          dependents: this.findDependents(file.path, dependencyMap),
          size: file.size,
          complexity: this.calculateComplexity(file.content || '')
        })
      }
    })

    return nodes
  }

  private static determineNodeType(path: string, content: string): ArchitectureNode['type'] {
    const fileName = this.getFileName(path).toLowerCase()
    const dirName = this.getDirectoryName(path).toLowerCase()

    // Check patterns
    if (this.COMPONENT_PATTERNS.some(pattern => pattern.test(fileName) || pattern.test(dirName))) {
      return 'component'
    }
    
    if (this.SERVICE_PATTERNS.some(pattern => pattern.test(fileName) || pattern.test(dirName))) {
      return 'service'
    }
    
    if (this.PAGE_PATTERNS.some(pattern => pattern.test(fileName) || pattern.test(dirName))) {
      return 'page'
    }

    // Check content patterns
    if (content.includes('express') || content.includes('fastify') || content.includes('koa')) {
      return 'api'
    }
    
    if (content.includes('mongoose') || content.includes('sequelize') || content.includes('prisma')) {
      return 'database'
    }
    
    if (path.includes('config') || path.includes('env') || fileName.includes('config')) {
      return 'config'
    }

    return 'utility'
  }

  private static calculateComplexity(content: string): number {
    // Simple complexity calculation based on lines, functions, and conditions
    const lines = content.split('\n').length
    const functions = (content.match(/function|=>|class/g) || []).length
    const conditions = (content.match(/if|else|switch|case|while|for/g) || []).length
    
    return Math.round((lines * 0.1) + (functions * 2) + (conditions * 1.5))
  }

  private static findDependents(filePath: string, dependencyMap: DependencyMap): string[] {
    const dependents: string[] = []
    
    Object.entries(dependencyMap).forEach(([path, deps]) => {
      if (deps.dependencies.some(dep => dep.includes(this.getFileName(filePath)))) {
        dependents.push(path)
      }
    })
    
    return dependents
  }

  private static buildFileTree(files: ProjectFile[]): ProjectFile[] {
    const tree: ProjectFile[] = []
    const pathMap = new Map<string, ProjectFile>()

    // Create all nodes
    files.forEach(file => {
      pathMap.set(file.path, { ...file, children: [] })
    })

    // Build tree structure
    files.forEach(file => {
      const pathParts = file.path.split('/')
      if (pathParts.length === 1) {
        tree.push(pathMap.get(file.path)!)
      } else {
        const parentPath = pathParts.slice(0, -1).join('/')
        const parent = pathMap.get(parentPath)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(pathMap.get(file.path)!)
        } else {
          // If parent doesn't exist, add to root
          tree.push(pathMap.get(file.path)!)
        }
      }
    })

    return tree
  }

  private static calculateStatistics(files: ProjectFile[]): ProjectStatistics {
    const stats: ProjectStatistics = {
      totalFiles: 0,
      totalLines: 0,
      totalSize: 0,
      fileTypes: {},
      languages: {},
      dependencies: 0,
      components: 0,
      services: 0,
      pages: 0
    }

    files.forEach(file => {
      if (file.type === 'file') {
        stats.totalFiles++
        stats.totalSize += file.size
        
        if (file.extension) {
          stats.fileTypes[file.extension] = (stats.fileTypes[file.extension] || 0) + 1
        }

        if (file.content) {
          stats.totalLines += file.content.split('\n').length
          
          const language = this.getLanguageFromExtension(file.extension || '')
          if (language) {
            stats.languages[language] = (stats.languages[language] || 0) + 1
          }
        }

        // Count architecture types
        const nodeType = this.determineNodeType(file.path, file.content || '')
        if (nodeType === 'component') stats.components++
        if (nodeType === 'service') stats.services++
        if (nodeType === 'page') stats.pages++
      }
    })

    return stats
  }

  private static getLanguageFromExtension(extension: string): string {
    const languageMap: { [key: string]: string } = {
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.py': 'Python',
      '.java': 'Java',
      '.cs': 'C#',
      '.cpp': 'C++',
      '.c': 'C',
      '.php': 'PHP',
      '.rb': 'Ruby',
      '.go': 'Go',
      '.rs': 'Rust',
      '.swift': 'Swift',
      '.kt': 'Kotlin',
      '.html': 'HTML',
      '.css': 'CSS',
      '.scss': 'SCSS',
      '.sass': 'Sass',
      '.less': 'Less',
      '.json': 'JSON',
      '.yaml': 'YAML',
      '.yml': 'YAML',
      '.xml': 'XML',
      '.md': 'Markdown'
    }
    
    return languageMap[extension] || 'Unknown'
  }

  private static isSupportedFile(path: string): boolean {
    const extension = this.getFileExtension(path)
    return this.SUPPORTED_EXTENSIONS.includes(extension) || extension === ''
  }

  private static isCodeFile(path: string): boolean {
    const extension = this.getFileExtension(path)
    return ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cs', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt'].includes(extension)
  }

  private static getFileExtension(path: string): string {
    const lastDot = path.lastIndexOf('.')
    return lastDot !== -1 ? path.substring(lastDot) : ''
  }

  private static getFileName(path: string): string {
    return path.split('/').pop() || path
  }

  private static getDirectoryName(path: string): string {
    const parts = path.split('/')
    return parts.length > 1 ? parts[parts.length - 2] : ''
  }



  private static extractProjectName(files: FileList): string {
    if (files.length > 0) {
      const firstFile = files[0]
      const webkitPath = firstFile.webkitRelativePath
      if (webkitPath) {
        return webkitPath.split('/')[0]
      }
    }
    return 'Untitled Project'
  }
}
