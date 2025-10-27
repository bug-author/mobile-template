# Pre-Commit Hooks Guide

This project uses Git hooks to maintain code quality and consistency. This guide explains what hooks are configured and how they work.

## Overview

Pre-commit hooks are automated checks that run before your code is committed. They help maintain code quality by:

- Ensuring code is properly formatted
- Catching linting errors early
- Enforcing consistent commit messages
- Preventing common mistakes

## Tools Used

### Husky

Husky manages Git hooks for the project. It's configured to run automatically when you make a commit.

**Configuration**: `.husky/` directory

### Lint-Staged

Lint-staged runs linters on files that are staged for commit. This means only changed files are checked, making the process fast.

**Configuration**: `package.json` (`lint-staged` section)

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx,json,md}": [
    "prettier --write"
  ]
}
```

### Commitlint

Commitlint ensures commit messages follow the Conventional Commits specification.

**Configuration**: `commitlint.config.js`

## Hooks Configured

### Pre-Commit Hook

**Location**: `.husky/pre-commit`

**What it does**:
1. Runs ESLint on staged TypeScript/JavaScript files
2. Automatically fixes fixable issues
3. Formats code with Prettier
4. Stages the fixed files

**When it runs**: Before creating a commit

**Example output**:
```
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
```

### Commit-Msg Hook

**Location**: `.husky/commit-msg`

**What it does**:
- Validates commit message format
- Ensures messages follow Conventional Commits

**When it runs**: After you write a commit message

**Valid commit types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Reverting a previous commit

## Commit Message Examples

### Good Commit Messages

```bash
feat: add user profile screen
fix: resolve crash on login button press
docs: update installation instructions
refactor: simplify auth service logic
test: add tests for user service
chore: update dependencies to latest versions
```

### Bad Commit Messages (Will Be Rejected)

```bash
# Missing type
"added new feature"

# Type in wrong case
"Feat: add feature"

# Subject starts with uppercase (after colon)
"feat: Add feature"

# No subject
"fix:"

# Random message
"WIP"
"fixes"
"update"
```

## Workflow Example

### Normal Workflow

```bash
# 1. Make changes to files
vim src/components/Button.tsx

# 2. Stage your changes
git add src/components/Button.tsx

# 3. Commit with proper message
git commit -m "feat: add loading state to Button component"

# What happens:
# - Pre-commit hook runs
# - ESLint checks your code
# - Prettier formats your code
# - Changes are staged
# - Commit message is validated
# - Commit is created
```

### If Hooks Fail

#### Linting Errors

```bash
git commit -m "feat: add new feature"

# Output:
✖ eslint found errors:
  src/components/Button.tsx
    5:10  error  'unused' is defined but never used  no-unused-vars

# Fix the error:
vim src/components/Button.tsx  # Remove unused variable

# Try again:
git add src/components/Button.tsx
git commit -m "feat: add new feature"
```

#### Commit Message Error

```bash
git commit -m "added new feature"

# Output:
⧗   input: added new feature
✖   type must be one of [feat, fix, docs, ...] [type-enum]

# Fix by using proper format:
git commit -m "feat: add new feature"
```

## Manual Commands

### Run Linting Manually

```bash
# Check for errors
bun run lint

# Fix errors automatically
bun run lint:fix
```

### Format Code Manually

```bash
# Format all files
bun run format
```

### Run Tests Manually

```bash
# Run all tests
bun test

# Watch mode
bun test:watch

# With coverage
bun test:coverage
```

## Bypassing Hooks

**⚠️ Warning**: Only bypass hooks in emergency situations!

### Skip Pre-Commit Hook

```bash
git commit --no-verify -m "feat: emergency fix"
```

### Why You Shouldn't Skip

- Introduces inconsistent code formatting
- May commit code with errors
- Makes code reviews harder
- Creates technical debt

### When It's Acceptable

- Emergency production fixes (still review later)
- Committing generated files
- Work-in-progress on a feature branch (clean up before merging)

## Troubleshooting

### Hook Not Running

**Problem**: Hooks don't execute when committing

**Solutions**:
```bash
# Reinstall husky
bun run prepare

# Check hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Verify husky installation
ls -la .husky/
```

### Hooks Fail With "Command Not Found"

**Problem**: `npx: command not found`

**Solution**: Ensure Node.js and npm are installed
```bash
node --version
npm --version
```

### Prettier and ESLint Conflicts

**Problem**: Prettier and ESLint disagree on formatting

**Solution**: This shouldn't happen as we use `eslint-config-prettier` which disables conflicting ESLint rules. If it does:
```bash
# Update dependencies
bun install

# Check configurations
cat .eslintrc.js
cat .prettierrc
```

### Slow Pre-Commit Hook

**Problem**: Hook takes too long

**Why**: Lint-staged only runs on changed files, so it should be fast. If slow:
- You're committing too many files at once
- Your machine is under heavy load
- ESLint/Prettier rules are complex

**Solution**:
- Commit smaller changesets
- Run `bun run lint` and `bun run format` before committing

## Customizing Hooks

### Modify Lint-Staged Rules

Edit `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    // Add custom command here
  ]
}
```

### Modify Commitlint Rules

Edit `commitlint.config.js`:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Add custom rules here
    "subject-max-length": [2, "always", 100],
  },
};
```

### Add New Hooks

Create a new hook file:

```bash
# Create hook
echo "npm test" > .husky/pre-push
chmod +x .husky/pre-push
```

## Best Practices

1. **Write Clear Commit Messages**: Describe what and why, not how
2. **Commit Often**: Small, focused commits are easier to review
3. **Fix Linting Errors**: Don't disable rules to bypass errors
4. **Keep Hooks Fast**: Only run necessary checks
5. **Document Changes**: Update docs when adding new hooks

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-Staged Documentation](https://github.com/okonet/lint-staged)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
