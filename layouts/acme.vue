<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <NuxtImg
                class="w-60"
                src="/images/acme-logo.svg"
                alt="ACME schools logo"
              />
            </div>
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.path"
                :class="[
                  isActiveRoute(item.routeName)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :aria-current="
                  isActiveRoute(item.routeName) ? 'page' : undefined
                "
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center">
            <button
              type="button"
              class="relative mr-3 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              @click="handleNotificationsClick"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton
                class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span class="sr-only">Open user menu</span>
                <NuxtImg
                  class="w-12 rounded-full"
                  :src="user.imageUrl"
                  alt="profile picture"
                />
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <NuxtLink
                      :to="item.path"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                    >
                      {{ item.name }}
                    </NuxtLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { BellIcon } from "@heroicons/vue/24/outline";

interface NavItem {
  name: string;
  path: string;
  routeName: string;
}

interface UserNavItem {
  name: string;
  path: string;
}

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

const route = useRoute();

const user: User = reactive({
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: "/images/employee.png",
});

const navigation: NavItem[] = [
  { name: "Home", path: "/issuer", routeName: "issuer-home" },
  {
    name: "Certification",
    path: "/issuer/certification",
    routeName: "issuer-certs",
  },
  { name: "Students", path: "/issuer/students", routeName: "issuer-students" },
  { name: "Issuance", path: "/issuer/issue", routeName: "issuer-issue" },
];

const userNavigation: UserNavItem[] = [
  { name: "Your Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
  { name: "Sign out", path: "/signout" },
];

const isActiveRoute = (routeName: string): boolean => {
  return route.name === routeName;
};

const handleNotificationsClick = () => {
  // Handle notifications logic
};
</script>
