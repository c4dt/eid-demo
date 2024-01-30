<template>
  <div class="sm:px-6 lg:py-16 relative">
    <div class="max-w-xl mx-auto text-center">
      <div class="inline-flex px-4 py-1.5 mx-auto rounded-full">
        <p class="text-4xl font-semibold tracking-widest text-g uppercase">ACME Schools HR system</p> for graduate affairs
      </div>
      <p class="mt-4 text-base leading-relaxed text-gray-600 group-hover:text-white">
        This platform provides different activities for ACME Schools HR department.
      </p>
    </div>
    <div class="grid grid-cols-1 gap-2 mt-12 sm:grid-cols-3 lg:mt-20">
          <a v-for="page in pages" :href="page.url"
             class="transition-all  duration-1000 bg-white hover:bg-blue-500  hover:shadow-xl m-2 p-4 relative z-40 group">
            <div
                class=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  ">
            </div>
            <div class="py-2 px-9 relative">
              <h3 class="mt-8 text-lg font-semibold text-black group-hover:text-white ">{{page.title}}
              </h3>
              <p class="mt-4 text-base text-gray-600 group-hover:text-white  ">
                {{ page.description }}
              </p>
            </div>
          </a>
        </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({layout: 'acme'})
const pages = ref([
  {
    title: 'Internal Certification Management',
    url: '/issuer/certification',
    description: 'Manages Certification details, including creating new certifications, and monitoring existing ones.'
  },
  {
    title: 'Students',
    url: '/issuer/students',
    description: 'Manages Student Information and maintains their contact information.'
  },
  {
    title: 'Certificate Issuance',
    url: '/issuer/issue',
    description: 'Issue certificates upon request by students.\n' +
        'These certificates can be verified by third parties.'
  },
]);
</script>
