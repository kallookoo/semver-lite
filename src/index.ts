/**
 * List of supported comparison operators.
 * These operators are used to compare semantic versions.
 */
const OPERATORS = [
  '>',
  'gt',
  '>=',
  'ge',
  '<',
  'lt',
  '<=',
  'le',
  '=',
  '==',
  'eq',
  '!=',
  '<>',
  'ne',
  '===',
  '!==',
] as const;

const REGEX = {
  version: /^\d+(\.\d+)*$/,
  numeric: /^\d+$/,
};

/**
 * Represents a version string or number.
 */
export type Version = string | number;

/**
 * Supported comparison operators for version comparison.
 */
export type ComparisonOperator = (typeof OPERATORS)[number];

/**
 * Structured representation of a parsed version.
 * Includes version numbers, optional pre-release identifiers, and metadata.
 */
export interface NormalizedVersion {
  numbers: number[];
  release: string | null;
  metadata: string | null;
}

/**
 * Results of version comparison containing separate evaluations
 * for version numbers, pre-release identifiers, and metadata.
 */
export interface ComparisonResult {
  version: number;
  release: number;
  metadata: number;
}

/**
 * Normalizes a version string or number into a structured format.
 * Converts the version into its components: numbers, pre-release, and metadata.
 *
 * @param {Version} version - Version to normalize (e.g., "1.0.0-alpha+001").
 * @returns {NormalizedVersion} Structured version object with numbers, release, and metadata.
 * @throws {Error} If the version format is invalid.
 */
const normalize = (version: Version): NormalizedVersion => {
  if (version === undefined || version === null) {
    throw new Error('Invalid version format: version cannot be undefined or null');
  }
  if (typeof version !== 'string') {
    version = String(version);
  }

  const [vers, metadata] = version.trim().replace(/^v/, '').split('+');
  const [ver, release] = vers.split('-');

  if (!REGEX.version.test(ver)) {
    throw new Error('Invalid version format');
  }

  const result = {
    numbers: ver.split('.').map(Number),
    release: release || null,
    metadata: metadata || null,
  };

  return result;
};

/**
 * Compares pre-release identifiers according to SemVer rules.
 * Pre-release identifiers are compared lexicographically and numerically.
 *
 * @param {string | null} a - First pre-release string (e.g., "alpha").
 * @param {string | null} b - Second pre-release string (e.g., "beta").
 * @returns {number} 1 if a > b, -1 if a < b, 0 if equal.
 */
const evaluateRelease = (a: string | null, b: string | null): number => {
  if (a === null) {
    if (b === null) {
      return 0;
    } else {
      return 1;
    }
  }
  if (b === null) {
    return -1;
  }

  const segmentA = a.split('.');
  const segmentB = b.split('.');
  const minLength = Math.min(segmentA.length, segmentB.length);

  for (let i = 0; i < minLength; i++) {
    const aIsNumeric = REGEX.numeric.test(segmentA[i]);
    const bIsNumeric = REGEX.numeric.test(segmentB[i]);

    if (aIsNumeric && !bIsNumeric) {
      return -1;
    }
    if (!aIsNumeric && bIsNumeric) {
      return 1;
    }
    if (aIsNumeric && bIsNumeric) {
      const diff = parseInt(segmentA[i], 10) - parseInt(segmentB[i], 10);
      if (diff !== 0) {
        return diff > 0 ? 1 : -1;
      }
    } else {
      if (segmentA[i] < segmentB[i]) {
        return -1;
      }
      if (segmentA[i] > segmentB[i]) {
        return 1;
      }
    }
  }

  return segmentA.length - segmentB.length;
};

/**
 * Compares build metadata.
 * Metadata is compared lexicographically if both are present.
 *
 * @param {string | null} a - First metadata string (e.g., "001").
 * @param {string | null} b - Second metadata string (e.g., "002").
 * @returns {number} 1 if a > b, -1 if a < b, 0 if equal.
 */
const evaluateMeta = (a: string | null, b: string | null): number => {
  if (a === b) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }
  return a > b ? 1 : -1;
};

/**
 * Compares two normalized version objects.
 * Evaluates version numbers, pre-release identifiers, and optionally metadata.
 *
 * @param {NormalizedVersion} a - First normalized version.
 * @param {NormalizedVersion} b - Second normalized version.
 * @param {ComparisonOperator} operador - Comparison operator used to determine if metadata should be compared.
 * @returns {ComparisonResult} Object with version, release, and metadata comparison results.
 */
const evaluateVersions = (
  a: NormalizedVersion,
  b: NormalizedVersion,
  operador: ComparisonOperator
): ComparisonResult => {
  const maxLength = Math.max(a.numbers.length, b.numbers.length);
  const comparison: ComparisonResult = {
    version: 0,
    release: 0,
    metadata: 0,
  };
  for (let i = 0; i < maxLength; i++) {
    const segmentA = a.numbers[i] || 0;
    const segmentB = b.numbers[i] || 0;
    if (segmentA !== segmentB) {
      comparison.version = segmentA > segmentB ? 1 : -1;
      break;
    }
  }

  comparison.release = evaluateRelease(a.release, b.release);
  if (operador === '===' || operador === '!==') {
    comparison.metadata = evaluateMeta(a.metadata, b.metadata);
  }

  return comparison;
};

/**
 * Compares two version strings or numbers using the specified operator.
 * Supports various comparison operators like ">", "<=", "==", "!==", etc.
 *
 * @param {Version} v1 - First version to compare (e.g., "1.0.0").
 * @param {Version} v2 - Second version to compare (e.g., "2.0.0").
 * @param {ComparisonOperator} [operator='>'] - Comparison operator (defaults to '>').
 * @returns {boolean} Result of the comparison.
 * @throws {Error} For unsupported operators or invalid version formats.
 */
export const compare = (v1: Version, v2: Version, operator: ComparisonOperator = '>'): boolean => {
  if (!OPERATORS.includes(operator)) {
    throw new Error(`Unsupported operator for comparison: ${operator}`);
  }

  if (operator === '===' || operator === '!==') {
    return compareStrict(v1, v2, operator);
  }

  const { version, release } = evaluateVersions(normalize(v1), normalize(v2), operator);

  switch (operator) {
    case '>':
    case 'gt':
      return version > 0 || (version === 0 && release > 0);
    case '>=':
    case 'ge':
      return version > 0 || (version === 0 && (release === 0 || release > 0));
    case '<':
    case 'lt':
      return version < 0 || (version === 0 && release < 0);
    case '<=':
    case 'le':
      return version < 0 || (version === 0 && release <= 0);
    case '=':
    case '==':
    case 'eq':
      return version === 0 && release === 0;
    case '!=':
    case '<>':
    case 'ne':
      return version !== 0 || release !== 0;
    default:
      return false;
  }
};

export const compareStrict = (
  v1: Version,
  v2: Version,
  operator: ComparisonOperator = '>'
): boolean => {
  if (!OPERATORS.includes(operator)) {
    throw new Error(`Unsupported operator for comparison: ${operator}`);
  }

  const { version, release, metadata } = evaluateVersions(normalize(v1), normalize(v2), '===');

  switch (operator) {
    case '>':
    case 'gt':
      return (
        version > 0 ||
        (version === 0 && release > 0) ||
        (version === 0 && release === 0 && metadata > 0)
      );

    case '>=':
    case 'ge':
      return (
        version > 0 ||
        (version === 0 && release > 0) ||
        (version === 0 && release === 0 && metadata >= 0)
      );

    case '<':
    case 'lt':
      return (
        version < 0 ||
        (version === 0 && release < 0) ||
        (version === 0 && release === 0 && metadata < 0)
      );

    case '<=':
    case 'le':
      return (
        version < 0 ||
        (version === 0 && release < 0) ||
        (version === 0 && release === 0 && metadata <= 0)
      );

    case '=':
    case '==':
    case '===':
    case 'eq':
      return version === 0 && release === 0 && metadata === 0;

    case '!=':
    case '!==':
    case '<>':
    case 'ne':
      return version !== 0 || release !== 0 || metadata !== 0;

    default:
      return false;
  }
};
