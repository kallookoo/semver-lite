/**
 * List of supported comparison operators.
 * These operators are used to compare semantic versions.
 */
declare const OPERATORS: readonly [">", "gt", ">=", "ge", "<", "lt", "<=", "le", "=", "==", "eq", "!=", "<>", "ne", "===", "!=="];
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
 * Compares two version strings or numbers using the specified operator.
 * Supports various comparison operators like ">", "<=", "==", "!==", etc.
 *
 * @param {Version} v1 - First version to compare (e.g., "1.0.0").
 * @param {Version} v2 - Second version to compare (e.g., "2.0.0").
 * @param {ComparisonOperator} [operator='>'] - Comparison operator (defaults to '>').
 * @returns {boolean} Result of the comparison.
 * @throws {Error} For unsupported operators or invalid version formats.
 */
export declare const compare: (v1: Version, v2: Version, operator?: ComparisonOperator) => boolean;
export declare const compareStrict: (v1: Version, v2: Version, operator?: ComparisonOperator) => boolean;
export {};
