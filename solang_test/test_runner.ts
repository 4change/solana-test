import assert from "node:assert/strict";
import { describe, it, test } from "node:test";

test('synchronous passing test', (t) => {
    // This test passes because it does not throw an exception.
    assert.strictEqual(1, 1);
});

describe('A thing', () => {
    it('should work', () => {
        assert.strictEqual(1, 1);
    });

    it('should be ok', () => {
        assert.strictEqual(2, 2);
    });

    describe('a nested thing', () => {
        it('should work', () => {
            assert.strictEqual(3, 3);
        });
    });
}); 