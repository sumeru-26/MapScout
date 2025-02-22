<script setup>

    import { computed } from 'vue'

    const { inputList } = defineProps(['inputList'])

    const debugMessage = computed(() => {
        var x = ''
        for (const a of inputList.toReversed()) {
            x += a+'\n'
        }
        return x
    })



</script>

<template>
    <textarea disabled class="resize-none overflow-hidden rounded bg-muted text-muted-foreground px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">{{ debugMessage }}</textarea>
</template>