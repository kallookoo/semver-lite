import { describe, expect, it } from 'vitest';
import { compareStrict } from '../src/index';

describe('compareStrict', () => {
  it('throws an error with an invalid operator', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing an invalid operator
      compareStrict('1.0.0', '2.0.0', '?');
    }).toThrow('Unsupported operator for comparison');
  });

  it('throws an error with undefined versions', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing undefined
      compareStrict(undefined, '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      // @ts-expect-error - Deliberately passing undefined
      compareStrict('1.0.0', undefined, '>');
    }).toThrow('Invalid version format');
  });

  it('throws an error with null versions', () => {
    expect(() => {
      // @ts-expect-error - Deliberately passing null
      compareStrict(null, '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      // @ts-expect-error - Deliberately passing null
      compareStrict('1.0.0', null, '>');
    }).toThrow('Invalid version format');
  });

  it('throws an error with invalid version formats', () => {
    expect(() => {
      compareStrict('not.a.version', '2.0.0', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      compareStrict('1.0.0', 'invalid-version', '>');
    }).toThrow('Invalid version format');

    expect(() => {
      compareStrict('1.0.0.a', '2.0.0', '>');
    }).toThrow('Invalid version format');
  });

  it('correctly compares with default operator', () => {
    expect(compareStrict('2.0.0', '1.0.0')).toBe(true);
    expect(compareStrict('1.1.0', '1.0.0')).toBe(true);
    expect(compareStrict('1.0.0', '1.0.0')).toBe(false);
    expect(compareStrict('0.9.0', '1.0.0')).toBe(false);
  });

  it('correctly compares metadata with > operator', () => {
    expect(compareStrict('1.0.0+beta', '1.0.0+alpha', '>')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '>')).toBe(false);
    expect(compareStrict('1.0.0+123', '1.0.0+111', '>')).toBe(true);
  });

  it('correctly compares with >= operator including metadata', () => {
    expect(compareStrict('1.0.0+beta', '1.0.0+alpha', '>=')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+alpha', '>=')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '>=')).toBe(false);
  });

  it('correctly compares with < operator including metadata', () => {
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '<')).toBe(true);
    expect(compareStrict('1.0.0+beta', '1.0.0+alpha', '<')).toBe(false);
    expect(compareStrict('1.0.0+001', '1.0.0+002', '<')).toBe(true);
  });

  it('correctly compares with <= operator including metadata', () => {
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '<=')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+alpha', '<=')).toBe(true);
    expect(compareStrict('1.0.0+beta', '1.0.0+alpha', '<=')).toBe(false);
  });

  it('correctly handles = operator with metadata', () => {
    expect(compareStrict('1.0.0+alpha', '1.0.0+alpha', '=')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '=')).toBe(false);
    expect(compareStrict('1.0.0', '1.0.0+build', '=')).toBe(false);
  });

  it('correctly handles != operator with metadata', () => {
    expect(compareStrict('1.0.0+alpha', '1.0.0+beta', '!=')).toBe(true);
    expect(compareStrict('1.0.0', '1.0.0+build', '!=')).toBe(true);
    expect(compareStrict('1.0.0+alpha', '1.0.0+alpha', '!=')).toBe(false);
  });

  it('handles === and !== operators same as compare', () => {
    expect(compareStrict('1.0.0+build.1', '1.0.0+build.1', '===')).toBe(true);
    expect(compareStrict('1.0.0+build.1', '1.0.0+build.2', '===')).toBe(false);
    expect(compareStrict('1.0.0+build.1', '1.0.0+build.2', '!==')).toBe(true);
    expect(compareStrict('1.0.0+build.1', '1.0.0+build.1', '!==')).toBe(false);
  });

  it('prioritizes version numbers over metadata', () => {
    expect(compareStrict('1.0.1+alpha', '1.0.0+beta', '>')).toBe(true);
    expect(compareStrict('1.0.0+beta', '1.1.0+alpha', '<')).toBe(true);
  });

  it('prioritizes pre-release over metadata', () => {
    expect(compareStrict('1.0.0-beta+build.1', '1.0.0-alpha+build.2', '>')).toBe(true);
    expect(compareStrict('1.0.0-alpha+build.2', '1.0.0-beta+build.1', '<')).toBe(true);
  });
});
