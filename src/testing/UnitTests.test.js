import {expect, jest, test} from '@jest/globals';
import {isValidPositiveInteger} from '../Pages/Home.js'
test('Characters in number of questions', () => {
    expect(isValidPositiveInteger("ff")).toBe(false);
});

test('Negative number of questions', () => {
    expect(isValidPositiveInteger("-5")).toBe(false);
});

test('Non whole number of questions', () => {
    expect(isValidPositiveInteger("2.5")).toBe(false);
})

test('Valid Number of questions', () => {
    expect(isValidPositiveInteger("5")).toBe(true);
});