/* Guest dashboard mock unit test

Usage:
  node test/unit/frontendDashboardController.guest.test.js
*/

const assert = require('assert');
const FrontendDashboardController = require('../../app/controllers/FrontendDashboardController');

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
    identity: {
      _id: 'guest-user-000',
      firstName: 'Guest',
      fullName: 'Bookaroo Guest',
      role: 'guest',
      isGuest: true,
    },
    isGuest: true,
    query: { period: 'week' },
    method: 'GET',
    originalUrl: '/dashboard/overview?guest=true',
  };

  const res = createResponseStub();

  await FrontendDashboardController.getOverview(req, res);

  assert.strictEqual(res.statusCode, 200, 'Expected status 200');
  assert.strictEqual(res.body?.success, true, 'Expected success true');
  assert.ok(res.body?.data, 'Expected data payload');

  const sections = res.body.data.sections;
  const requiredSections = [
    'todoList',
    'propertyAttractivity',
    'savedSearchResults',
    'followedPropertyNews',
    'pastTransactions',
    'p2pEstimation',
    'p2pReport',
    'trainingCenter',
    'propertySearchPipeline',
    'ownerPipeline',
  ];

  requiredSections.forEach((sectionKey) => {
    assert.ok(sections[sectionKey], `Missing section ${sectionKey}`);
  });

  assert.strictEqual(sections.todoList._isMock, true, 'Expected todoList to be mocked');
  assert.strictEqual(sections.propertyAttractivity._isMock, true, 'Expected propertyAttractivity to be mocked');
  assert.ok(Array.isArray(sections.todoList.items) && sections.todoList.items.length > 0, 'Expected guest todoList items');
  assert.ok(Array.isArray(sections.propertyAttractivity.cards) && sections.propertyAttractivity.cards.length > 0, 'Expected guest propertyAttractivity cards');

  console.log('Guest dashboard mock unit test passed');
}

run().catch((err) => {
  console.error('Guest dashboard mock unit test failed');
  console.error(err);
  process.exitCode = 1;
});
