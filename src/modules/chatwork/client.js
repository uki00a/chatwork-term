import assert from 'assert';
import axios from 'axios';
import {
  roomFromJSON,
  messageFromJSON,
  accountFromJSON
} from './mappers';
import { URLSearchParams } from 'url';

class ChatworkClient {
  constructor(accessToken) {
    this._axios = axios.create({
      baseURL: 'https://api.chatwork.com/v2',
      headers: {
        'X-ChatWorkToken': accessToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  getMe() {
    return this._callAPI('/me', accountFromJSON);
  }

  listRooms() {
    return this._callAPI('/rooms', roomFromJSON);
  }

  listMessagesInRoom(roomId) {
    assert(roomId);
    return this._callAPI(`/rooms/${roomId}/messages`, messageFromJSON, {
      params: { force: 1 }
    }).then(removeInvalidMessages);
  }

  getMessageById(id, roomId) {
    return this._callAPI(`/rooms/${roomId}/messages/${id}`, messageFromJSON);
  }

  addMessageToRoom(body, roomId) {
    assert(roomId);
    return this._callAPI(`/rooms/${roomId}/messages`, x => x.message_id, {
      method: 'POST',
      data: toURLSearchParams({ body })
    });
  }

  updateMessage({ id, roomId, body = '' }) {
    return this._callAPI(`/rooms/${roomId}/messages/${id}`, x => x.message_id, {
      method: 'PUT',
      data: toURLSearchParams({ body })
    });
  }

  async _callAPI(path, responseMapper, options = {}) {
    const response = await this._axios.request({
      url: path,
      ...options
    });

    if (Array.isArray(response.data)) {
      return response.data.map(responseMapper);
    } else {
      return responseMapper(response.data);
    }
  }
}

function toURLSearchParams(object) {
  return Object.keys(object).reduce((params, key) => {
    params.append(key, object[key]);
    return params;
  }, new URLSearchParams());
}

function removeInvalidMessages(messages) {
  return messages.filter(isValidMessage);
}

function isValidMessage(message) {
  return message.body !== '[deleted]';
}

export default function createChatworkClient({
  accessToken
}) {
  return new ChatworkClient(accessToken);
}
