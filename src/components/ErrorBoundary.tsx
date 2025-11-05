import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { config } from "../lib/config";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log to PostHog
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("error_boundary_caught", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }

    // If Sentry is configured, it will automatically catch this
    // No need to manually log to Sentry as it has global error handlers
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View className="flex-1 items-center justify-center bg-white p-6 dark:bg-gray-900">
          <View className="max-w-md w-full">
            <Text className="text-2xl font-bold text-red-600 mb-4 dark:text-red-400">
              Oops! Something went wrong
            </Text>

            <Text className="text-gray-700 mb-4 dark:text-gray-300">
              We're sorry for the inconvenience. The error has been reported to our team.
            </Text>

            {config.isDevelopment && (
              <ScrollView className="bg-gray-100 p-4 rounded-lg mb-4 max-h-64 dark:bg-gray-800">
                <Text className="text-xs font-mono text-red-600 dark:text-red-400">
                  {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-xs font-mono text-gray-600 mt-2 dark:text-gray-400">
                    {this.state.error.stack}
                  </Text>
                )}
              </ScrollView>
            )}

            <Pressable
              className="bg-blue-500 py-4 rounded-lg active:bg-blue-600"
              onPress={this.resetError}
            >
              <Text className="text-white text-center font-semibold">Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
