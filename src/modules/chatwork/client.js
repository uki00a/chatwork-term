import axios from 'axios';
import {
  roomFromJSON,
  messageFromJSON
} from './mappers';

class ChatworkClient {
  constructor(accessToken) {
    this._axios = axios.create({
      baseURL: 'https://api.chatwork.com/v2',
      headers: {
        'X-ChatWorkToken': accessToken
      }
    });
  }

  listRooms() {
    return this._callAPI('/rooms', roomFromJSON);
  }

  listMessagesInRoom(roomId) {
    return this._callAPI(`/rooms/${roomId}/messages`, messageFromJSON, {
      params: { force: 1 }
    }).then(removeInvalidMessages);
  }

  getMessageById(id, roomId) {
    return this._callAPI(`/rooms/${roomId}/message/${id}`, messageFromJSON);
  }

  addMessageToRoom(body, roomId) {
    return this._callAPI(`/rooms/${roomId}/messages`, x => x.message_id, {
      data: { body }
    });
  }

  _callAPI(path, responseMapper, options = {}) {
    return this._axios.request({
      url: path,
      ...options
    })
      .then(response => {
        if (Array.isArray(response.data)) {
          return response.data.map(responseMapper);
        } else {
          return responseMapper(response.data);
        }
      });
  }
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
