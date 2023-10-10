import type { Meta, StoryObj } from '@storybook/vue3';
import Cursor from '../components/Cursor.vue';

const meta = {
    title: 'Components/Cursor',
    component: Cursor,
    tags: ['autodocs'],
    render: (args) => ({
        components: { Cursor },
        setup: () => ({ args }),
        template: `
        <div class="h-12 aspect-square relative">
            <Cursor v-bind="args"/>
        <div>
    `,
    }),
} satisfies Meta<typeof Cursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const PropLocked: Story = {
    args: {
        locked: true,
    },
};
