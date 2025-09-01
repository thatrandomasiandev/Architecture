# Architecture Visualizer

A comprehensive companion website for visualizing software architecture and code structure. This tool provides interactive diagrams, code analysis, and automated documentation generation to help software engineers understand and document their projects.

## 🚀 Features

- **Interactive Architecture Diagrams**: Visualize system components and their relationships with D3.js-powered interactive diagrams
- **Code Structure Analysis**: Explore project file organization, dependencies, and statistics
- **Real-time Documentation**: Create and manage comprehensive project documentation with Markdown support
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS for a clean, professional interface
- **Export Capabilities**: Export diagrams and documentation in various formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Visualization**: D3.js, Dagre
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Code Editor**: Monaco Editor

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/thatrandomasiandev/Architecture.git
cd Architecture
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── ArchitectureView.tsx  # Architecture diagrams
│   ├── CodeStructure.tsx     # Code structure analysis
│   └── Documentation.tsx     # Documentation management
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🎯 Usage

### Dashboard
- Overview of your project's architecture components
- Quick access to all features
- Recent activity tracking

### Architecture View
- Interactive system architecture diagrams
- Zoom, pan, and filter capabilities
- Component status indicators
- Export functionality

### Code Structure
- File tree visualization
- Search and filter capabilities
- File statistics and details
- Dependency analysis

### Documentation
- Create and edit documentation sections
- Markdown support
- Tag-based organization
- Export capabilities

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Features

1. Create new components in the `src/components/` directory
2. Add new pages in the `src/pages/` directory
3. Update the routing in `src/App.tsx`
4. Add navigation items in `src/components/Layout.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

### Docker

1. Build the Docker image:
```bash
docker build -t architecture-visualizer .
```

2. Run the container:
```bash
docker run -p 3000:3000 architecture-visualizer
```

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Joshua Terranova** - Software Engineer
- GitHub: [@thatrandomasiandev](https://github.com/thatrandomasiandev)

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) for powerful data visualization
- [React](https://reactjs.org/) for the component-based architecture
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📈 Roadmap

- [ ] Real-time code analysis integration
- [ ] Multiple diagram types (sequence, class, deployment)
- [ ] Team collaboration features
- [ ] API integration for live project data
- [ ] Plugin system for custom visualizations
- [ ] Advanced export options (PDF, SVG, PNG)
- [ ] Version control integration
- [ ] Automated documentation generation

---

**Built with ❤️ for the software engineering community**
