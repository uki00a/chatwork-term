import * as fs from 'fs';
import * as path from 'path';
import xdgBaseDir from 'xdg-basedir';

// TODO improve error handling
export function readSettings() {
  return readJSONFile(buildConfigPath('settings.json'));
}

function buildConfigPath(fileName) {
  return path.join(xdgBaseDir.config, 'chatwork-term', fileName);
}

function readJSONFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }

      try {
        return resolve(JSON.parse(data));
      } catch (error) {
        return reject(error);
      }
    })
  });
}
