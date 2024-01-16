<template>
  <div v-if="step===Step.CONNECTION_SETUP" class="flex items-center justify-center gap-x-6">
    <button type="button" @click="generateQRCodeForConnection" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate Verification QR Code!</button>
    <div v-if="invitationLink" class="flex-auto text-center">
      Please scan this QR code to initiate your diploma verification!
      <br><br>
      <qrcode-vue class="mx-auto" :value="invitationLink" level="H" size=300 render-as="svg"/>
    </div>
  </div>
  <div v-if="step===Step.REQUESTING_CREDENTIALS">Requesting Credentials...</div>
  <VerifierIndyWalletCredentialRequest v-if="step===Step.REQUESTING_CREDENTIALS" :connectionID="WalletConnectionID" @verifiable-credential-proof="displayProof"/>
  <div v-if="step===Step.DONE" class="flex center justify-center gap-x-6">
      <p>Subject: {{ proofRequestSubject }}</p>
      <p>Degree: {{ proofRequestDegree }}</p>
      <p>Document Number: {{ proofRequestDocumentNumber }}</p>
  </div>
</template>

<script setup lang="ts">
  import {ref} from "vue";
  import QrcodeVue from "qrcode.vue";
  import {checkInvitationIsAccepted, createConnection} from "~/composables/IndyAPI";
  import type {DiplomaSchema} from "~/composables/VerifiableCredential";

  enum Step {CONNECTION_SETUP, REQUESTING_CREDENTIALS, DONE}
  const step = ref(Step.CONNECTION_SETUP);
  const invitationLink = ref('')
  const WalletConnectionID = ref("");
  const proofRequestSubject = ref("");
  const proofRequestDegree = ref("");
  const proofRequestDocumentNumber = ref("");

  const generateQRCodeForConnection = () => {
    createConnection("Verifier!").then(({invitationURL, connectionID}) => {
      console.log(`invitation.....${invitationURL}`)
      invitationLink.value = invitationURL
      WalletConnectionID.value = connectionID
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
    return checkInvitationIsAccepted(WalletConnectionID.value).then((isAccepted) => {
      if (isAccepted) {
        console.log("Invitation accepted!")
        step.value = Step.REQUESTING_CREDENTIALS
        return true
      }
    })
  }

  async function manageIntervalForAcceptedInvitation() {
    await checkForAcceptedInvitation().then((isAccepted) => {
      if (isAccepted) {
        console.log(`clearing interval: ${createdInterval}`)
        clearInterval(createdInterval)
      }
    })
  }
  const createdInterval = setInterval(manageIntervalForAcceptedInvitation, 3000);

  async function displayProof(data) {
    step.value = Step.DONE
    proofRequestSubject.value = data.subject
    proofRequestDegree.value = data.degree
    proofRequestDocumentNumber.value = data.documentNumber
  }

</script>
