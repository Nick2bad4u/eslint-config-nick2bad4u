import type { Meta, StoryObj } from "@storybook/react-vite";

const Button = ({ label }: { readonly label: string }): JSX.Element => (
    <button type="button">{label}</button>
);

const meta = {
    component: Button,
    title: "Fixture/Button",
} satisfies Meta<typeof Button>;

export default meta;

export const Primary = {
    args: {
        label: "Fixture",
    },
} satisfies StoryObj<typeof meta>;
