<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { Button } from '@/components/ui/button'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { Separator } from '@/components/ui/separator'
    import { ScanQrCode, X } from 'lucide-vue-next'
    import { QrcodeStream } from 'vue-qrcode-reader'

    const router = useRouter()

    const code = ref('')
    const name = ref('')
    const showScanner = ref(false)
    const hasCamera = ref(false)
    const errorMessage = ref('')

    function submit() {
        // console.log(code.value)
        try {
            const decoded = atob(code.value)
            // console.log(decoded)
            const [team, event] = decoded.split(' ')
            
            if (!team || !event) {
                alert('Invalid QR code format')
                return
            }
            
            localStorage.setItem('team', team)
            localStorage.setItem('event', event)
            localStorage.setItem('name', name.value)
            // console.log(localStorage.getItem('team'))
            // console.log(localStorage.getItem('event'))
            // console.log(localStorage.getItem('name'))
            
            router.push('/')
        } catch (error) {
            alert('Invalid code format. Please try again.')
            console.error(error)
        }
    }

    function onDecode(result) {
        console.log(result[0].rawValue)
        code.value = result[0].rawValue
        showScanner.value = false
    }

    function onScannerError(error) {
        console.error(error)
        
        switch(error.name) {
            case 'NotAllowedError':
                errorMessage.value = 'Camera permission denied'
                break
            case 'NotFoundError':
                errorMessage.value = 'No camera found'
                break
            case 'NotReadableError':
                errorMessage.value = 'Camera already in use'
                break
            default:
                errorMessage.value = 'Error accessing camera: ' + error.message
        }
        
        hasCamera.value = false
    }
    
    function startScanner() {
        showScanner.value = true
        errorMessage.value = ''
        hasCamera.value = true
    }

    function paintBoundingBox(detectedCodes, ctx) {
        for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height }
        } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
        }
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
                    <Label for="code">Code</Label>
                    <Input id="code" type="text" v-model="code" placeholder="Enter the code given by your head scout" />
                </div>
                <Separator label="or" />
                <Button @click="startScanner">
                    Scan QR code <ScanQrCode class="w-4 h-4 ml-2" />
                </Button>
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input id="name" type="text" v-model="name" placeholder="Full Name (e.g. John Smith)" />
                </div>
            </CardContent>
            <CardFooter>
                <Button class="w-full" @click="submit">
                    Sign in
                </Button>
            </CardFooter>
        </Card>

        <!-- QR Code Scanner Modal -->
        <div v-if="showScanner" class="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-background p-4 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Scan QR Code</h3>
                    <Button variant="destructive" size="icon" @click="showScanner = false">
                        <X class="h-4 w-4" />
                    </Button>
                </div>
                <div v-if="errorMessage" class="text-red-500 mb-4 text-center">
                    {{ errorMessage }}
                </div>
                <div v-if="hasCamera" class="aspect-square overflow-hidden rounded-lg mb-4">
                    <qrcode-stream @detect="onDecode" @error="onScannerError" :track="paintBoundingBox" />
                </div>
                <p v-if="hasCamera" class="text-sm text-muted-foreground text-center">Position the QR code within the frame</p>
                <Button v-if="errorMessage" class="w-full mt-2" @click="startScanner">
                    Retry Camera Access
                </Button>
            </div>
        </div>
    </div>
</template>
