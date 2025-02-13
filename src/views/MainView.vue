<script setup>

  import { ref, computed, watch } from 'vue'

  import { Switch } from '@/components/ui/switch';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  import { Check, X, Circle, PersonStanding, Bot } from 'lucide-vue-next';

  const fieldSide = ref('left')

  const brickedInput = ref(false)

  const matchStarted = ref(false)

  const reefButtonState = ref('reef')
  const processorButtonState = ref('processor')
  const climbButtonState = ref('climb')
  const netButtonState = ref('net')
  
  const autoState = ref(false)
  const autoCountdown = ref(25)
  const autoStarted = ref(false)
  const autoEnded = ref(false)

  function tick() {
    autoCountdown.value -= .01
    console.log('tick')
  }

  async function beginAutoCountdown() {
    if (autoStarted.value && !autoEnded.value) {
      autoState.value = false
      autoCountdown.value = 25
      autoEnded.value = true
      autoEnded.value = true
    }
    autoStarted.value = true
    autoState.value = true
    console.log('began')
    const intervalId = setInterval(tick, 10)
    setTimeout(() => {
      clearInterval(intervalId)
      autoState.value = false
      autoCountdown.value = 25
      autoEnded.value = true
    }, 25000)
  }

  const imgClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'img-left-half' : 'img-right-half')} h-screen w-screen`
  })
  const reefButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-57/200' : 'right-57/200')} top-22/50 w-1/14 h-1/8`
  })
  const reefLevelsDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-99/400' : 'right-99/400')} top-47/100`
  })
  const reefScoredDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-105/400' : 'right-105/400')} top-47/100`
  })
  const startFarButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-69/160' : 'right-69/160')} top-29/100`
  })
  const startMidButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-68/160' : 'right-68/160')} top-47/100`
  })
  const startCloseButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-67/160' : 'right-67/160')} top-65/100`
  })
  const intakeTopButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-25/200' : 'right-25/200')} top-8/50 w-1/13 h-1/16 ${fieldSide.value == 'left' ? '-rotate-35' : 'rotate-35'}`
  })
  const intakeBottomButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-25/200' : 'right-25/200')} top-39/50 w-1/13 h-1/16 ${fieldSide.value == 'left' ? 'rotate-35' : '-rotate-35'}`
  })
  const netShotButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-333/800' : 'right-333/800'} top-65/100 w-1/7 h-1/17 ${fieldSide.value == 'left' ? 'rotate-90' : '-rotate-90'}`
  })
  const netButtonsDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-94/200' : 'right-94/200'} top-56/100 grid grid-rows-2 gap-y-16`
  })
  const crossedFieldButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-50/100' : 'right-50/100'} top-249/400 w-1/10 h-1/8 ${fieldSide.value == 'left' ? 'rotate-90' : '-rotate-90'}`
  })
  const endgameButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-333/800' : 'right-333/800'} top-29/100 w-1/7 h-1/17 ${fieldSide.value == 'left' ? 'rotate-90' : '-rotate-90'}`
  })
  const climbStateDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-175/400' : 'right-175/400'} top-39/200 w-1/16 grid grid-rows-3 gap-y-4`
  })
  const processorButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-73/200' : 'right-73/200'} top-90/100 w-1/10`
  })
  const processorScoredDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-75/200' : 'right-75/200'} top-90/100`
  })

</script>

<template>
  <img src="/src/public/full_field_transparent_bg.png" :class="imgClass">
  
  <div v-if="!matchStarted">
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true }" :class="startFarButtonClass">Far</Button>
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true }" :class="startMidButtonClass">Mid</Button>
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true }" :class="startCloseButtonClass">Close</Button>
  </div>
  <div v-if="matchStarted">
    <Button v-if="reefButtonState=='reef'" @click.stop.prevent="reefButtonState='levels'" variant="outline" :class="reefButtonClass">Reef</Button>
    <div v-if="reefButtonState=='levels'" :class="reefLevelsDivClass">
      <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L1</Button>
      <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L2</Button>
      <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L3</Button>
      <Button @click.stop.prevent="reefButtonState='scored'" variant="outline" class="h-1/4">L4</Button>
    </div>
    <div v-if="reefButtonState=='scored'" :class="reefScoredDivClass">
      <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
        <X color="red" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="reefButtonState='reef'" variant="outline" class="h-1/4">
        <Circle color="#2bbd98" class="w-4 h-4" />
      </Button>
    </div>
    <Button variant="outline" :class="intakeTopButtonClass">Intake</Button>
    <Button variant="outline" :class="intakeBottomButtonClass">Intake</Button>
    <Button variant="outline" class="absolute w-1/11 h-1/8 left-15/100 top-44/100">Ground Intake</Button>
    <Button v-if="netButtonState=='net'" @click.stop.prevent="netButtonState='player'" variant="outline" :class="netShotButtonClass">Net Shot</Button>
    <div v-if="netButtonState=='player'" :class="netButtonsDivClass">
      <Button @click.stop.prevent="netButtonState='scored'" variant="outline" class="">
        <PersonStanding color="tan" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="netButtonState='scored'" variant="outline" class="">
        <Bot class="w-4 h-4" />
      </Button>
    </div>
    <div v-if="netButtonState=='scored'" :class="netButtonsDivClass">
      <Button @click.stop.prevent="netButtonState='net'" variant="outline" class="">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="netButtonState='net'" variant="outline" class="">
        <X color="red" class="w-4 h-4" />
      </Button>
    </div>
    <Button variant="outline" :class="crossedFieldButtonClass">Crossed Field</Button>
    <Button v-if="climbButtonState=='climb'" @click.stop.prevent="climbButtonState='state'" variant="outline" :class="endgameButtonClass">Endgame</Button>
    <div v-if="climbButtonState=='state'" :class="climbStateDivClass">
      <Button @click.stop.prevent="climbButtonState='climb'" variant="outline" class="">Deep</Button>
      <Button @click.stop.prevent="climbButtonState='climb'" variant="outline" class="">Shallow</Button>
      <Button @click.stop.prevent="climbButtonState='climb'" variant="outline" class="">Park</Button>
    </div>
    <Button v-if="processorButtonState=='processor'" @click.stop.prevent="processorButtonState='scored'" variant="outline" :class="processorButtonClass">Processor</Button>
    <div v-if="processorButtonState=='scored'" :class="processorScoredDivClass">
      <Button @click.stop.prevent="processorButtonState='processor'" variant="outline" class="h-1/4">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="processorButtonState='processor'" variant="outline" class="h-1/4">
        <X color="red" class="w-4 h-4" />
      </Button>
    </div>
  </div>
  
  
  
  <div class="absolute left-1/2 w-1/2 p-5">
    <div class="my-4 flex gap-x-4">
      <div class="grow grid gap-2">
        <Label for="team">Team</Label>
        <Input id="team" type="number" max="11000" placeholder="Team #" />
      </div>
      <div class="grow grid gap-2">
        <Label for="match">Match</Label>
        <Input id="match" type="number" max="200" placeholder="Match #" />
      </div>
    </div>
    <div class="my-4 flex items-center gap-x-4">
      <div class="grow grid gap-2">
        <Label for="hpTeam">Processor Human Player</Label>
        <Input id="hpTeam" type="number" max="11000" placeholder="Human Player Team #" />
      </div>
      <Button :disabled="autoEnded" @click.stop.prevent="beginAutoCountdown()" :variant="(!autoEnded && autoState) ? '' : 'outline'" class="grow">Auto {{ (!autoEnded && autoState) ? `- ${autoCountdown.toFixed(2)}` : '' }}</Button>
    </div>
    <div class="my-4 flex items-center space-x-2">
      <Switch id="bricked" v-model:checked="brickedInput" :default-checked="true" />
      <Label for="bricked">Bricked</Label>
      <div class="ml-5 grow grid gap-1.5">
        <Label for="brickedReason">Reason</Label>
        <Input id="brickedReason" :disabled="!brickedInput" placeholder="Why are they bricked? (keep it brief)" />
      </div>
    </div>
  </div>
</template>