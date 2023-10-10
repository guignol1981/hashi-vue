import type { Meta, StoryObj } from '@storybook/vue3';
import Cursor from '../components/Cursor.vue';

const meta = {
    title: 'Components/Cursor',
    component: Cursor,
    tags: ['autodocs'],
} satisfies Meta<typeof Cursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
