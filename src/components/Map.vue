<template>
    <Grid>
        <template #default="{ col, row }">
            <div class="relative flex h-full items-center justify-center">
                <component
                    v-if="level[row][col]"
                    :ref="(el: any) => addIslandRef(el, level[row][col]!.id)"
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
import { drawBridgeBetweenIslands } from '../utils/bridges.utils';
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
    [
        {
            id: uuidv4(),
            value: 2,
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
        null,
    ],
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
const islandsWithIds = ref<{ island: typeof Island; id: string }[]>([]);

const addIslandRef = (el: typeof Island, id: string) => {
    if (islandsWithIds.value.find((i) => i.id === id)) return;

    islandsWithIds.value.push({
        island: el,
        id,
    });
};

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

    const islandWithId1 = islandsWithIds.value.find(
        (i) => i.id === previousLevelItem?.id,
    );

    const islandWithId2 = islandsWithIds.value.find(
        (i) => i.id === netLevelItem?.id,
    );

    if (!islandWithId1 || !islandWithId2) return;

    if (
        islandWithId1.island.acceptConnection() &&
        islandWithId2.island.acceptConnection() &&
        noBridgesBetweenIslands(islandWithId1, islandWithId2)
    ) {
        islandWithId1.island.addConnection(
            islandWithId2.island.$el,
            islandWithId2.id,
        );
        islandWithId2.island.addConnection(
            islandWithId1.island.$el,
            islandWithId1.id,
        );
    } else {
        islandWithId1.island.removeConnection(islandWithId2.id);
        islandWithId2.island.removeConnection(islandWithId1.id);
    }
};

const noBridgesBetweenIslands = (
    islandWithId1: { island: typeof Island; id: string },
    islandWithId2: { island: typeof Island; id: string },
) => {
    const island1RowPos = level.findIndex((row) =>
        row.find((i) => i?.id === islandWithId1.id),
    );
    const island1ColPos = level[island1RowPos].findIndex(
        (i) => i?.id === islandWithId1.id,
    );

    const island2RowPos = level.findIndex((row) =>
        row.find((i) => i?.id === islandWithId2.id),
    );
    const island2ColPos = level[island2RowPos].findIndex(
        (i) => i?.id === islandWithId2.id,
    );

    if (island1RowPos === island2RowPos) {
        const min = Math.min(island1ColPos, island2ColPos);
        const max = Math.max(island1ColPos, island2ColPos);

        for (let i = min + 1; i < max; i++) {
            if (level[island1RowPos][i] !== null) {
                return false;
            }
        }
    } else if (island1ColPos === island2ColPos) {
        const min = Math.min(island1RowPos, island2RowPos);
        const max = Math.max(island1RowPos, island2RowPos);

        for (let i = min + 1; i < max; i++) {
            if (level[i][island1ColPos] !== null) {
                return false;
            }
        }

        return true;
    }
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
    islandsWithIds.value.forEach((island) => {
        island.island.connections.forEach(
            (connection: { el: HTMLElement; id: string }) => {
                drawBridgeBetweenIslands(
                    island.island.$el,
                    connection.el,
                    connection.id,
                );
            },
        );
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
