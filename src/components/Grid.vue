<template>
    <div
        :class="`relative grid grid-cols-${props.size} grid-rows-${props.size} gap-2 max-w-lg border z-10`"
    >
        <div v-for="i in Math.pow(props.size, 2)" class="aspect-square border">
            <slot
                v-bind="{
                    col: getColIndex(i - 1),
                    row: getRowIndex(i - 1),
                }"
            ></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        size?: number;
    }>(),
    {
        size: 4,
    },
);

const getColIndex = (cellIndex: number) => {
    return cellIndex % props.size;
};

const getRowIndex = (cellIndex: number) => {
    return Math.floor(cellIndex / props.size);
};
</script>
