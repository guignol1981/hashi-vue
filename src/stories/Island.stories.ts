import type { Meta, StoryObj } from '@storybook/vue3';
import Island from '../components/Island.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
    title: 'Components/Island',
    component: Island,
    tags: ['autodocs'],
} satisfies Meta<typeof Island>;

export default meta;
type Story = StoryObj<typeof Island>;

export const Default: Story = {
    args: {},
};

export const PropValue: Story = {
    args: {
        value: 1,
    },
};

export const PropInactive: Story = {
    args: {
        state: 'inactive',
    },
};

export const PropActive: Story = {
    args: {
        state: 'active',
    },
};
