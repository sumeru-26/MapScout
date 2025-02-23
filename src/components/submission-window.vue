<script setup>

    import { ref, watch } from 'vue'

    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '@/components/ui/card'

    const { inputList, openState } = defineProps(['inputList', 'openState'])

    const state = ref('')

    const test = ref('asdf')

    watch(() => openState, (_, newState) => {
        // console.log(newState)
        if (openState) {
            compile()
        }
    })

    function compile() {
        
        state.value = 'json'

        var data = {
            'start': '',
            'auto': {
                'intake': {
                    'top': 0,
                    'bottom': 0,
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
                    'algae': 0
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
                    'top': 0,
                    'bottom': 0,
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
    }

    for (const input of inputList) {
        const inputType = input.split(':')[0]
        
    }

</script>

<template>
    <Card class="h-full bg-background">
        <CardHeader>
            <CardTitle>Submission</CardTitle>
            <CardDescription>Your scouting manager will scan these</CardDescription>
        </CardHeader>
    <CardContent>
    {{ state }}
    </CardContent>
    <CardFooter>
    Card Footer
    </CardFooter>
  </Card>
</template>