import {expect, jest, test} from '@jest/globals';
import {verifyInputIsWholePositiveAndNumerical} from '../Home.js'
test('Characters in number of questions', () => {
    expect(verifyInputIsWholePositiveAndNumerical("ff")).toBe(false);
});

test('Negative number of questions', () => {
    expect(verifyInputIsWholePositiveAndNumerical("-5")).toBe(false);
});

test('Non whole number of questions', () => {
    expect(verifyInputIsWholePositiveAndNumerical("2.5")).toBe(false);
})

test('Valid Number of questions', () => {
    expect(verifyInputIsWholePositiveAndNumerical("5")).toBe(true);
});