import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ASSETS_DIR = 'src/shared/assets';
const ICON_COMPONENTS_DIR = 'src/shared/ui/icons';
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const PAGE_PATH = path.join(ICONS_DIR, 'index.html');

// replace - and _ with camelCase
const camelCase = (str) => str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

function parseSize(svgFileName) {
  const nameWithoutExtension = path.basename(svgFileName, '.svg');
  const sizePart = nameWithoutExtension.split('_').pop();

  const [width, height] = sizePart.includes('x')
    ? sizePart.split('x').map(Number)
    : [Number(sizePart), Number(sizePart)];

  return { width, height };
}

// Функция для генерации импортов из svgr файлов в index.ts

async function generateImports() {
  // get all files in the directory
  const files = await readdir(ICONS_DIR);
  // filter for .svg files
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  // validate it has proper size on the name

  for (const file of svgFiles) {
    const { width, height } = parseSize(file);
    if (Number.isNaN(width) || Number.isNaN(height) || width === 0 || height === 0) {
      throw new Error(`Invalid size in file name: ${file}`);
    }
  }

  try {
    await rm(ICON_COMPONENTS_DIR, { recursive: true });
    await mkdir(ICON_COMPONENTS_DIR);
  } catch (err) {
    console.error(err);
  }

  for (const file of svgFiles) {
    const fileName = file.replace('.svg', ''); // aeroexpress_100
    const componentName = `Icon${camelCase(fileName).replace(/^\w/, (c) => c.toUpperCase())}`; // IconAeroexpress100

    await mkdir(`${ICON_COMPONENTS_DIR}/${componentName}`);
    await writeFile(
      `${ICON_COMPONENTS_DIR}/${componentName}/index.ts`,
      `export { default as ${componentName} } from '../../../assets/icons/${file}?react';\n`,
    );
  }

  const svgFilesWithSize = svgFiles
    .map((file) => ({
      fileName: file,
      size: parseSize(file),
    }))
    .sort((a, b) => {
      if (a.size.width === b.size.width) {
        return a.size.height - b.size.height;
      }

      return a.size.width - b.size.width;
    });

  const svgHtml = await Promise.all(
    svgFilesWithSize.map(async ({ fileName, size }) => {
      const svgPath = path.join(ICONS_DIR, fileName);
      const svgContent = await readFile(svgPath, 'utf8');
      const iconName = path.basename(fileName, '.svg');
      console.log(svgPath, iconName);

      return `
        <div class="svg-icon">
          <p>${iconName} (${size.width}x${size.height})</p>
          <div style="width: ${size.width}px; height: ${size.height}px;">
            ${svgContent.replace('<svg', `<svg width="${size.width}" height="${size.height}"`)}
          </div>
        </div>
      `;
    }),
  ).then((htmls) => htmls.join('\n'));

  let indexContent = await readFile(PAGE_PATH, 'utf8');

  const updatedIndexContent = indexContent.replace(
    /<!-- SVG ICONS START -->[\s\S]*<!-- SVG ICONS END -->/,
    `<!-- SVG ICONS START -->\n${svgHtml}\n<!-- SVG ICONS END -->`,
  );

  await writeFile(PAGE_PATH, updatedIndexContent, 'utf8');
}

generateImports();
