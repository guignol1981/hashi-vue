<template>
    <Grid>
        <template #default="{ col, row }">
            <div class="relative flex h-full items-center justify-center">
                <component
                    v-if="level[row][col].id"
                    :ref="(el: any) => addIslandRef(el, level[row][col].id!)"
                    :is="level[row][col]!.component"
                    :value="level[row][col]!.value"
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
    <pre>
        {{ level.map((row) => row.map((cell) => ({ bridges: cell.bridges }))) }}
    </pre>
</template>

<script setup lang="ts">
import Grid from './Grid.vue';
import Island from './Island.vue';
import { ref } from 'vue';
import Cursor from './Cursor.vue';
import { v4 as uuidv4 } from 'uuid';

interface LevelCell {
    id?: string;
    value?: number;
    component?: typeof Island;
    bridges: string[];
}

const level = ref<LevelCell[][]>([
    [
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            bridges: [],
        },
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            bridges: [],
        },
        {
            bridges: [],
        },
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            bridges: [],
        },
    ],
    [
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            bridges: [],
        },
        {
            bridges: [],
        },
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            bridges: [],
        },
        {
            bridges: [],
        },
    ],
    [
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            bridges: [],
        },
        {
            id: uuidv4(),
            value: 1,
            component: Island,
            bridges: [],
        },
        {
            bridges: [],
        },
        {
            id: uuidv4(),
            value: 2,
            component: Island,
            bridges: [],
        },
    ],
    [
        {
            bridges: [],
        },
        {
            bridges: [],
        },
        {
            bridges: [],
        },
        {
            bridges: [],
        },
    ],
]);

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
    let previousLevelItem: LevelCell | null = null;
    let netLevelItem: LevelCell | null = null;
    const cellsInLine: LevelCell[] = [];

    if (direction === 'up' || direction === 'down') {
        for (
            let i = cursorPosition.value.row - (direction === 'up' ? 1 : 0);
            i >= 0;
            i--
        ) {
            cellsInLine.push(level.value[i][cursorPosition.value.col]);

            if (level.value[i][cursorPosition.value.col].id) {
                netLevelItem = level.value[i][cursorPosition.value.col];
                break;
            }
        }

        for (
            let i = cursorPosition.value.row + (direction === 'down' ? 1 : 0);
            i < level.value.length;
            i++
        ) {
            cellsInLine.push(level.value[i][cursorPosition.value.col]);

            if (
                level.value[i][cursorPosition.value.col].id &&
                netLevelItem !== level.value[i][cursorPosition.value.col]
            ) {
                previousLevelItem = level.value[i][cursorPosition.value.col];
                break;
            }
        }
    } else {
        for (
            let i = cursorPosition.value.col - (direction === 'left' ? 1 : 0);
            i >= 0;
            i--
        ) {
            cellsInLine.push(level.value[cursorPosition.value.row][i]);

            if (level.value[cursorPosition.value.row][i].id) {
                previousLevelItem = level.value[cursorPosition.value.row][i];
                break;
            }
        }

        for (
            let i = cursorPosition.value.col + (direction === 'right' ? 1 : 0);
            i < level.value[0]!.length;
            i++
        ) {
            cellsInLine.push(level.value[cursorPosition.value.row][i]);

            if (
                level.value[cursorPosition.value.row][i].id &&
                previousLevelItem !== level.value[cursorPosition.value.row][i]
            ) {
                netLevelItem = level.value[cursorPosition.value.row][i];
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
        !cellsInLine.filter(
            (cell) =>
                !cell.id &&
                cell.bridges.filter((b) => b !== islandWithId2.id).length,
        ).length
    ) {
        islandWithId1.island.addConnection(
            islandWithId2.island.$el,
            islandWithId2.id,
        );
        islandWithId2.island.addConnection(
            islandWithId1.island.$el,
            islandWithId1.id,
        );

        cellsInLine.forEach((cb) => {
            cb.bridges.push(islandWithId2.id!);
        });
    } else {
        islandWithId1.island.removeConnection(islandWithId2.id);
        islandWithId2.island.removeConnection(islandWithId1.id);

        cellsInLine.forEach((cb) => {
            cb.bridges = cb.bridges.filter((b) => b !== islandWithId2.id);
        });
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

            if (cursorPosition.value.row < level.value.length - 1) {
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

            if (cursorPosition.value.col < level.value[0].length - 1) {
                cursorPosition.value.col++;
            }
            break;
        case 'Space':
            cursor.value?.lockCursor();

            break;
    }
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
    switch (e.code) {
        case 'Space':
            cursor.value?.unlockCursor();
            break;
    }
});
</script>
