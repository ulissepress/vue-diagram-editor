<template>
    <q-layout>
        <q-header class="bg-primary text-white" height-hint="98" elevated>
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
                <q-toolbar-title>UPDS Demos</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" :width="200" show-if-above bordered elevated class="drawer">
            <router-link to="/">Home</router-link>
            <router-link to="/collapsable-header">Collapsable Header</router-link>
            <router-link to="/diagram">Diagram Editor</router-link>
        </q-drawer>

        <q-page-container style="width: 100%; height: 100vh;">
            <div class="page-container"><router-view /></div>
        </q-page-container>
    </q-layout>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false)

</script>

<style>
.drawer {
    display: flex; 
    flex-direction: column; 
    gap: 16px;
    padding: 16px;
    background-color: lightskyblue;
}

.page-container {
    width: 100%;
    height: 100%;
}
</style>