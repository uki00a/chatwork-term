import assert from 'assert';
import { useEffect } from 'rax';

/**
 * @typedef {import('../modules/config').Settings} Settings
 */

/**
 * @param {Settings} settings
 * @param {Function} callback
 */
export function usePolling(settings, callback) {
  assert(settings);

  useEffect(() => {
    if (settings.enablePolling !== true) {
      return;
    }

    const timer = setInterval(() => {
      callback();
    }, computePollingInterval(settings));

    return () => {
      clearInterval(timer);
    };
  }, [settings, callback]);
}

function computePollingInterval(settings) {
  const pollingInterval = settings.pollingInterval || DEFAULT_POLLING_INTERVAL;
  return pollingInterval * 1000;
}

const DEFAULT_POLLING_INTERVAL = 60; // 1 minute