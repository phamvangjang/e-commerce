const { test, findMax, expect } = require("../controllers/user");

test('findMax', () => {
    expect(findMax([1, 2, 4, 3])).toBe(4);
})
