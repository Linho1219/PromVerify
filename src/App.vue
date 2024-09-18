<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import UniHeader from "./components/Header.vue";
</script>

<template>
  <UniHeader personInCount="1" personOutCount="1">
    Prom2024 验票平台
  </UniHeader>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
@keyframes fade {
  from {
    opacity: 0;
  }
}

main {
  position: fixed;
  top: 80px;
  bottom: 0;
}

main > * {
  animation: fade 0.2s;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
