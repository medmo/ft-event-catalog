import path from 'path';
import fs from 'fs';

const localpath = '/Users/medmo/dev/francetravail/ft-event-catalog/'
console.log('Workdir ',localpath);

const createGenerators = (schemaFolder = 'asyncapi-files') => {
  const basePath = path.join(localpath, schemaFolder);
  const getSchemasFromSubfolders = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getSchemasFromSubfolders(entryPath);
      }
      if (entry.isFile() && entry.name.endsWith('.yml')) {
        return entryPath;
      }
      return [];
    });
  };

  const schemas = getSchemasFromSubfolders(basePath);

  if (!schemas.length) return []; // Si aucun schéma trouvé, retourner un tableau vide

  return schemas.map((schemaPath) => {
    console.log("path",schemaPath);
    const relativePath = path.relative(basePath, schemaPath);
    console.log("relative paht", relativePath)
    const domainName = relativePath.split(path.sep)[0];
    console.log("domaine", domainName);
    const serviceName = relativePath.split(path.sep)[1].match(/^(.*?)(?:-service|\.yml)/)[1];
    console.log("service", serviceName);
    return [
      '@eventcatalog/generator-asyncapi',
      {
        services: [
          { path: schemaPath, id: "Diagnostics"}
        ],
        domain: { id: domainName, name: domainName, version: serviceName },

        // Run in debug mode, for extra output, if your AsyncAPI fails to parse, it will tell you why
        debug: true,
      },
    ];
  });
};
/** @type {import('@eventcatalog/core/bin/eventcatalog.config').Config} */

export default {
  title: 'France Travail Event catalog',
  tagline: 'Discover, Explore and Document your Event Driven Architectures',
  organizationName: 'France Travail event catalog',
  homepageLink: 'https://eventcatalog.dev/',
  editUrl: 'https://github.com/boyney123/eventcatalog-demo/edit/master',
  // By default set to false, add true to get urls ending in /
  trailingSlash: false,
  // Change to make the base url of the site different, by default https://{website}.com/docs,
  // changing to /company would be https://{website}.com/company/docs,
  base: '/',
  // Customize the logo, add your logo to public/ folder
  logo: {
    alt: 'France Travail logo',
    src: './logo.png',
    text: 'France Travail Event catalog'
  },
  // required random generated id used by eventcatalog
  cId: '948ed6a0-b103-4d75-b256-2ba09baf25d3',

  generators: createGenerators(),
}
