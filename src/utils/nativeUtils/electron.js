// @flow
import { clipboard } from 'electron';
import { exec as execCommand } from 'child_process';
import storage from 'electron-json-storage';
import fixPath from 'fix-path';
import os from 'os';
import path from 'path';

storage.setDataPath(path.join(os.homedir(), '.pants-control'));
fixPath();

export function copy(content: any) {
  clipboard.writeText(String(content));
}

export function notif(message: string) {
  const myNotification = new Notification('PantsControl', {
    body: message,
  });
  return myNotification;
}

export function exec(script: string): Promise<{ stdout: string[], stderr: string[] }> {
  return new Promise((resolve, reject) => {
    execCommand(script, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout: stdout.toString().split('\n'), stderr: stderr.toString().split('\n') });
      }
    });
  });
}

export function saveStorage(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) =>
    storage.set(key, value, error => {
      if (error) return reject(error);
      return resolve();
    }),
  );
}

export function loadStorage(key: string): Promise<string> {
  return new Promise((resolve, reject) =>
    storage.get(key, (error, data) => {
      if (error || !data || typeof data !== 'string') return reject(error);
      return resolve(data);
    }),
  );
}
