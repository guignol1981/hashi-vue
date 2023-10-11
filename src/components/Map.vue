<template>
    <Grid>
        <template #default="{ col, row }">
            <div class="relative flex h-full items-center justify-center">
                <component
                    v-if="level[row][col]"
                    :ref="
                        (el: any) =>
                            islands.push({
                                island: el,
                                id: level[row][col]!.id,
                            })
                    "
                    :is="level[row][col]?.component"
                    :value="level[row][col]?.value"
                />
                <Cursor
                    ref="cursor"
                    v-if="
                        cursorPosition.col === col && cursorPosition.row === row
                    "
                />
            </div>
        </template>
    </Grid>
</template>

<script setup lang="ts">
import Grid from './Grid.vue';
import Island from './Island.vue';
import { ref } from 'vue';
import Cursor from './Cursor.vue';
import { drawBridgeBetweenIsland } from '../utils/bridges.utils';
import { v4 as uuidv4 } from 'uuid';

const level: ({
    id: string;
    value: number;
    component: typeof Island;
    connections: { row: number; col: number }[];
} | null)[][] = [
    [
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            connections: [],
        },
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            connections: [],
        },
        null,
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            connections: [],
        },
    ],
    [null, null, null, null],
    [
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            connections: [],
        },
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            connections: [],
        },
        null,
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            connections: [],
        },
    ],
    [null, null, null, null],
];

const cursor = ref<typeof Cursor | null>(null);

const cursorPosition = ref<{ col: number; row: number }>({ col: 0, row: 0 });
const islands = ref<{ island: typeof Island; id: string }[]>([]);

const manageConnectionsFromCursorPosition = (
    direction: 'up' | 'down' | 'left' | 'right',
) => {
    let previousLevelItem: {
        id: string;
        value: number;
        component: typeof Island;
        connections: { row: number; col: number }[];
    } | null = null;
    let netLevelItem: {
        id: string;
        value: number;
        component: typeof Island;
        connections: { row: number; col: number }[];
    } | null = null;

    if (direction === 'up' || direction === 'down') {
        for (
            let i = cursorPosition.value.row - (direction === 'up' ? 1 : 0);
            i >= 0;
            i--
        ) {
            if (level[i][cursorPosition.value.col] !== null) {
                previousLevelItem = level[i][cursorPosition.value.col];
                break;
            }
        }

        for (
            let i = cursorPosition.value.row + (direction === 'down' ? 1 : 0);
            i < level.length;
            i++
        ) {
            if (
                level[i][cursorPosition.value.col] !== null &&
                previousLevelItem !== level[i][cursorPosition.value.col]
            ) {
                netLevelItem = level[i][cursorPosition.value.col];
                break;
            }
        }
    } else {
        for (
            let i = cursorPosition.value.col - (direction === 'left' ? 1 : 0);
            i >= 0;
            i--
        ) {
            if (level[cursorPosition.value.row][i] !== null) {
                previousLevelItem = level[cursorPosition.value.row][i];
                break;
            }
        }

        for (
            let i = cursorPosition.value.col + (direction === 'right' ? 1 : 0);
            i < level[0]!.length;
            i++
        ) {
            if (
                level[cursorPosition.value.row][i] !== null &&
                previousLevelItem !== level[cursorPosition.value.row][i]
            ) {
                netLevelItem = level[cursorPosition.value.row][i];
                break;
            }
        }
    }

    if (!previousLevelItem || !netLevelItem) return;

    const island1 = islands.value.find(
        (i) => i.id === previousLevelItem?.id,
    )!.island;

    const island2 = islands.value.find(
        (i) => i.id === netLevelItem?.id,
    )!.island;

    if (!island1 || !island2) return;

    if (island1.acceptConnection() && island2.acceptConnection()) {
        island1.addConnection(island2.$el);
        island2.addConnection(island1.$el);
    } else {
        island1.resetConnections();
        island2.resetConnections();
    }

    drawAllBridges();
};

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown')
        e.preventDefault();

    switch (e.code) {
        case 'ArrowUp':
            if (cursor.value?.locked) {
                manageConnectionsFromCursorPosition('up');
                break;
            }

            if (cursorPosition.value.row > 0) {
                cursorPosition.value.row--;
            }
            break;
        case 'ArrowDown':
            if (cursor.value?.locked) {
                manageConnectionsFromCursorPosition('down');
                break;
            }

            if (cursorPosition.value.row < level.length - 1) {
                cursorPosition.value.row++;
            }
            break;
        case 'ArrowLeft':
            if (cursor.value?.locked) {
                manageConnectionsFromCursorPosition('left');
                break;
            }

            if (cursorPosition.value.col > 0) {
                cursorPosition.value.col--;
            }
            break;
        case 'ArrowRight':
            if (cursor.value?.locked) {
                manageConnectionsFromCursorPosition('right');
                break;
            }

            if (cursorPosition.value.col < level[0].length - 1) {
                cursorPosition.value.col++;
            }
            break;
        case 'Space':
            cursor.value?.lockCursor();

            break;
    }
});

const drawAllBridges = () => {
    islands.value.forEach((island) => {
        island.island.connections.forEach((connection: HTMLElement) => {
            drawBridgeBetweenIsland(island.island.$el, connection);
        });
    });
};

window.addEventListener('keyup', (e: KeyboardEvent) => {
    switch (e.code) {
        case 'Space':
            cursor.value?.unlockCursor();
            break;
    }
});
</script>
