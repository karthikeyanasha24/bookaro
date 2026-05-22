/* Guest chat mock unit test

Usage:
  node test/unit/chatController.guest.test.js
*/

const assert = require('assert');
const ChatController = require('../../app/controllers/ChatController');

function createResponseStub() {
  let statusCode = 200;
  let payload = null;

  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get body() {
      return payload;
    },
  };
}

async function run() {
  const req = {
    query: { guest: 'true', room_id: 'guest-room-1', property_id: 'guest-prop-1' },
    headers: { 'x-guest-mode': 'true' },
    isGuest: true,
    method: 'GET',
    originalUrl: '/chat/messages?guest=true',
  };

  const res = createResponseStub();
  await ChatController.getAllMessages(req, res);
  assert.strictEqual(res.statusCode, 200, 'Expected status 200 for messages endpoint');
  assert.strictEqual(res.body?.success, true, 'Expected success true for messages endpoint');
  assert.ok(Array.isArray(res.body?.data?.data), 'Expected data array for messages endpoint');
  assert.strictEqual(res.body?.data?.total, 3, 'Expected 3 guest messages');
  assert.strictEqual(res.body?.data?.data[0]?.sender_name, 'Alexandre Immotopia', 'Expected first message sender to be guest agent');

  const res2 = createResponseStub();
  await ChatController.getAllRecentChats(req, res2);
  assert.strictEqual(res2.statusCode, 200, 'Expected status 200 for recent chats endpoint');
  assert.strictEqual(res2.body?.success, true, 'Expected success true for recent chats endpoint');
  assert.ok(Array.isArray(res2.body?.data?.data), 'Expected data array for recent chats endpoint');
  assert.strictEqual(res2.body?.data?.total, 1, 'Expected 1 guest recent chat');
  assert.strictEqual(res2.body?.data?.data[0]?.property_details?.name, 'Maison familiale', 'Expected guest recent chat property name');

  const resRoomMembers = createResponseStub();
  await ChatController.getAllRoomMembers(req, resRoomMembers);
  assert.strictEqual(resRoomMembers.statusCode, 200, 'Expected status 200 for room members endpoint');
  assert.strictEqual(resRoomMembers.body?.success, true, 'Expected success true for room members endpoint');
  assert.ok(Array.isArray(resRoomMembers.body?.data?.data), 'Expected data array for room members endpoint');
  assert.strictEqual(resRoomMembers.body?.data?.total, 2, 'Expected 2 guest room members');
  assert.strictEqual(resRoomMembers.body?.data?.data[0]?.user_details?.fullName, 'Alexandre Immotopia', 'Expected guest room member name');

  const res3 = createResponseStub();
  await ChatController.getAllPropertyChats(req, res3);
  assert.strictEqual(res3.statusCode, 200, 'Expected status 200 for property chats endpoint');
  assert.strictEqual(res3.body?.success, true, 'Expected success true for property chats endpoint');
  assert.ok(Array.isArray(res3.body?.data?.data), 'Expected data array for property chats endpoint');
  assert.strictEqual(res3.body?.data?.total, 1, 'Expected 1 guest property chat');
  assert.strictEqual(res3.body?.data?.data[0]?.property_name, 'Maison familiale', 'Expected guest property chat property name');

  const res4 = createResponseStub();
  await ChatController.debugGuestFull(req, res4);
  assert.strictEqual(res4.statusCode, 200, 'Expected status 200 for debug-full endpoint');
  assert.strictEqual(res4.body?.success, true, 'Expected success true for debug-full endpoint');
  assert.strictEqual(res4.body?.data?.responses?.messages?.total, 3, 'Expected 3 guest messages in debug-full endpoint');
  assert.strictEqual(res4.body?.data?.responses?.recent_chats?.total, 1, 'Expected 1 guest recent chat in debug-full endpoint');
  assert.strictEqual(res4.body?.data?.responses?.room_members?.total, 2, 'Expected 2 guest room members in debug-full endpoint');
  assert.strictEqual(res4.body?.data?.responses?.property_chats?.total, 1, 'Expected 1 guest property chat in debug-full endpoint');

  console.log('Guest chat mock unit test passed');
}

run().catch((err) => {
  console.error('Guest chat mock unit test failed');
  console.error(err);
  process.exitCode = 1;
});
