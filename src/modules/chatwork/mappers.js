export const roomFromJSON = json => ({
  id: json.room_id,
  name: json.name,
  unreadNum: json.unread_num
});

export const messageFromJSON = json => ({
  id: json.message_id,
  body: json.body,
  sendTime: new Date(unixTimeToJSTime(json.send_time)),
  account: accountFromJSON(json.account)
});

const accountFromJSON = json => ({
  id: json.account_id,
  name: json.name
});

const unixTimeToJSTime = unixTime => unixTime * 1000;
