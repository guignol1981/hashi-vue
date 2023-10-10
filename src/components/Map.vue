<template>
    {{ selectedIslandsPositions }}
    <Grid>
        <template #default="{ col, row }">
            <div class="relative flex h-full items-center justify-center">
                <Island
                    :ref="(el) => islands.push(el)"
                    v-if="level[row][col]"
                    :value="level[row][col]"
                    @click="onIslandClick(row, col)"
                />
                <div
                    v-else
                    class="grid h-full w-full place-content-center border border-red-300"
                >
                    test
                </div>
                <Cursor
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
import { drawBridgeBetweenIsland } from '../utils/bridges.utils';
import Cursor from './Cursor.vue';
const level = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 2],
];

const islands = ref<(typeof Island)[]>([]);
const cursorPosition = ref<{ col: number; row: number }>({ col: 0, row: 0 });
const selectedIslandsPositions = ref<{ col: number; row: number }[]>([]);

const onIslandClick = (row: number, col: number) => {
    if (selectedIslandsPositions.value.length === 0) {
        selectedIslandsPositions.value.push({ row, col });
    } else if (selectedIslandsPositions.value.length === 1) {
        selectedIslandsPositions.value.push({ row, col });

        const island1 =
            islands.value[
                level
                    .flat()
                    .slice(
                        0,
                        selectedIslandsPositions.value[0].row *
                            level[0].length +
                            selectedIslandsPositions.value[0].col,
                    )
                    .filter((value) => value).length
            ];

        const island2 =
            islands.value[
                level
                    .flat()
                    .slice(
                        0,
                        selectedIslandsPositions.value[1].row *
                            level[0].length +
                            selectedIslandsPositions.value[1].col,
                    )
                    .filter((value) => value).length
            ];

        drawBridgeBetweenIsland(island1.$el, island2.$el);

        island1.addConnection();
        island2.addConnection();

        selectedIslandsPositions.value = [];
    } else {
        selectedIslandsPositions.value = [{ row, col }];
    }
};
</script>
