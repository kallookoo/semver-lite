# semver-lite

A lightweight library for comparing semantic versions.

## Installation & Usage

### npm

```bash
npm install @kallookoo/semver-lite
```

```typescript
import { compare, compareStrict } from 'semver-lite';
```

### Browser via CDN (Coming soon)

#### ESM (ES Modules)

```html
<script type="module">
  import { compare, compareStrict } from "https://cdn.jsdelivr.net/npm/semver-lite/dist/index.min.mjs";
</script>
```

#### UMD (Universal Module Definition)

```html
<script src="https://cdn.jsdelivr.net/npm/semver-lite/dist/index.umd.min.js"></script>
<script>
  const { compare, compareStrict } = semverLite;
</script>
```

#### IIFE (Immediately Invoked Function Execution)

```html
<script src="https://cdn.jsdelivr.net/npm/semver-lite/dist/index.min.js"></script>
<script>
  const { compare, compareStrict } = semverLite;
</script>
```

## Examples

```typescript
compare('2.0.0', '1.0.0');  // true

compare('1.0.0-alpha', '1.0.0', '<');  // true - pre-release is lower than release

compare('v1.0.0+build.1', '1.0.0+build.2', '=');  // true

compareStrict('1.0.0+build.1', '1.0.0+build.2', '<');  // true

compareStrict('1.0.0+build.1', '1.0.0+build.1', '===');  // true
```

## Features

- Supports semantic versioning standard
- Multiple comparison operators
- Proper handling of pre-release identifiers
- Optional metadata comparison (strict mode)
- TypeScript types included

## API

### Functions

- `compare(v1, v2, operator = '>')` - Compares two versions. Default operator is `>`.
- `compareStrict(v1, v2, operator = '>')` - Compares two versions including metadata. Default operator is `>`.

### Supported operators

| Function      | Operation             | Operators               | Strict Mode |
| :------------ | :-------------------- | :---------------------- | :---------: |
| compare       | Greater than          | `>`, `gt`               |     No      |
| compare       | Greater than or equal | `>=`, `ge`              |     No      |
| compare       | Less than             | `<`, `lt`               |     No      |
| compare       | Less than or equal    | `<=`, `le`              |     No      |
| compare       | Equal                 | `=`, `==`, `eq`         |     No      |
| compare       | Strictly equal        | `===`                   |     Yes     |
| compare       | Not equal             | `!=`, `<>`, `ne`        |     No      |
| compare       | Strictly not equal    | `!==`                   |     Yes     |
| compareStrict | Greater than          | `>`, `gt`               |     Yes     |
| compareStrict | Greater than or equal | `>=`, `ge`              |     Yes     |
| compareStrict | Less than             | `<`, `lt`               |     Yes     |
| compareStrict | Less than or equal    | `<=`, `le`              |     Yes     |
| compareStrict | Equal                 | `=`, `==`, `===`, `eq`  |     Yes     |
| compareStrict | Not equal             | `!=`, `<>`, `!==`, `ne` |     Yes     |
