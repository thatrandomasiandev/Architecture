import { ProjectAnalysis } from './projectAnalyzer'

export function createTestProject(): ProjectAnalysis {
  return {
    name: 'Test Project',
    rootPath: '/',
    files: [
      {
        path: 'src',
        name: 'src',
        type: 'directory',
        size: 0,
        children: [
          {
            path: 'src/components',
            name: 'components',
            type: 'directory',
            size: 0,
            children: [
              {
                path: 'src/components/Button.tsx',
                name: 'Button.tsx',
                type: 'file',
                extension: '.tsx',
                size: 1024,
                content: 'export const Button = () => <button>Click me</button>'
              }
            ]
          },
          {
            path: 'src/pages',
            name: 'pages',
            type: 'directory',
            size: 0,
            children: [
              {
                path: 'src/pages/Home.tsx',
                name: 'Home.tsx',
                type: 'file',
                extension: '.tsx',
                size: 2048,
                content: 'export const Home = () => <div>Welcome</div>'
              }
            ]
          }
        ]
      }
    ],
    dependencies: {
      'src/components/Button.tsx': {
        imports: ['react'],
        exports: ['Button'],
        dependencies: ['react']
      },
      'src/pages/Home.tsx': {
        imports: ['react', './components/Button'],
        exports: ['Home'],
        dependencies: ['react', './components/Button']
      }
    },
    architecture: [
      {
        id: 'src/components/Button.tsx',
        name: 'Button',
        type: 'component',
        path: 'src/components/Button.tsx',
        dependencies: ['react'],
        dependents: ['src/pages/Home.tsx'],
        size: 1024,
        complexity: 5
      },
      {
        id: 'src/pages/Home.tsx',
        name: 'Home',
        type: 'page',
        path: 'src/pages/Home.tsx',
        dependencies: ['react', './components/Button'],
        dependents: [],
        size: 2048,
        complexity: 8
      }
    ],
    statistics: {
      totalFiles: 2,
      totalLines: 50,
      totalSize: 3072,
      fileTypes: { '.tsx': 2 },
      languages: { 'TypeScript': 2 },
      dependencies: 2,
      components: 1,
      services: 0,
      pages: 1
    }
  }
}
