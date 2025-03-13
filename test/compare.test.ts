import { describe, expect, it } from 'vitest';
import { compare } from '../src/index';

describe('compare', () => {
  it('throws an error with an invalid operator', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing an invalid operator
      compare('1.0.0', '2.0.0', '?');
    }).toThrow('Unsupported operator for comparison');
  });

  it('throws an error with undefined versions', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing undefined
      compare(undefined, '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      // @ts-expect-error - Deliberately passing undefined
      compare('1.0.0', undefined, '>');
    }).toThrow('Invalid version format');
  });

  it('throws an error with null versions', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing null
      compare(null, '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      // @ts-expect-error - Deliberately passing null
      compare('1.0.0', null, '>');
    }).toThrow('Invalid version format');
  });

  it('throws an error with invalid version formats', () => {
    expect(() => {
      compare('not.a.version', '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      compare('1.0.0', 'invalid-version', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      compare('1.0.0.a', '2.0.0', '>');
    }).toThrow('Invalid version format');
  });

  it('correctly compares with default operator', () => {
    expect(compare('2.0.0', '1.0.0')).toBe(true);
    expect(compare('1.1.0', '1.0.0')).toBe(true);
    expect(compare('1.0.0', '1.0.0')).toBe(false);
    expect(compare('0.9.0', '1.0.0')).toBe(false);
  });

  it('correctly compares with operator >', () => {
    expect(compare('2.0.0', '1.0.0', '>')).toBe(true);
    expect(compare('1.1.0', '1.0.0', '>')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '>')).toBe(false);
    expect(compare('0.9.0', '1.0.0', '>')).toBe(false);
  });

  it('correctly compares with operator >=', () => {
    expect(compare('2.0.0', '1.0.0', '>=')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '>=')).toBe(true);
    expect(compare('0.9.0', '1.0.0', '>=')).toBe(false);
  });

  it('compares versions with pre-releases', () => {
    expect(compare('1.0.0-alpha', '1.0.0', '<')).toBe(true);
    expect(compare('1.0.0-alpha', '1.0.0-beta', '<')).toBe(true);
    expect(compare('1.0.0-beta.11', '1.0.0-beta.2', '>')).toBe(true);
  });

  it('correctly compares with operator <', () => {
    expect(compare('1.0.0', '2.0.0', '<')).toBe(true);
    expect(compare('1.0.0', '1.1.0', '<')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '<')).toBe(false);
    expect(compare('1.0.0', '0.9.0', '<')).toBe(false);
  });

  it('correctly compares with operator <=', () => {
    expect(compare('1.0.0', '2.0.0', '<=')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '<=')).toBe(true);
    expect(compare('1.0.0', '0.9.0', '<=')).toBe(false);
  });

  it('correctly compares with operators = and ==', () => {
    expect(compare('1.0.0', '1.0.0', '=')).toBe(true);
    expect(compare('1.0.0', '1.0.1', '=')).toBe(false);
    expect(compare('1.0.0', '1.0.0', '==')).toBe(true);
    expect(compare('1.0.0', '1.0.1', '==')).toBe(false);
  });

  it('correctly compares with operators != and <>', () => {
    expect(compare('1.0.0', '1.0.1', '!=')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '!=')).toBe(false);
    expect(compare('1.0.0', '1.0.1', '<>')).toBe(true);
    expect(compare('1.0.0', '1.0.0', '<>')).toBe(false);
  });

  it('correctly compares with text operators gt and ge', () => {
    expect(compare('2.0.0', '1.0.0', 'gt')).toBe(true);
    expect(compare('1.0.0', '1.0.0', 'gt')).toBe(false);
    expect(compare('2.0.0', '1.0.0', 'ge')).toBe(true);
    expect(compare('1.0.0', '1.0.0', 'ge')).toBe(true);
    expect(compare('0.9.0', '1.0.0', 'ge')).toBe(false);
  });

  it('correctly compares with text operators lt and le', () => {
    expect(compare('1.0.0', '2.0.0', 'lt')).toBe(true);
    expect(compare('1.0.0', '1.0.0', 'lt')).toBe(false);
    expect(compare('1.0.0', '2.0.0', 'le')).toBe(true);
    expect(compare('1.0.0', '1.0.0', 'le')).toBe(true);
    expect(compare('2.0.0', '1.0.0', 'le')).toBe(false);
  });

  it('correctly compares with text operators eq and ne', () => {
    expect(compare('1.0.0', '1.0.0', 'eq')).toBe(true);
    expect(compare('1.0.0', '1.0.1', 'eq')).toBe(false);
    expect(compare('1.0.0', '1.0.1', 'ne')).toBe(true);
    expect(compare('1.0.0', '1.0.0', 'ne')).toBe(false);
  });

  it('handles different version number formats', () => {
    expect(compare('1.0', '1.0.0', '=')).toBe(true);
    expect(compare('1', '1.0.0', '=')).toBe(true);
    expect(compare('1.0.0.0', '1.0.0', '=')).toBe(true);
    expect(compare('1.0.0-rc.1', '1.0.0-rc.1', '=')).toBe(true);
  });

  it('compares numeric versions correctly', () => {
    expect(compare(2, 1, '>')).toBe(true);
    expect(compare(1.1, 1.0, '>')).toBe(true);
    expect(compare(1, 1, '>=')).toBe(true);
    expect(compare(1.0, 2.0, '<')).toBe(true);
  });

  it('compares mixed type versions correctly', () => {
    expect(compare('2.0.0', 1, '>')).toBe(true);
    expect(compare(1, '1.0.0', '=')).toBe(true);
    expect(compare(1.5, '1.5.0', '==')).toBe(true);
    expect(compare('2.0', 2.5, '<')).toBe(true);
  });
});
