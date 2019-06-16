import assert from 'assert';
import * as actions from './actions';

/**
 * @typedef {ReturnType<import('../../modules/chatwork/client').default>} ChatworkClient
 * @typedef {import('../../modules/config').Settings} Settings
 */

const DEFAULT_POLLING_INTERVAL = 60; // 1 minute
const MINIMUM_POLLING_INTERVAL = 2; // 2 seconds

/**
 * @param {object} param0
 * @param {Settings} param0.settings
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {number} param0.targetRoomId
 */
export function startPolling({
  settings,
  client,
  dispatch,
  targetRoomId
}) {
  assert(settings.enablePolling === true);
  const pollingInterval = computePollingInterval(settings);
  const poller = new Poller({
    client,
    dispatch,
    targetRoomId,
    pollingInterval
  });
  const stopPolling = () => poller.stop();
  poller.start();
  return stopPolling;
}

/**
 * @param {import('../../modules/config').Settings} settings 
 * @returns {number}
 */
function computePollingInterval(settings) {
  const pollingInterval = settings.pollingInterval || DEFAULT_POLLING_INTERVAL;
  if (pollingInterval < MINIMUM_POLLING_INTERVAL) {
    throw new Error(`settings.pollingInterval must be greather than or equal to ${MINIMUM_POLLING_INTERVAL}`);
  }
  return pollingInterval * 1000;
}

class Poller {
  /**
   * @param {object} param0
   * @param {ChatworkClient} param0.client
   * @param {Function} param0.dispatch
   * @param {number} param0.targetRoomId
   * @param {number} param0.pollingInterval
   */
  constructor({ client, dispatch, targetRoomId, pollingInterval }) {
    this._client = client;
    this._dispatch = dispatch;
    this._targetRoomId = targetRoomId;
    this._pollingInterval = pollingInterval;

    this._isRunning = false;
    this._timer = null;
  }

  start() {
    assert(this._timer == null);

    const pollingCallback = this._createPollingCallback();
    this._timer = setInterval(pollingCallback, this._pollingInterval);
    this._wasStopped = false;
  }

  stop() {
    assert(this._wasStopped === false);
    assert(this._timer != null);

    clearInterval(this._timer);
    this._timer = null;
    this._wasStopped = true;
  }

  _createPollingCallback() {
    const pollingCallback = async () => {
      if (this._isRunning) {
        return;
      }

      this._isRunning = true;
      try {
        await this._checkAndApplyUpdate();
      } finally {
        this._isRunning = false;
      }
    }
    return pollingCallback;
  }

  // TODO refactor
  async _checkAndApplyUpdate() {
    const rooms = await this._client.listRooms();
    const updatedRooms = rooms.filter(x => x.unreadNum > 0);

    if (updatedRooms.length > 0) {
      this._dispatch(actions.listRoomsSuccess(rooms));
    }

    if (this._wasStopped) {
      return;
    }

    const messages = await this._client.listMessagesInRoom(this._targetRoomId);

    if (this._wasStopped) {
      return;
    }

    this._dispatch(actions.listMessagesSuccess(messages));
  }
}