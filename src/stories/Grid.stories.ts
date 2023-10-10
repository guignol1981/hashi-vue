import type { Meta, StoryObj } from '@storybook/vue3';

import Grid from '../components/Grid.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
    title: 'Components/Grid',
    component: Grid,
    render: (args: any) => ({
        components: { Grid },
        setup() {
            return { args };
        },
        template: `<grid v-bind="args"><template #default="{col, row}">{{col}} {{row}}</template></grid>`,
    }),
    tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
