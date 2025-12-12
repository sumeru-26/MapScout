<script setup>

  import { ref, computed, watch, onMounted } from 'vue'

  import { useRouter } from 'vue-router'

  import { Switch } from '@/components/ui/switch';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'


  import { Carrot, X, Circle, Bot, Undo2, Redo2 } from 'lucide-vue-next';
  import DebugWindow from '@/components/debug-window.vue';
  import SubmissionWindow from '@/components/submission-window.vue';

  const router = useRouter()

  const inputList = ref([])
  var redoCache = []

  const fieldBool = ref(false)
  const fieldSide = computed(() => {
    if (fieldBool.value) {
      return 'right'
    } else {
      return 'left'
    }
  })

  const teamInput = ref()
  const matchInput = ref()
  const brickedInput = ref(false)
  const brickedReason = ref('')
  const teamOptions = ref([])
  watch(brickedInput, (_, newState) => {
      if (newState) {
        brickedReason.value = ''
      }
  })
  watch(matchInput, (match, _) => {
    if (!isNaN(match) && match > 0) {
      console.log('Match input changed to:', match)
      const matchesArr = JSON.parse(localStorage.getItem('matches'))
      const matchArr = matchesArr.find((entry) => entry.comp_level == "qm" && entry.match_number == match)
      console.log(matchArr)
      const blueAll = matchArr.alliances.blue.team_keys
      blueAll.forEach((key, i) => {
        blueAll[i] = parseInt(key.substring(3))
      })
      const redAll = matchArr.alliances.red.team_keys
      redAll.forEach((key, i) => {
        redAll[i] = parseInt(key.substring(3))
      })
      teamOptions.value = blueAll.concat(redAll)
      console.log(teamOptions.value)
    } else {
      teamOptions.value = []
      teamInput.value = NaN
    }
  })

  const autoState = ref(false)
  const autoCountdown = ref(25)
  const autoStarted = ref(false)
  const autoEnded = ref(false)
  const submitState = ref(false)
  const logOutState = ref(false)

  const carrotHitCount = ref(0)
  const carrotMissCount = ref(0)
  const cabbageScoredCount = ref(0)
  const robotHitCount = ref(0)
  const robotMissCount = ref(0)

  async function beginAutoCountdown() {
    if (autoStarted.value && !autoEnded.value) {
      autoState.value = false
      autoCountdown.value = 25
      autoEnded.value = true
    }
    autoStarted.value = true
    autoState.value = true
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

  function recordScoutingEvent(eventKey) {
    const payload = (!autoEnded.value) ? `auto^${eventKey}` : eventKey
    inputList.value.push(payload)
    adjustEventCount(eventKey, 1)
    redoCache = []
  }

  function adjustEventCount(eventKey, delta) {
    const mapping = {
      'carrot:hit': carrotHitCount,
      'carrot:miss': carrotMissCount,
      'cabbage:scored': cabbageScoredCount,
      'robot:hit': robotHitCount,
      'robot:miss': robotMissCount
    }

    const counter = mapping[eventKey]
    if (!counter) return
    counter.value = Math.max(0, counter.value + delta)
  }

  function normalizeEventKey(entry) {
    if (!entry) return ''
    return entry.includes('^') ? entry.split('^')[1] : entry
  }

  function resetEventCounts() {
    carrotHitCount.value = 0
    carrotMissCount.value = 0
    cabbageScoredCount.value = 0
    robotHitCount.value = 0
    robotMissCount.value = 0
  }

  function undo() {
    if (inputList.value.length > 1) {
      const deletedInput = inputList.value.pop()
      redoCache.push(deletedInput)
      adjustEventCount(normalizeEventKey(deletedInput), -1)
    } else if (inputList.value.length == 1) {
      reset()
    }
  }

  function redo() {
    if (redoCache.length > 0) {
      const restoredInput = redoCache.pop()
      inputList.value.push(restoredInput)
      adjustEventCount(normalizeEventKey(restoredInput), 1)
    }
  }

  function submit() {
    // inputList.value.push(`team:${teamInput.value}`)
    // inputList.value.push(`match:${matchInput.value}`)
    // inputList.value.push(`bricked:status:${brickedInput.value}`)
    // if (brickedInput.value) {
    //   inputList.value.push(`bricked:reason:${brickedReason.value}`)
    // }
    if (isNaN(teamInput.value) || teamInput.value <= 0) {
      alert('Please select a team.')
      return
    }
    submitState.value = true
  }

  function reset() {

    inputList.value = []
    redoCache = []
    resetEventCounts()

    submitState.value = false
    logOutState.value = false

    brickedInput.value = false
    brickedReason.value = ''

    autoState.value = false
    autoCountdown.value = 25
    autoStarted.value = false
    autoEnded.value = false

  }

  function logOut() {
    localStorage.clear()
    router.push('/login')
  }

  const imgClass = computed(() => {
    return `absolute ${((fieldSide.value == 'left') ? 'img-left-half' : 'img-right-half')} h-screen w-screen`
  })
  const swapButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-12/400' : 'right-12/400')} top-27/100 w-1/14 h-37/80`
  })
  const carrotHitButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-35/200' : 'right-35/200')} top-36/100 w-1/14 h-1/8 flex flex-col items-center justify-center gap-1`
  })
  const carrotMissButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left' ? 'left-35/200' : 'right-35/200')} top-26/50 w-1/14 h-1/8 flex flex-col items-center justify-center gap-1`
  })
  const cabbageScoredButtonClass = computed(() => {
    return `absolute w-1/15 h-1/8 ${(fieldSide.value == 'left' ? 'left-52/200' : 'right-59/200')} top-44/100 flex flex-col items-center justify-center gap-1`
  })
  const robotHitButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-29/100' : 'right-33/100'} top-77/100 w-1/14 h-1/8 flex flex-col items-center justify-center gap-1`
  })
  const robotMissButtonClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-43/200' : 'right-51/200'} top-77/100 w-1/14 h-1/8 flex flex-col items-center justify-center gap-1`
  })
  const sideMenuDivClass = computed(() => {
    return `absolute ${(fieldSide.value == 'left') ? 'left-1/2' : 'left-0'} w-1/2 p-5`
  })

</script>

<template>

  <img src="/src/public/2025_Bunnybots_Field.png" :class="imgClass">
  
  <Button variant="outline" @click.stop.prevent="fieldBool = !fieldBool" :class="swapButtonClass">Swap Sides</Button>
  <div>
    <Button variant="outline" :class="carrotHitButtonClass" @click.stop.prevent="recordScoutingEvent('carrot:hit')">
      <Carrot color="orange" class="w-5 h-5" />
    </Button>
    <Button variant="outline" :class="carrotMissButtonClass" @click.stop.prevent="recordScoutingEvent('carrot:miss')">
      <X color="red" class="w-5 h-5" />
    </Button>
    <Button variant="outline" :class="cabbageScoredButtonClass" @click.stop.prevent="recordScoutingEvent('cabbage:scored')">
      <Circle color="#2bbd98" fill="#2bbd98" class="w-5 h-5" />
    </Button>
    <Button variant="outline" :class="robotHitButtonClass" @click.stop.prevent="recordScoutingEvent('robot:hit')">
      <Bot class="w-5 h-5" />
    </Button>
    <Button variant="outline" :class="robotMissButtonClass" @click.stop.prevent="recordScoutingEvent('robot:miss')">
      <X color="red" class="w-5 h-5" />
    </Button>
  </div>

  <div :class="sideMenuDivClass">
    <div class="my-4 flex gap-x-4">
      <div class="grow grid gap-2">
        <Label for="match">Match</Label>
        <Input v-model="matchInput" id="match" type="number" min="0" max="200" placeholder="Match #" autocomplete="off" />
      </div>
      <div class="grow grid gap-2">
        
        <Label for="team">Team</Label>
        <Input id="team" v-model="teamInput" placeholder="js put the team # twin ✌️" autocomplete="off" />
        <!-- <DropdownMenu>
          <DropdownMenuTrigger>
            <Button class="w-full">{{ (!isNaN(teamInput)) ? teamInput : "None Selected" }}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <RadioGroup v-model="teamInput" id="team" class="grid gap-2">
              <div v-for="team in teamOptions" :key="team">
                <Label :for="'team' + team" class="flex items-center">
                  <RadioGroupItem :id="'team' + team" :value="team" @click.stop.prevent="console.log(asdf)" />
                  <span class="ml-2">{{ team }}</span>
                </Label>
              </div>
            </RadioGroup>
          </DropdownMenuContent>
        </DropdownMenu> -->
        <!--  -->
      </div>
    </div>
    <div class="my-4 flex items-center gap-x-4">
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
    <div class="">
      <DebugWindow :input-list="inputList" class="w-full h-32" />
      <div class="my-4 flex gap-x-2">
        <Button @click.stop.prevent="undo()" variant="outline" class="grow">
          <Undo2 />
        </Button>
        <Button @click.stop.prevent="redo()" variant="outline" class="grow">
          <Redo2 />
        </Button>
      </div>
    </div>
    <div class="flex gap-x-2">
      <Button class="grow" @click.stop.prevent="submit()">Submit</Button>
      <Button @click.stop.prevent="reset()" variant="outline" class="grow">Reset</Button>
    </div>
    <Button v-if="!logOutState" @click.stop.prevent="logOutState = true" variant="outline" class="my-4 w-full">Log Out</Button>
    <div v-if="logOutState" class="my-4 flex gap-x-2">
      <Button @click.stop.prevent="logOut()" variant="destructive" class="grow">Are you sure?</Button>
      <Button @click.stop.prevent="logOutState = false" class="grow">No</Button>
    </div>
  </div>
  <div v-show="submitState" class="absolute h-screen w-screen bg-background opacity-75"></div>
  <div v-show="submitState" class="absolute h-screen w-screen p-25">
    <!-- <div class="absolute h-full w-full bg-background opacity-100 z-10"></div> -->
    <SubmissionWindow :input-list="inputList"
      :open-state="submitState"
      @close-window="submitState = false"
      :bot="teamInput"
      :match="matchInput"
      :bricked-status="brickedInput"
      :bricked-reason="brickedReason"
      class="h-full w-full z-50" />
  </div>
  
</template>