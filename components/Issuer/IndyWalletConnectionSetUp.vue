<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import {checkInvitationIsAccepted, createConnection} from "~/composables/IndyAPI";

const props = defineProps(['connectionUserName'])
const emit = defineEmits(['walletConnectionEstablished', 'addToLog'])
const connectionUserName = props.connectionUserName

const invitationLink = ref('')
let WalletConnectionID: string|null = null

const generateQRCodeForConnection = () => {
  createConnection(true).then(({invitationURL, connectionID}) => {
    console.log(`invitation.....${invitationURL}`)
    invitationLink.value = invitationURL
    WalletConnectionID = connectionID
    emit('addToLog', '[Issuer] Creating connection QRCode')
  })
}

async function checkForAcceptedInvitation(): Promise<boolean|undefined> {
  if (!invitationLink.value) {
    console.log("Waiting for invitation to be created!")
    return
  }
  if (!WalletConnectionID) {
    console.log("Invitation not accepted yet!")
    return
  }
  return checkInvitationIsAccepted(WalletConnectionID, true).then((isAccepted) => {
    if (isAccepted) {
      console.log("Invitation accepted!")
      emit('walletConnectionEstablished', WalletConnectionID)
      return true
    }
  })
}
async function checkForAcceptedInvitationInterval() {
  await checkForAcceptedInvitation().then((isAccepted) => {
    if (isAccepted) {
      console.log(`clearing interval: ${createdInterval}`)
      clearInterval(createdInterval)
    }
  })
}
const createdInterval = setInterval(checkForAcceptedInvitationInterval, 3000);

</script>

<template>
  <div  class="flex items-center justify-center gap-x-6">
    <p>Generate Verifiable Credential for {{connectionUserName}}?</p>
    <button type="button" @click="generateQRCodeForConnection" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate</button>
  </div>

  <div v-if="invitationLink" class="flex-auto text-center">
      Please scan this QR code to initiate your diploma verification!
    <br><br>
    <qrcode-vue class="mx-auto" :value="invitationLink" level="H" size=300 render-as="svg"/>
  </div>
</template>
