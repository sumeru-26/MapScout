<script setup>

  import { ref, computed, watch } from 'vue'

  import { Switch } from '@/components/ui/switch';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  import { Check, X, Circle, PersonStanding, Bot, Undo2, Redo2 } from 'lucide-vue-next';
import DebugWindow from '@/components/debug-window.vue';

  const inputList = ref([])
  var redoCache = []

  function update(input) {
    var x = ''
    const inputType = input.split(':')[0]
    if (inputType == 'start') {
      inputList.value.push(input)
      return
    }
    if (inputType == 'reef') {
      if (reefActionInput.value == 'algae') x = 'reef:algae'
      else x = `reef:${reefLevelInput.value}:${reefActionInput.value}`
      reefLevelInput.value = ''
      reefActionInput.value = ''
    } else if (inputType == 'net') {
      x = `net:${netTypeInput.value}:${netScoredInput.value}`
      netTypeInput.value = ''
      netScoredInput.value = ''
    } else {
      x = input
    }
    // console.log(inputList.value)
    if (!autoEnded.value) inputList.value.push(`auto:${x}`)
    else inputList.value.push(x)
  }

  function undo() {
    if (inputList.value.length > 0) {
    const deletedInput = inputList.value.pop()
    redoCache.push(deletedInput)
    }
  }

  function redo() {
    if (redoCache.length > 0) {
      const deletedInput = redoCache.pop()
      inputList.value.push(deletedInput)
    }
  }

  const fieldBool = ref(false)
  const fieldSide = computed(() => {
    if (fieldBool.value) {
      return 'right'
    } else {
      return 'left'
    }
  })

  const brickedInput = ref(false)
  const brickedReason = ref('')
  watch(brickedInput, (_, newState) => {
      if (newState) {
        brickedReason.value = ''
      }
  })

  const matchStarted = ref(false)

  const reefButtonState = ref('reef')
  const groundIntakeButtonState = ref('ground')
  const processorButtonState = ref('processor')
  const climbButtonState = ref('climb')
  const netButtonState = ref('net')

  const reefLevelInput = ref('')
  const reefActionInput = ref('')
  const netTypeInput = ref('')
  const netScoredInput = ref('')
  
  const autoState = ref(false)
  const autoCountdown = ref(25)
  const autoStarted = ref(false)
  const autoEnded = ref(false)

  async function beginAutoCountdown() {
    if (autoStarted.value && !autoEnded.value) {
      autoState.value = false
      autoCountdown.value = 25
      autoEnded.value = true
      autoEnded.value = true
    }
    autoStarted.value = true
    autoState.value = true
    // console.log('began')
    const intervalId = setInterval(tick, 10)
    setTimeout(() => {
      clearInterval(intervalId)
      autoState.value = false
      autoCountdown.value = 25
      autoEnded.value = true
    }, 25000)
  }

  function tick() {
    autoCountdown.value -= .01
    // console.log('tick')
  }

  function reset() {

    inputList.value = []
    redoCache = []

    brickedInput.value = false
    brickedReason.value = ''

    matchStarted.value = false

    reefButtonState.value = 'reef'
    groundIntakeButtonState.value = 'ground'
    processorButtonState.value = 'processor'
    climbButtonState.value = 'climb'
    netButtonState.value = 'net'

    reefLevelInput.value = ''
    reefActionInput.value = ''
    netTypeInput.value = ''
    netScoredInput.value = ''
    
    autoState.value = false
    autoCountdown.value = 25
    autoStarted.value = false
    autoEnded.value = false

  }

  const imgClass = computed(() => {
    return `absolute ${((fieldSide.value == 'left') ? 'img-left-half' : 'img-right-half')} h-screen w-screen`
  })
  const swapButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-12/400' : 'right-12/400')} top-27/100 w-1/14 h-37/80`
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
  const intakeGroundButtonClass = computed(() => {
    return `absolute w-1/11 h-1/8 ${(fieldSide.value == 'left' ? 'left-15/100' : 'right-15/100')} top-44/100`
  })
  const netShotButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-333/800' : 'right-333/800'} top-65/100 w-1/7 h-1/17 ${fieldSide.value == 'left' ? 'rotate-90' : '-rotate-90'}`
  })
  const netButtonsDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-94/200' : 'right-94/200'} top-56/100 grid grid-rows-2 gap-y-16`
  })
  const crossedFieldButtonClass = computed(() => {
    return `absolute z-50 ${(fieldSide.value == 'left') ? 'left-52/100' : 'right-52/100'} top-249/400 w-1/10 h-1/8 ${fieldSide.value == 'left' ? 'rotate-90' : '-rotate-90'}`
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
  const sideMenuDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-1/2' : 'left-0'} w-1/2 p-5`
  })

</script>

<template>

  <img src="/src/public/full_field_transparent_bg.png" :class="imgClass">
  
  <Button variant="outline" @click.stop.prevent="fieldBool = !fieldBool" :class="swapButtonClass">Swap Sides</Button>
  <div v-if="!matchStarted">
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true; update('start:far') }" :class="startFarButtonClass">Far</Button>
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true; update('start:mid') }" :class="startMidButtonClass">Mid</Button>
    <Button variant="outline" @click.stop.prevent="() => { matchStarted=true; update('start:close') }" :class="startCloseButtonClass">Close</Button>
  </div>
  <div v-if="matchStarted">
    <Button v-if="reefButtonState=='reef'" @click.stop.prevent="reefButtonState='levels'" variant="outline" :class="reefButtonClass">Reef</Button>
    <div v-if="reefButtonState=='levels'" :class="reefLevelsDivClass">
      <Button @click.stop.prevent="() => { reefButtonState='scored'; reefLevelInput='1' }" variant="outline" class="h-1/4">L1</Button>
      <Button @click.stop.prevent="() => { reefButtonState='scored'; reefLevelInput='2' }" variant="outline" class="h-1/4">L2</Button>
      <Button @click.stop.prevent="() => { reefButtonState='scored'; reefLevelInput='3' }" variant="outline" class="h-1/4">L3</Button>
      <Button @click.stop.prevent="() => { reefButtonState='scored'; reefLevelInput='4' }" variant="outline" class="h-1/4">L4</Button>
    </div>
    <div v-if="reefButtonState=='scored'" :class="reefScoredDivClass">
      <Button @click.stop.prevent="() => { reefButtonState='reef'; reefActionInput='hit'; update('reef') }" variant="outline" class="h-1/4">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { reefButtonState='reef'; reefActionInput='miss'; update('reef') }" variant="outline" class="h-1/4">
        <X color="red" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { reefButtonState='reef'; reefActionInput='algae'; update('reef') }" variant="outline" class="h-1/4">
        <Circle color="#2bbd98" fill="#2bbd98" class="w-4 h-4" />
      </Button>
    </div>
    <Button variant="outline" @click.stop.prevent="update('intake:station:top')" :class="intakeTopButtonClass">Intake</Button>
    <Button variant="outline" @click.stop.prevent="update('intake:station:bottom')" :class="intakeBottomButtonClass">Intake</Button>
    <Button v-if="groundIntakeButtonState=='ground'" @click.stop.prevent="groundIntakeButtonState='type'" variant="outline" :class="intakeGroundButtonClass">Ground Intake</Button>
    <div v-if="groundIntakeButtonState=='type'" class="absolute left-15/100 top-47/100">
      <Button @click.stop.prevent="() => { groundIntakeButtonState='ground'; update('intake:ground:coral') }" variant="outline" class="h-1/4">
        <Circle color="white" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { groundIntakeButtonState='ground'; update('intake:ground:algae') }" variant="outline" class="h-1/4">
        <Circle color="#2bbd98" fill="#2bbd98" class="w-4 h-4" />
      </Button>
    </div>
    <Button v-if="netButtonState=='net'" @click.stop.prevent="netButtonState='player'" variant="outline" :class="netShotButtonClass">Net Shot</Button>
    <div v-if="netButtonState=='player'" :class="netButtonsDivClass">
      <Button @click.stop.prevent="() => { netButtonState='scored'; netTypeInput='human' }" variant="outline" class="">
        <PersonStanding color="tan" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { netButtonState='scored'; netTypeInput='bot' }" variant="outline" class="">
        <Bot class="w-4 h-4" />
      </Button>
    </div>
    <div v-if="netButtonState=='scored'" :class="netButtonsDivClass">
      <Button @click.stop.prevent="() => { netButtonState='net'; netScoredInput='hit'; update('net') }" variant="outline" class="">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { netButtonState='net'; netScoredInput='miss'; update('net') }" variant="outline" class="">
        <X color="red" class="w-4 h-4" />
      </Button>
    </div>
    <Button @click.stop.prevent="update('crossed')" variant="outline" :class="crossedFieldButtonClass">Crossed Field</Button>
    <Button v-if="climbButtonState=='climb'" @click.stop.prevent="climbButtonState='state'" variant="outline" :class="endgameButtonClass">Endgame</Button>
    <div v-if="climbButtonState=='state'" :class="climbStateDivClass">
      <Button @click.stop.prevent="() => { climbButtonState='climb'; update('climb:deep') }" variant="outline" class="">Deep</Button>
      <Button @click.stop.prevent="() => { climbButtonState='climb'; update('climb:shallow') }" variant="outline" class="">Shallow</Button>
      <Button @click.stop.prevent="() => { climbButtonState='climb'; update('climb:park') }" variant="outline" class="">Park</Button>
    </div>
    <Button v-if="processorButtonState=='processor'" @click.stop.prevent="processorButtonState='scored'" variant="outline" :class="processorButtonClass">Processor</Button>
    <div v-if="processorButtonState=='scored'" :class="processorScoredDivClass">
      <Button @click.stop.prevent="() => { processorButtonState='processor'; update('processor:hit') }" variant="outline" class="h-1/4">
        <Check color="green" class="w-4 h-4" />
      </Button>
      <Button @click.stop.prevent="() => { processorButtonState='processor'; update('processor:miss') }" variant="outline" class="h-1/4">
        <X color="red" class="w-4 h-4" />
      </Button>
    </div>
  </div>

  <div :class="sideMenuDivClass">
    <div class="my-4 flex gap-x-4">
      <div class="grow grid gap-2">
        <Label for="team">Team</Label>
        <Input id="team" type="number" max="11000" placeholder="Team #" autocomplete="off" />
      </div>
      <div class="grow grid gap-2">
        <Label for="match">Match</Label>
        <Input id="match" type="number" min="0" max="200" placeholder="Match #" autocomplete="off" />
      </div>
    </div>
    <div class="my-4 flex items-center gap-x-4">
      <div class="grow grid gap-2">
        <Label for="hpTeam">Processor Human Player</Label>
        <Input id="hpTeam" type="number" max="11000" placeholder="Human Player Team #" autocomplete="off" />
      </div>
      <Button :disabled="autoEnded" @click.stop.prevent="beginAutoCountdown()" :variant="(!autoEnded && autoState) ? '' : 'outline'" class="grow">Auto {{ (!autoEnded && autoState) ? `- ${autoCountdown.toFixed(2)}` : '' }}</Button>
    </div>
    <div class="my-4 flex items-center space-x-2">
      <Switch id="bricked" v-model:checked="brickedInput" :default-checked="true" />
      <Label for="bricked">Bricked</Label>
      <div class="ml-5 grow grid gap-1.5">
        <Label for="brickedReason">Reason</Label>
        <Input id="brickedReason" :disabled="!brickedInput" v-model="brickedReason" placeholder="Why are they bricked? (keep it brief)" autocomplete="off" />
      </div>
    </div>
    <div class="ml-32">
      <DebugWindow :input-list="inputList" class="w-full h-32" />
      <div class="my-2 flex gap-x-2">
        <Button @click.stop.prevent="undo()" variant="outline" class="grow">
          <Undo2 />
        </Button>
        <Button @click.stop.prevent="redo()" variant="outline" class="grow">
          <Redo2 />
        </Button>
      </div>
    </div>
    <div class="flex gap-x-2">
      <Button class="grow">Submit</Button>
      <Button @click.stop.prevent="reset()" variant="outline" class="grow">Reset</Button>
    </div>
  </div>
</template>