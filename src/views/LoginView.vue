<script setup>

    import { ref } from 'vue'

    import { Button } from '@/components/ui/button'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { Separator } from '@/components/ui/separator'

    import { ScanQrCode } from 'lucide-vue-next'

    function submit() {
        console.log(code.value)
        const decoded = atob(code.value)
        console.log(decoded)
        const [key, event, type] = decoded.split(' ')
        const test = fetch("https://api.scoutalliance.live/", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                "X-SA-Auth-Key": key,
            }
        })
        console.log(test)
    }

</script>

<template>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter the event code for your team to begin scouting.
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="email">Code</Label>
                    <Input id="code" type="text" placeholder="Enter the code given by your head scout" />
                </div>
                <Button class="w-full" @click.stop.prevent="submit()" v-model="code">
                    Sign in
                </Button>
                <Separator label="or" />
                <Button disabled>
                    Scan QR code <ScanQrCode class="w-4 h-4 mr-2" />
                </Button>
            </CardContent>
            <CardFooter>
                
            </CardFooter>
        </Card>
    </div>
</template>
