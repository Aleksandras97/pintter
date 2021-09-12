<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm"> {{ $route.name }} </span>
          <q-icon
            class="q-pa-sm lt-md header-icon"
            name="fas fa-ribbon"
            size="md"
            color="primary"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :width="280"
      side="left"
      bordered
    >
      <q-icon class="q-pa-sm" name="fas fa-ribbon" size="lg" color="primary" />

      <q-list>
        <q-item to="/pints" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>

        <q-item to="/about" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="info" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >About</q-item-section
          >
        </q-item>

        <q-item v-if="!isLogedIn" to="/auth" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="fas fa-sign-in-alt" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >Login & SignUp
          </q-item-section>
        </q-item>
        <q-item
          v-if="isLogedIn"
          @click="logout"
          to="/auth"
          exact
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >Logout
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-input
        class="q-ma-md"
        outlined
        dense
        rounded
        placeholder="Search Pintter"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-list separator padding>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-gray">Education</q-item-label>
            <q-item-label class="text-weight-bold"
              >Something amazing</q-item-label
            >
            <q-item-label caption
              >Secondary line text. Lorem ipsum dolor sit amet, consectetur
              adipiscit elit.</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-gray">Education</q-item-label>
            <q-item-label class="text-weight-bold"
              >Something amazing</q-item-label
            >
            <q-item-label caption
              >Secondary line text. Lorem ipsum dolor sit amet, consectetur
              adipiscit elit.</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min agologout</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-gray">Education</q-item-label>
            <q-item-label class="text-weight-bold"
              >Something amazing</q-item-label
            >
            <q-item-label caption
              >Secondary line text. Lorem ipsum dolor sit amet, consectetur
              adipiscit elit.</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router'

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const store = useStore();
    const router = useRouter();

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
      isLogedIn: computed(() => store.getters.isAuth),

      logout() {
        store.dispatch("logout");
        router.replace('/auth')
      },
    };
  },
};
</script>

<style>
.header-icon {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
