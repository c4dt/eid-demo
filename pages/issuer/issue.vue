<template>
  <div class="flex items-center bg-gray-100">
    <nav class="text-sm sm:text-base bg-white p-2 md:p-2 lg:p-4 rounded-md shadow-lg">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center">
          <svg onclick="window.location.href='/issuer';" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" class="cursor-pointer hover:fill-blue-500 transition-colors duration-300" fill="#4b5563">
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
          </svg>
          <a href="/issuer" class="text-gray-600 hover:text-blue-500 transition-colors duration-300">Home</a>
          <span class="mx-2">/</span>
        </li>
        <li class="flex items-center">Issue Credential</li>
      </ol>
    </nav>
  </div>
  <div class="flex mt-14 shadow-md min-h-[500px] shadow-md rounded-xl bg-gray-50">
    <div class="flex-1 p-4 mt-10 ml-10">
      <IssuerDiplomaCredentialForm v-if="step===Step.VC_FORM" @diploma-object-created="createCredentialData" @add-to-log="addToLog" />
      <div v-if="step!==Step.VC_FORM" class="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-6 my-8">
        <div class="space-y-2 font-medium text-gray-700">
          <p>Name: <span class="font-normal">{{ CredentialData.signee }}</span></p>
          <p>Document Number: <span class="font-normal">{{ CredentialData.documentNumber }}</span></p>
          <p>Subject: <span class="font-normal">{{ CredentialData.subject }}</span></p>
          <p>Degree: <span class="font-normal">{{ CredentialData.degree }}</span></p>
          <p>Date of Issue: <span class="font-normal">{{ CredentialData.dateOfIssue }}</span></p>
          <p>Message: <span class="font-normal">{{ CredentialData.body }}</span></p>
        </div>
      </div>
      <IssuerIndyWalletConnectionSetUp v-if="step===Step.CONNECTION_SETUP" :connectionUserName="CredentialData.signee" @wallet-connection-established="SendCredentialToWallet"/>
      <div v-if="step===Step.SENDING_VC_TO_WALLET" class="container mx-auto text-center">
        <p>Connection established!</p>
        <p>Connection ID: {{ connectionID }}</p>
        <p>Sending Credential to wallet..</p>
      </div>
      <div>
        <p v-if="step===Step.DONE" class="text-center"> Credential Successfully Sent to wallet</p>
      </div>
    </div>
    <div class="w-72 bg-gray-100 p-6 bg-gray-300 -mt-10 rounded-md shadow-lg">
      <h2 class="text-xl font-semibold">Updates</h2>
      <ol class="list-decimal">
        <li v-for="message in logMessages">
          [{{ message.source }}<span v-if="message.target !== undefined"> -> {{ message.target }}</span>] {{ message.message }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({layout: 'acme'})

  import {ref} from "vue";
  import type {ActionLog, DiplomaSchema} from "~/composables/VerifiableCredential";
  import {GenerateVC} from "~/composables/IndyAPI";

  enum Step {VC_FORM, CONNECTION_SETUP, SENDING_VC_TO_WALLET, DONE}
  const step = ref(Step.VC_FORM);
  const CredentialData = ref({} as DiplomaSchema);
  const connectionID = ref("");
  const logMessages = ref([] as ActionLog[]);

  function createCredentialData(createdCredential: DiplomaSchema)   {
    console.log(`createCredentialData..... ${createdCredential}`)
    CredentialData.value = createdCredential;
    step.value = Step.CONNECTION_SETUP;
    addToLog("Credential Data saved", 'Issuer', undefined)
  }

  function SendCredentialToWallet(walletConnectionID: string) {
    addToLog("Accepted connection", "Wallet", "Issuer")
    addToLog("Sending Credential", "Issuer", "Wallet")
    connectionID.value = walletConnectionID
    step.value = Step.SENDING_VC_TO_WALLET;
    GenerateVC(walletConnectionID, CredentialData.value).then((res) => {
      console.log(`GenerateVC..... ${res}`)
      setTimeout(() => {
        step.value = Step.DONE;
      }, 2000)
    })
    addToLog("Credential received successfully!", "Wallet", "Issuer")
  }

  function addToLog(message: string, source: string = "Issuer", target: string | undefined = "Wallet") {
    logMessages.value.push({
      source: source,
      target: target,
      message: message
    })
  }
</script>
