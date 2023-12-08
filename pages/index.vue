<script setup>
</script>

<template>
  <div class="container mx-auto">
    <span>
      <NuxtLink to="/verify" >
        <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Verify</button>
      </NuxtLink>
    </span>
    <span class="ml-3">
      <NuxtLink to="/issue">
        <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Issue</button>
      </NuxtLink>
    </span>
  </div>

  <img class="w-full aspect-video" src="~/assets/epfl-ic-square.png" />
</template>
