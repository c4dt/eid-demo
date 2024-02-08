<script setup lang="ts">
import { ref } from 'vue'
import {checkProofRequestIsAccepted, sendProofRequest} from "~/composables/IndyAPI";

const props = defineProps(['connectionID'])
const emit = defineEmits(['verifiableCredentialProof', 'addToLog'])
const connectionID = props.connectionID
const proofRequestID = ref('')

const sendVCProofRequest = () => {
  sendProofRequest(connectionID).then((presentation_exchange_id) => {
    proofRequestID.value = presentation_exchange_id
    emit('addToLog', 'Sent request for proof', 'Verifier', 'Wallet')
  })
}

async function checkForAcceptedProofRequest(): Promise<boolean|undefined> {
  if (!proofRequestID.value) {
    console.log("Waiting for proof request to be created!")
    return
  }
  return checkProofRequestIsAccepted(proofRequestID.value).then(({isAccepted, data}) => {
    if (isAccepted) {
      console.log("Proof Request Accepted!")
      emit('verifiableCredentialProof', data)
      return true
    }
  })
}

async function checkForAcceptedProofRequestInterval() {
  await checkForAcceptedProofRequest().then((isAccepted) => {
    if (isAccepted) {
      console.log(`clearing interval: ${createdInterval}`)
      clearInterval(createdInterval)
    }
  })
}
const createdInterval = setInterval(checkForAcceptedProofRequestInterval, 3000);
</script>

<template>
  <div v-if="!proofRequestID" class="flex items-center justify-center gap-x-6">
    <p>Diploma Verifiable Credential request</p>
    <button type="button" @click="sendVCProofRequest" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send request</button>
  </div>

  <div v-if="proofRequestID" class="flex-auto text-center">
    Waiting for proof Request to be accepted!
  </div>
</template>
