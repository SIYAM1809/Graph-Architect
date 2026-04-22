import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Node } from 'reactflow';
import { NodeData } from '../store/useCanvasStore';

export const generateProjectZip = async (nodes: Node<NodeData>[]) => {
  const zip = new JSZip();

  // Create folder structure
  const clientFolder = zip.folder('client');
  const clientSrcFolder = clientFolder?.folder('src');
  
  const serverFolder = zip.folder('server');
  const serverRoutesFolder = serverFolder?.folder('routes');

  const databaseFolder = zip.folder('database');

  // Basic package.json files to make it realistic
  clientFolder?.file('package.json', JSON.stringify({
    name: "dev-sync-client",
    version: "1.0.0",
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  }, null, 2));

  serverFolder?.file('package.json', JSON.stringify({
    name: "dev-sync-server",
    version: "1.0.0",
    dependencies: {
      "express": "^4.18.2",
      "cors": "^2.8.5"
    }
  }, null, 2));

  zip.file('README.md', '# Dev-Sync Export\n\nThis project was visually compiled using Dev-Sync.');

  // Iterate over nodes and place code
  nodes.forEach((node) => {
    const label = node.data.label.toLowerCase();
    const code = node.data.code || '// Empty block';

    if (label === 'client') {
      clientSrcFolder?.file('App.js', code);
    } else if (label === 'server') {
      serverFolder?.file('index.js', code);
    } else if (label === 'database') {
      databaseFolder?.file('schema.js', code);
    } else if (label === 'api') {
      serverRoutesFolder?.file('api.js', code);
    } else {
      // Custom nodes go to root
      zip.file(`${node.data.label.replace(/\\s+/g, '_')}.js`, code);
    }
  });

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'dev-sync-project.zip');
};
