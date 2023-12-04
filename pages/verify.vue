<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const value = ref('https://www.npmjs.com/package/qrcode.vue')
</script>


<template>
  <div class="flex-auto text-center">
    Please scan this QR code to initiate your diploma verification!
  </div>
  <br><br><br>
  <qrcode-vue class="mx-auto" :value="value" level="H" size="300" render-as="svg"/>
</template>
