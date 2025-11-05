# Maestro E2E Tests

This directory contains end-to-end tests using [Maestro](https://maestro.mobile.dev/).

## Setup

Install Maestro CLI:

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

## Running Tests

### Run all tests

```bash
maestro test .maestro/
```

### Run specific test

```bash
maestro test .maestro/login-flow.yaml
```

### Run tests on iOS

```bash
maestro test --platform ios .maestro/
```

### Run tests on Android

```bash
maestro test --platform android .maestro/
```

## Writing Tests

Maestro uses YAML files to define test flows. Each test file should:

1. Specify the `appId` at the top
2. Define a sequence of commands to interact with the app
3. Include assertions to verify expected behavior

## Test Files

- `login-flow.yaml`: Tests the login functionality
- `navigation-flow.yaml`: Tests basic navigation between screens

## CI/CD Integration

Tests can be run in GitHub Actions by adding the `run-e2e` label to a pull request.

## Maestro Studio

For interactive test development:

```bash
maestro studio
```

This opens a UI where you can record test flows interactively.

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/commands)
- [Example Flows](https://maestro.mobile.dev/examples)
