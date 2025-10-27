# Contributing Guide

Thank you for contributing to this project! This guide will help you get started.

## Development Workflow

### 1. Branch Naming

Use descriptive branch names:
- `feature/add-user-profile`
- `fix/login-button-crash`
- `refactor/auth-service`
- `docs/update-readme`

### 2. Commit Messages

Follow conventional commits:
- `feat: add user profile screen`
- `fix: resolve login button crash`
- `refactor: improve auth service structure`
- `docs: update README with setup instructions`
- `test: add tests for auth service`
- `chore: update dependencies`

### 3. Code Style

This project uses ESLint and Prettier for code formatting.

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### 4. Testing

Always write tests for new features:

```bash
npm test
```

Ensure all tests pass before submitting a PR.

### 5. Type Safety

Use TypeScript types for all code:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};
```

Run type checking:
```bash
npm run type-check
```

## Code Guidelines

### Component Structure

```typescript
import { View, Text } from "react-native";

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <View className="p-4">
      <Text className="text-lg font-bold">{title}</Text>
    </View>
  );
}
```

### Hooks

Custom hooks should start with `use`:

```typescript
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  // implementation
  return { user, setUser };
}
```

### Services

API services should be organized by resource:

```typescript
export const userService = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put("/user/profile", data);
    return response.data;
  },
};
```

### State Management

Use Zustand for global state:

```typescript
import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

## Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Write tests for your changes
4. Ensure all tests pass
5. Run type checking
6. Update documentation if needed
7. Create a pull request
8. Wait for review

### PR Checklist

- [ ] Tests added and passing
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented code
- [ ] Descriptive commit messages

## Adding New Dependencies

When adding new dependencies:

1. Check if the dependency is maintained
2. Check the bundle size impact
3. Document why the dependency is needed
4. Update package.json

```bash
npm install <package-name>
```

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000.00");
  });
});
```

### Component Tests

Test component behavior:

```typescript
import { render, fireEvent, screen } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button", () => {
  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Click me</Button>);

    fireEvent.press(screen.getByText("Click me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying configuration
- Adding dependencies

Keep documentation:
- Clear and concise
- Up to date
- Example-driven

## Questions?

If you have questions, please:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the question

Thank you for contributing!
