<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2 class="text-base font-semibold leading-7 text-indigo-600">E-ID Demo</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A simple app portraying the process of Verifiable Credential exchange</p>
        <p class="mt-6 text-lg leading-8 text-gray-600">The demo includes a simplified issuer and verifier</p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          <div v-for="feature in features" :key="feature.name" class="relative pl-16">
            <dt class="text-base font-semibold leading-7 text-gray-900">
              <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <component :is="feature.icon" class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              {{ feature.name }}
            </dt>
            <dd class="mt-2 text-base leading-7 text-gray-600">{{ feature.description }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const features = [
  {
    name: 'Issuer',
    description:
        "Entity that issues the credentials. In our example, the issuer will be the ACME school." +
        "The issuer will make sure as well to sync all public keys and schemas with the ledger.",
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Ledger',
    description:
        "Ledgers are also called 'trust anchor'. It is the reference used by verifiers to " +
        "verify the authenticity of the credentials. That is done by storing all public keys of all" +
        "Issuers on the ledger in addition to the schemas and revocation registries",
    icon: LockClosedIcon,
  },
  {
    name: 'Wallet',
    description:
        "Storage application that is the only place that will store the actual credentials." +
        "The wallet is also be the only place that can present the credentials to a verifier." +
        "In our example, the wallet will be owned by the student.",
    icon: ArrowPathIcon,
  },
  {
    name: 'Verifier',
    description:
        "Entity that needs to verify the credentials. In our example, the verifier will be the Leo Inc.",
    icon: FingerPrintIcon,
  },
]
</script>