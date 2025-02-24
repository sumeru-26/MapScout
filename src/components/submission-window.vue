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

    const { inputList, openState } = defineProps(['inputList', 'openState'])

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
            'event': '2025test',
            'type': 'match',
            'match': 0,
            'team': '2374',
            'bot': 0
        }
        var data = {
            'start': '',
            'auto': {
                'intake': {
                    'station': {
                        'top': 0,
                        'bottom': 0,
                    },
                    'ground': {
                        'coral': 0,
                        'algae': 0
                    }
                },
                'reef': {
                    'l1': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l2': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l3': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l4': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'algae': 0,
                },
                'processor': {
                    'hit': 0,
                    'miss': 0
                },
                'net': {
                    'hit': 0,
                    'miss': 0
                },
                'crossed': 0,
            },
            'teleop': {
                'intake': {
                    'station': {
                        'top': 0,
                        'bottom': 0,
                    },
                    'ground': {
                        'coral': 0,
                        'algae': 0
                    }
                },
                'reef': {
                    'l1': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l2': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l3': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'l4': {
                        'hit': 0,
                        'miss': 0,
                    },
                    'algae': 0,
                },
                'processor': {
                    'hit': 0,
                    'miss': 0
                },
                'net': {
                    'hit': 0,
                    'miss': 0
                },
                'crossed': 0,
            },
            'endgame': '',
            'bricked': {
                'status': false,
                'reason': ''
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
                if (inputType == 'start') {
                    data['start'] = inputSegs[1]
                } else if (inputType == 'reef') {
                    if (inputSegs[1] == 'algae') {
                        data[(autoInput) ? 'auto' : 'teleop']['reef']['algae']++
                    } else {
                        data[(autoInput) ? 'auto' : 'teleop']['reef'][`l${inputSegs[1]}`][inputSegs[2]]++
                    }
                } else if (inputType == 'intake') {
                    if (inputSegs[1] == 'station') {
                        data[(autoInput) ? 'auto' : 'teleop']['intake']['station'][inputSegs[2]]++
                    } else if (inputSegs[1] == 'ground') {
                        data[(autoInput) ? 'auto' : 'teleop']['intake']['ground'][inputSegs[2]]++
                    }
                } else if (inputType == 'net') {
                    data[(autoInput) ? 'auto' : 'teleop']['net'][inputSegs[1]]++
                } else if (inputType == 'crossed') {
                    data[(autoInput) ? 'auto' : 'teleop']['crossed']++
                } else if (inputType == 'climb') {
                    data['endgame'] = inputSegs[1]
                } else if (inputType == 'processor') {
                    data[(autoInput) ? 'auto' : 'teleop']['processor'][inputSegs[1]]++
                } else if (inputType == 'team') {
                    metadata['bot'] = inputSegs[1]
                } else if (inputType == 'match') {
                    metadata['match'] = inputSegs[1]
                } else if (inputType == 'bricked') {
                    if (inputSegs[1] == 'status') {
                        data['bricked']['status'] = (inputSegs[2] == 'true')
                    } else if (inputSegs[1] == 'reason') {
                        data['bricked']['reason'] = inputSegs[2]
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
                    dark: 	'#fafafa',
                    light: 	'#09090b'
                }
            }"></VueQrcode>
        </div>
        <!-- <pre class=" text-muted-foreground px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">{{ JSON.stringify(inputList, null, '\t') }}</pre> -->
        <!-- <pre class=" text-muted-foreground px-[0.3rem] py-[0.2rem] font-mono text-sm font-extralight">{{ JSON.stringify(debugData, null, '\t') }}</pre> -->
    </CardContent>
    <CardFooter>
        <div class="w-full flex justify-end">
            <Button @click.stop.prevent="$emit('resetForm')">Return</Button>
        </div>
    </CardFooter>
  </Card>
</template>