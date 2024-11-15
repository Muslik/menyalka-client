import path from 'node:path';

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath));
    const exportName = `Icon${/^\d/.test(basename) ? `_${basename}` : basename}`;

    return `export { default as ${exportName} } from './${basename}'`;
  });

  return exportEntries.join('\n');
}
export default defaultIndexTemplate;
