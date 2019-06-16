export function canEditMessage(account, message) {
  return account.id === message.account.id;
}