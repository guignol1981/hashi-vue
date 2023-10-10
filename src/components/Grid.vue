<template>
    <div
        :class="`relative grid grid-cols-4 grid-rows-${props.size} z-10 max-w-lg gap-2 border`"
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
