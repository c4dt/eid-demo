<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import {createConnection} from "~/composables/IndyAPI";

const props = defineProps(['connectionUserName'])
const emit = defineEmits(['walletConnectionEstablished'])
const connectionUserName = props.connectionUserName

const invitationLink = ref('')

if (invitationLink.value) {
  console.log("We got a value!")
}

const generateQRCodeForConnection = () => {
  createConnection(connectionUserName).then((invitation) => {
    console.log("invitation.....")
    invitationLink.value = invitation
  })
  const connectionID = "1234567890"
  setTimeout(() => {
    emit('walletConnectionEstablished', connectionID);
  }, 6000)

}

</script>

<template>
  <div  class="flex items-center justify-center gap-x-6">
    <p>Generate Verifiable Credential for {{connectionUserName}}?</p>
    <button type="button" @click="generateQRCodeForConnection" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate</button>
  </div>

  <div v-if="invitationLink" class="flex-auto text-center">
    Please scan this QR code to initiate your diploma verification!
    <br><br>
    <qrcode-vue class="mx-auto" :value="invitationLink" level="H" size="300" render-as="svg"/>
  </div>
</template>
