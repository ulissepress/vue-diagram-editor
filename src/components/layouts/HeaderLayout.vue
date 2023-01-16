<template>
    <div class="container">
        <!-- Normal header -->
        <div class="header" v-if="!collapsed" :style="{
            minHeight: options.height,
            height: options.height,
            overflow: 'scroll',
        }">
            <slot name="header"></slot>
        </div>

        <!-- Collapsed header -->
        <div class="header-collapsed" v-if="collapsed">
            <slot name="header-collapsed"></slot>
        </div>

        <div class="separator">
            <div class="icon collapse-icon" @click="collapsed = !collapsed">
                <span v-if="!collapsed" class="material-icons-outlined">expand_less</span>
                <span v-else            class="material-icons-outlined">expand_more</span>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content" :style="{ overflow: options.sticky ? 'scroll' : 'visible' }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface HeaderLayoutOptions {
	height: 		  string,			            // The header height. Default = 'auto'. Examples: '250px', '30%'			
	collapsedHeight:  string,			            // The collpased header height. Default = 'auto'. Examples: '80px', '10%'		
	collapsable: 	  boolean,			            // User can collapse the header. Default = true
	sticky: 		  boolean,	                    // Header can be fixed
	storageKey: 	  string;			            // If set the header status will be saved/restored in the browser local storage 										
}

interface ComponentProps {
   options?: Partial<HeaderLayoutOptions>
}

// Define Props
const props = defineProps<ComponentProps>();

// Initialize options with deafault values (overriden from the ones passed from the props)
const options: HeaderLayoutOptions = Object.assign({
	height: 		  "auto",
	collapsedHeight:  "auto",		
	collapsable: 	  true,
	sticky: 		  false,
	storageKey: 	  "myKey" 										
}, props.options);


const collapsed = ref(false);

</script>


<style scoped>

.container * {
    box-sizing: border-box;
}
.container {
    /* outline: 1px dashed red; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction:column;
    padding: 0px;
}

.header {
    padding: 0px;
}

.header-collapsed {
    padding: 0px;
}

.separator {
    position: relative;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid grey;
    margin: 8px auto;
}

.icon {
    position: absolute;
    top: -10px;
    border: 1px solid black;
    width: 20px;
    height: 20px;
    background-color: #777; 
    color: white;
    border-radius: 50%;

    cursor: pointer;
}

.icon span {
    font-size: 19px;
}

.collapse-icon {
    right: 8px;
}



.main-content {
    padding: 0px;
    flex-grow: 1;
}
</style>
