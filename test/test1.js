// Use ES module import syntax
import { assert } from 'chai';


const assert = require('chai').assert;

describe('Extension Tests', function() {
    it('Sample Test', function() {
        assert.equal([1, 2, 3].indexOf(2), 1);
    });
});
