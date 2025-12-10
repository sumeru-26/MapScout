<script setup>

    import { ref, watch, computed } from 'vue'

    import VueQrcode from '@chenfengyuan/vue-qrcode'

    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '@/components/ui/card'
    import { Button } from '@/components/ui/button';

    const { inputList, openState, bot, match, brickedStatus, brickedReason } = defineProps(['inputList', 'openState', 'bot', 'match','brickedStatus', 'brickedReason'])

    const state = ref('')
    const errorMessage = ref('')
    const debugData = ref({})

    const entry = ref()
    const entryEncoded = computed(() => {
        return btoa(JSON.stringify(entry.value))
    })

    watch(() => openState, (_, newState) => {
        // console.log(newState)
        if (openState) {
            compile()
        }
    })

    function compile() {

        console.log(inputList)
        
        state.value = 'compiling'


        var metadata = {
            'event': localStorage.getItem('event'),
            'type': 'match',
            'match': match,
            'team': localStorage.getItem('team'),
            'bot': bot,
            'scouter': localStorage.getItem('name'),
        }
        var data = {
            'auto': {
                'carrot': {
                    'hit': 0,
                    'miss': 0
                },
                'cabbage': 0,
                'robot': {
                    'hit': 0,
                    'miss': 0
                }
            },
            'teleop': {
                'carrot': {
                    'hit': 0,
                    'miss': 0
                },
                'cabbage': 0,
                'robot': {
                    'hit': 0,
                    'miss': 0
                }
            },
            'endgame': '',
            'bricked': {
                'status': brickedStatus,
                'reason': brickedReason
            }
        }

        try {

            for (let input of inputList) {
                const autoInput = input.includes('auto')
                if (autoInput) {
                    input = input.split('^')[1]
                    // console.log(input)
                }
                const inputSegs = input.split(':')
                console.log(inputSegs)
                const inputType = inputSegs[0]
                const period = (autoInput) ? 'auto' : 'teleop'

                if (inputType == 'carrot') {
                    const result = inputSegs[1]
                    if (result && data[period]['carrot'][result] !== undefined) {
                        data[period]['carrot'][result]++
                    }
                } else if (inputType == 'cabbage') {
                    data[period]['cabbage']++
                } else if (inputType == 'robot') {
                    const result = inputSegs[1]
                    if (result && data[period]['robot'][result] !== undefined) {
                        data[period]['robot'][result]++
                    }
                }
            }

            entry.value = {
                'metadata': metadata,
                'data': data
            }

        } catch(error) {
            console.error(error)
            errorMessage.value = error
        }

        console.log(entry.value)
        debugData.value = entry.value

        state.value = 'done'

    }

    

    

</script>

<template>
    <Card class="h-full bg-background">
        <CardHeader>
            <CardTitle>Submission</CardTitle>
            <CardDescription>Your scouting manager will scan these</CardDescription>
        </CardHeader>
    <CardContent>
        <p class=" text-red-700 px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">
            {{ errorMessage }}
        </p>
        <div v-if="state=='done'" class="w-full h-full flex items-center justify-center">
            <VueQrcode :value="entryEncoded" :options="{
                width: 450,
                color: {
                    light: 	'#fafafa',
                    dark: 	'#09090b'
                }
            }"></VueQrcode>
        </div>
        <!-- <pre class=" text-muted-foreground px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">{{ JSON.stringify(inputList, null, '\t') }}</pre> -->
        <!-- <pre class=" text-muted-foreground px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">{{ JSON.stringify(debugData, null, '\t') }}</pre> -->
    </CardContent>
    <CardFooter>
        <div class="w-full flex justify-end">
            <Button @click.stop.prevent="$emit('closeWindow')">Return</Button>
        </div>
    </CardFooter>
  </Card>
</template>