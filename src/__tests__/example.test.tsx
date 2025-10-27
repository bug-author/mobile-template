import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

describe("Example Test", () => {
  it("renders correctly", () => {
    render(
      <View>
        <Text>Hello World</Text>
      </View>
    );

    expect(screen.getByText("Hello World")).toBeTruthy();
  });
});
