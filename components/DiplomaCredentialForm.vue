<template>
  <div class="flex-auto bg-center text-center">
    Please fill this form to create a credential
  </div>
  <br><br><br>
  <form v-if="buildingForm" @submit.prevent="CreateVCData">
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Credential Information</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">This form represents the EPFL degree #xxxx schema.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div class="mt-2">
              <input v-model="signee" type="text" name="signee" id="name" autocomplete="full-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>
          <div class="col-span-2">
            <label for="documentNumber" class="block text-sm font-medium leading-6 text-gray-900">Document Number</label>
            <div class="mt-2">
              <input type="text" v-model="documentNumber" name="document-number" id="documentNumber" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="subject" class="block text-sm font-medium leading-6 text-gray-900">Subject</label>
            <div class="mt-2">
              <input type="text" v-model="subject" name="subject" id="subject" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>
          <div class="sm:col-span-1">
            <label for="degree" class="block text-sm font-medium leading-6 text-gray-900">Degree</label>
            <div class="mt-2">
              <select id="degree" v-model="degree" name="degree" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>C+</option><option>C-</option>
              </select>
            </div>
          </div>

          <div class="sm:col-span-1">
            <label for="dateOfIssue" class="block text-sm font-medium leading-6 text-gray-900">Date of issue</label>
            <div class="mt-2">
              <input type="date" v-model="dateOfIssue" name="date-of-issue" id="dateOfIssue" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div class="sm:col-span-6 sm:col-start-1">
            <label for="body" class="block text-sm font-medium leading-6 text-gray-900">Message</label>
            <div class="mt-2">
              <input type="text" v-model="body" name="body" id="body" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
      <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </div>
  </form>
  <div v-if="!buildingForm">
    <p>Name: {{ signee }}</p>
    <p>Document Number: {{ documentNumber }}</p>
    <p>Subject: {{ subject }}</p>
    <p>Degree: {{ degree }}</p>
    <p>Date of issue: {{ dateOfIssue }}</p>
    <p>Message: {{ body }}</p>

    <div  class="flex items-center justify-center gap-x-6">
      <p>Generate Verifiable Credential?</p>
      <button type="button" @click="CreateConnection" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";

const signee = ref('Ahmed E.');
const documentNumber = ref('A001');
const subject = ref('Mathematics');
const degree = ref('A+');
const dateOfIssue = ref('1993-09-01');
const body = ref('Congrats!');

const buildingForm = ref(true);

const CreateVCData = async () => {
  buildingForm.value = false;
  console.log('Form data is valid, sending to server...');
}

const CreateConnection = async () => {
  console.log('Creating connection...');
  const {data, status} = await axios.post(
    'http://eid-admin.c4dt.org/connections/create-invitation?auto_accept=true',
    {
      "my_label": "student: " + signee.value
    },
    {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'
    }
    })
  console.log(data);
  console.log(status);

}
const GenerateVC = async (connectionID: String) => {
  console.log('Generating Verifiable Credential...');
  axios.post('http://eid-admin.c4dt.org/issue-credential/send', {
    "connection_id": connectionID,
    "credential_proposal": {
      "attributes": [
        {
          "name": "subject",
          "value": subject.value,
          "mime-type": "text/plain"
        },
        {
          "name": "degree",
          "value": degree.value,
          "mime-type": "text/plain"
        },
        {
          "name": "document_number",
          "value": documentNumber.value,
          "mime-type": "text/plain"
        },
        {
          "name": "body",
          "value": body.value,
          "mime-type": "text/plain"
        },
        {
          "value": "Ahmed Elghareeb",
          "name": signee.value,
          "mime-type": "text/plain"
        },
        {
          "value": "2018-05-12",
          "name": dateOfIssue.value,
          "mime-type": "text/plain"
        }
      ],
      "@type": "issue-credential/1.0/credential-preview"
    },
    "auto_remove": "true",
    "schema_id": "JEfsRZ6qBhToWbGcJDfe2N:2:EPFL_diploma_supplement:1.0.7"
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'
    }
  })
}
</script>