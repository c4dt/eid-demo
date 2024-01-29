<template>
  <form @submit.prevent="CreateVCData">
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Credential Information</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">This form represents the ACME schools degree EPFL_diploma_supplement:1.0.7 schema.</p>

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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type {DiplomaSchema} from "~/composables/VerifiableCredential";
const emit = defineEmits(['DiplomaObjectCreated']);

const signee = ref('Ahmed E.');
const documentNumber = ref('A001');
const subject = ref('Mathematics');
const degree = ref('A+');
const dateOfIssue = ref('2013-09-01');
const body = ref('Congrats!');

const CreateVCData = async () => {
  const createdDiploma: DiplomaSchema = {
    signee: signee.value,
    documentNumber: documentNumber.value,
    subject: subject.value,
    degree: degree.value,
    dateOfIssue: dateOfIssue.value,
    body: body.value
  };
  emit('DiplomaObjectCreated', createdDiploma)
}
</script>
