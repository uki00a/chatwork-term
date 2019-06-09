import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function readSettings() {
  return new Promise((resolve, reject) => {
    // TODO read settings from `~/.config/chatwork-term/settings.json`
    const path2config = path.join(os.homedir(), '.chatwork-term.json');
    fs.readFile(path2config, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

