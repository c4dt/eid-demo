<template>
  <div class="flex items-center bg-gray-100">
    <nav class="text-sm sm:text-base bg-white p-2 md:p-2 lg:p-4 rounded-md shadow-lg">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center">
          <svg onclick="window.location.href='/verifier';" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" class="cursor-pointer hover:fill-blue-500 transition-colors duration-300" fill="#4b5563">
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
          </svg>
          <a href="/verifier" class="text-gray-600 hover:text-blue-500 transition-colors duration-300">Home</a>
          <span class="mx-2">/</span>
        </li>
        <li class="flex items-center">Verify Credential</li>
      </ol>
    </nav>
  </div>
  <div class="flex mt-14">
    <div class="flex-1">
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
    </div>
    <div class="w-72 bg-gray-100 p-6 bg-gray-300 -mt-8">
      <h2 class="text-xl font-semibold">Updates</h2>
      <ol class="list-decimal">
        <li v-for="message in logMessages">{{ message }}</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({layout: 'leo-inc'})

  import {ref} from "vue";
  import QrcodeVue from "qrcode.vue";
  import {checkInvitationIsAccepted, createConnection} from "~/composables/IndyAPI";

  enum Step {CONNECTION_SETUP, REQUESTING_CREDENTIALS, DONE}
  const step = ref(Step.CONNECTION_SETUP);
  const invitationLink = ref('')
  const WalletConnectionID = ref("");
  const proofRequestSubject = ref("");
  const proofRequestDegree = ref("");
  const proofRequestDocumentNumber = ref("");
  const logMessages = ref([] as string[]);
  let createdInterval: number = null

  const generateQRCodeForConnection = () => {
    createConnection(false).then(({invitationURL, connectionID}) => {
      console.log(`invitation.....${invitationURL}`)
      invitationLink.value = invitationURL
      WalletConnectionID.value = connectionID
      addToLog('[Verifier] Creating connection QRCode')
      createdInterval = setInterval(manageIntervalForAcceptedInvitation, 3000);
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
    return checkInvitationIsAccepted(WalletConnectionID.value, false).then((isAccepted) => {
      if (isAccepted) {
        console.log("Invitation accepted!")
        step.value = Step.REQUESTING_CREDENTIALS
        addToLog("[Wallet] accepted verifier connection!")
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

  async function displayProof(data) {
    addToLog("[Verifier] Received proof from wallet!")
    addToLog("[Verifier] Proof is validated against the ledger!")
    step.value = Step.DONE
    proofRequestSubject.value = data.subject
    proofRequestDegree.value = data.degree
    proofRequestDocumentNumber.value = data.documentNumber
  }

  function addToLog(logMessage: string) {
    logMessages.value.push(logMessage)
  }
</script>
