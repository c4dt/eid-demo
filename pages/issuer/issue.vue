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
  <br><br>
  <IssuerDiplomaCredentialForm v-if="step===Step.VC_FORM" @diploma-object-created="createCredentialData" />
  <div v-if="step!==Step.VC_FORM" class="container mx-auto">
    <p>Name: {{ CredentialData.signee }}</p>
    <p>Document Number: {{ CredentialData.documentNumber }}</p>
    <p>Subject: {{ CredentialData.subject }}</p>
    <p>Degree: {{ CredentialData.degree }}</p>
    <p>Date of issue: {{ CredentialData.dateOfIssue }}</p>
    <p>Message: {{ CredentialData.body }}</p>
    <br>
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
</template>

<script setup lang="ts">
  definePageMeta({layout: 'epfl'})

  import {ref} from "vue";
  import type {DiplomaSchema} from "~/composables/VerifiableCredential";
  import {GenerateVC} from "~/composables/IndyAPI";

  enum Step {VC_FORM, CONNECTION_SETUP, SENDING_VC_TO_WALLET, DONE}
  const step = ref(Step.VC_FORM);
  const CredentialData = ref({} as DiplomaSchema);
  const connectionID = ref("");

  function createCredentialData(createdCredential: DiplomaSchema)   {
    console.log(`createCredentialData..... ${createdCredential}`)
    CredentialData.value = createdCredential;
    step.value = Step.CONNECTION_SETUP;
  }

  function SendCredentialToWallet(walletConnectionID: string) {
    console.log(`SendCredentialToWallet..... ${walletConnectionID}`)
    connectionID.value = walletConnectionID
    step.value = Step.SENDING_VC_TO_WALLET;
    GenerateVC(walletConnectionID, CredentialData.value).then((res) => {
      console.log(`GenerateVC..... ${res}`)
      setTimeout(() => {
        step.value = Step.DONE;
      }, 2000)
    })
  }
</script>
