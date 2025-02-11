<script setup>

  import { ref, computed, watch } from 'vue'

  import { Switch } from '@/components/ui/switch';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';

  import { Check, X, Circle } from 'lucide-vue-next';

  const fieldSide = ref('left')

  const reefButtonState = ref('reef')
  const processorButtonState = ref('processor')
  const climbButtonState = ref('climb')

  const imgClass = computed(() => {
    return `absolute img-${fieldSide.value}-half h-screen w-screen`
  })
  const fieldButtonDivClass = computed(() => {
    return `absolute ${fieldSide.value}-0 h-screen`
  })
  const reefButtonClass = computed(() => {
    return `absolute ${fieldSide.value}-57/200 top-22/50 w-1/14 h-1/8`
  })
  const intakeTopButtonClass = computed(() => {
    return `absolute ${fieldSide.value}-25/200 top-8/50 w-1/13 h-1/16 ${fieldSide.value == 'left' ? '-' : ''}rotate-35`
  })
  const intakeBottomButtonClass = computed(() => {
    return `absolute ${fieldSide.value}-25/200 top-39/50 w-1/13 h-1/16 ${fieldSide.value == 'left' ? '' : '-'}rotate-35`
  })

</script>

<template>
  <img src="/src/public/full_field_transparent_bg.png" :class="imgClass">
  <Button v-if="reefButtonState=='reef'" @click.stop.prevent="reefButtonState='levels'" variant="outline" :class="reefButtonClass">Reef</Button>
  <div v-if="reefButtonState=='levels'" class="absolute left-99/400 top-47/100">
    <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L1</Button>
    <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L2</Button>
    <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L3</Button>
    <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L4</Button>
  </div>
  <div v-if="reefButtonState=='scored'" class="absolute left-105/400 top-47/100">
    <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
      <Check class="w-4 h-4" />
    </Button>
    <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
      <X class="w-4 h-4" />
    </Button>
    <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
      <Circle class="w-4 h-4" />
    </Button>
  </div>
  <Button variant="outline" :class="intakeTopButtonClass">Intake</Button>
  <Button variant="outline" :class="intakeBottomButtonClass">Intake</Button>
  <Button variant="outline" class="absolute left-69/160 top-29/100">Far</Button>
  <Button variant="outline" class="absolute left-68/160 top-47/100">Mid</Button>
  <Button variant="outline" class="absolute left-67/160 top-65/100">Close</Button>
  <Button variant="outline" class="absolute left-167/400 top-65/100 w-1/7 h-1/17 rotate-90">Crossed Field</Button>
  <Button v-if="climbButtonState=='climb'" @click.stop.prevent="climbButtonState='state'" variant="outline" class="absolute left-167/400 top-29/100 w-1/7 h-1/17 rotate-90">Climb</Button>
  <div v-if="climbButtonState=='state'" class="absolute left-167/400 top-29/100">
    
  </div>
  <Button v-if="processorButtonState=='processor'" @click.stop.prevent="processorButtonState='scored'" variant="outline" class="absolute left-73/200 top-90/100 w-1/10">Processor</Button>
  <div v-if="processorButtonState=='scored'" class="absolute left-75/200 top-90/100">
    <Button @click.stop.prevent="processorButtonState='processor'" variant="outline" class="h-1/4">
      <Check class="w-4 h-4" />
    </Button>
    <Button @click.stop.prevent="processorButtonState='processor'" variant="outline" class="h-1/4">
      <X class="w-4 h-4" />
    </Button>
  </div>
  <div :class="fieldButtonDivClass">
    <!-- <Button class="absolute inset-0">Reef</Button> -->
  </div>
</template>