import * as fs from 'fs';
import * as path from 'path';
import xdgBaseDir from 'xdg-basedir';

/**
 * @typedef {object} Settings
 * @prop {string} accessToken
 * @prop {'dark'|'dark-blue'|'light'} theme
 */

// TODO improve error handling
/**
 * @returns {Promise<Settings>}
 */
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
