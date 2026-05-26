import type { StorybookConfig } from "@storybook/react-vite";

const config = {
    addons: ["@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    stories: ["../stories/**/*.stories.@(ts|tsx)"],
} satisfies StorybookConfig;

export default config;
