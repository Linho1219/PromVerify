<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import UniHeader from "./components/Header.vue";
</script>

<template>
  <UniHeader personInCount="1" personOutCount="1" />
  <main>
    <RouterView />
  </main>
</template>

<style>
:root {
  --green: #29e88b;
  --red: #ff8f6b;
  --yellow: #fbc015;
  --blue: #24adf3;
  --greenA: #29e88b50;
  --redA: #ff8f6b50;
  --yellowA: #fbc01550;
  --blueA: #24adf350;
  --greenAA: #29e88b15;
  --redAA: #ff8f6b15;
  --yellowAA: #fbc01515;
  --blueAA: #24adf315;
}
main{
  position:fixed;
  top:80px;
  left:0;
  right:0;
  bottom:0;
}
</style>

<style scoped>
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
