<template>
    <span
        class="border-2 h-12 w-12 border-black grid place-content-center aspect-square rounded-full cursor-pointer"
        :class="{
            'bg-green-400': connections === props.value,
            'bg-blue-400': props.state === 'active',
            'bg-gray-400': props.state === 'inactive',
        }"
    >
        {{ props.value }}
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

const connections = ref(0);

const addConnection = () => {
    connections.value++;
};

const removeConnection = () => {
    connections.value--;
};

const resetConnections = () => {
    connections.value = 0;
};

defineExpose({
    addConnection,
    removeConnection,
    resetConnections,
});
</script>
