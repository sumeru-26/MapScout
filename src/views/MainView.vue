<script setup>

  import { ref } from 'vue'

  import { Switch } from '@/components/ui/switch';
  import { Label } from '@/components/ui/label';


  const imgClass = ref('absolute img-right-half h-screen')
  const fieldButtonDivClass = ref('absolute left-0 h-screen')

</script>

<template>
  <img src="/src/public/full_field_transparent_bg.png" :class="imgClass">
  <div :class="imgClass">
    <Button>reef</Button>
  </div>
</template>
