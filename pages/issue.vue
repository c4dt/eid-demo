<template>
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
