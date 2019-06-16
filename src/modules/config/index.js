import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import xdgBaseDir from 'xdg-basedir';
import makeDir from 'make-dir';

/**
 * @typedef {object} Settings
 * @prop {string} accessToken
 * @prop {'dark'|'dark-blue'|'light'} theme
 * @prop {number} [pollingInterval]
 * @prop {bool} [enablePolling]
 */

const SETTINGS_JSON = 'settings.json';
const MINIMUM_POLLING_INTERVAL = 2; // 2 seconds

/**
 * @type {Settings}
 */
const defaultSettings = Object.freeze({
  accessToken: null,
  enablePolling: true,
  theme: 'dark'
});

// TODO improve error handling
export async function readOrCreateSettings() {
  try {
    const settings = await readSettings();
    validateSettings(settings);
    return settings;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return await createSettings();
  }
}

/**
 * @param {Settings} settings
 */
function validateSettings(settings) {
  if (settings == null) {
    throw new Error('settings.json must contain an object');
  }

  if (!settings.accessToken) {
    throw new Error('settings.json: accessToken is required.');
  }

  if (typeof settings.pollingInterval === 'number' && settings.pollingInterval < MINIMUM_POLLING_INTERVAL) {
    throw new Error(`settings.json: pollingInterval must be greather than or equal to ${MINIMUM_POLLING_INTERVAL}`);
  }
}

/**
 * @returns {Promise<Settings>}
 */
function readSettings() {
  return readJSONFile(buildConfigPath(SETTINGS_JSON));
}

/**
 * @param {Settings} settings
 */
function writeSettings(settings) {
  return writeJSONFile(buildConfigPath(SETTINGS_JSON), settings);
}

/**
 * @returns {Settings}
 */
async function createSettings() {
  const accessToken = await promptAccessToken();
  const settings = mergeSettings({ accessToken });
  validateSettings(settings);
  await ensureConfigDirectory();
  await writeSettings(settings);
  return settings;
}

/**
 * @param {Settings} settings 
 * @returns {Settings}
 */
function mergeSettings(settings) {
  return {
    ...defaultSettings,
    ...settings
  };
}

function promptAccessToken() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Please input access token>', answer => {      
      rl.close();
      resolve(answer);
    });
  });
}

function ensureConfigDirectory() {
  return makeDir(configDirectory());
}

function buildConfigPath(fileName) {
  return path.join(configDirectory(), fileName);
}

function configDirectory() {
  return path.join(xdgBaseDir.config, 'chatwork-term');
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

function writeJSONFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), error => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
}