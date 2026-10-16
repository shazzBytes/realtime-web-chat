const assert = {
  equal(actual, expected, message) {
    global.expect(actual, message).toBe(expected);
  },
  deepEqual(actual, expected, message) {
    global.expect(actual, message).toStrictEqual(expected);
  },
  ok(value, message) {
    global.expect(value, message).toBeTruthy();
  },
  match(value, pattern, message) {
    global.expect(value, message).toMatch(pattern);
  },
};

module.exports = assert;
