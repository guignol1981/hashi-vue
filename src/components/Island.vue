<template>
    <span
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

const props = withDefaults(
    defineProps<{
        value: number;
        state?: 'active' | 'inactive';
    }>(),
    {
        state: 'inactive',
        connections: 0,
    },
);

const connections = ref<HTMLElement[]>([]);

const addConnection = (el: HTMLElement) => {
    connections.value.push(el);
};

const acceptConnection = () => {
    return connections.value.length < props.value;
};

const resetConnections = () => {
    connections.value = [];
};

defineExpose({
    addConnection,
    resetConnections,
    acceptConnection,
    connections,
});
</script>
