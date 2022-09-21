import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, sep, posix } from 'node:path';

const SYSTEM_OR_MODULE = 'system';
const ROOT_ID = JSON.parse(readFileSync('./static/system.json')).id;

const getPaths = (path, ext) => {
  const paths = [];
  const files = readdirSync(path);
  files.forEach(file => {
    const filePath = join(path, file);
    if (statSync(filePath).isDirectory()) {
      paths.push(...getPaths(filePath, ext));
    }
    else if (!ext || file.endsWith(ext)) {
      paths.push(filePath);
    }
  });
  return paths;
};

export default (() =>
  getPaths('./src', '.hbs')
    .map(templatePath => {
      templatePath = templatePath.split(sep).slice(1).join(posix.sep).replace('templates/', '');
      return `${SYSTEM_OR_MODULE}s/${ROOT_ID}/templates/${templatePath}`;
    })
)();
