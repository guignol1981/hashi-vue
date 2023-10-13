<template>
    <span
        ref="rootElement"
        class="grid aspect-square h-12 w-12 cursor-pointer place-content-center rounded-full border-2 border-black"
        :class="{
            'bg-green-400': connections.length === props.value,
            'bg-blue-400': props.state === 'active',
            'bg-gray-400': props.state === 'inactive',
        }"
    >
        {{ props.value }}
        <p>
            {{ connections.length }}
        </p>
    </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { drawBridgeBetweenIslands } from '../utils/bridges.utils';

const props = withDefaults(
    defineProps<{
        value: number;
        state?: 'active' | 'inactive';
    }>(),
    {
        state: 'inactive',
    },
);

const connections = ref<{ el: HTMLElement; id: string }[]>([]);
const rootElement = ref<HTMLElement | null>(null);

const addConnection = (el: HTMLElement, id: string) => {
    if (connections.value.length >= props.value) {
        resetConnections();
    }

    connections.value.push({ el, id });

    if (!rootElement.value) {
        return;
    }

    rootElement.value?.appendChild(
        drawBridgeBetweenIslands(rootElement.value, el, id),
    );
};

const removeConnection = (id: string) => {
    const bridgeElements = rootElement.value?.querySelectorAll(`#bridge-${id}`);

    if (!bridgeElements?.length) {
        return;
    }

    bridgeElements.forEach((c) => c.remove());

    connections.value = connections.value.filter((c) => c.id !== id);
};

const acceptConnection = () => {
    return connections.value.length < props.value;
};

const resetConnections = () => {
    connections.value = [];
};

defineExpose({
    addConnection,
    removeConnection,
    resetConnections,
    acceptConnection,
    connections,
});
</script>
