<template>
    <div
        class="absolute inset-0 ring"
        :class="{
            'ring-red-500': locked,
            'ring-green-500': !locked,
        }"
    ></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const locked = ref<boolean>(false);

const lockCursor = () => {
    locked.value = true;
};

const unlockCursor = () => {
    locked.value = false;
};

defineExpose({
    lockCursor,
    unlockCursor,
    locked,
});
</script>
