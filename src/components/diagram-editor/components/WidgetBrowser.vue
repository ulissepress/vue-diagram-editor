<template>
    <div class="widget-browser">
        <input v-model="filter" class="filter-input" type="text"  placeholder="Search for widgets" v-tooltip.right="'Filter widget list'"/>
        <div class="widget-scroller">
            <div v-close-popper class="widget-row" v-for="w in filteredWidgets || []" :key="w.title + '_' + w.category" @click.stop="$emit('widget-selected', w)">
                <Icon :icon="w.icon" size="20px" color="#999"  /> 
                <div class="widget-title">{{ w.title }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WidgetDefinition } from '../types';
import Icon from './Icon.vue';


// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface WidgetBrowserProps {
    widgets: WidgetDefinition[]
}

const { widgets } = withDefaults(defineProps<WidgetBrowserProps>(), {    
});

interface WidgetBrowserEvents {
    (e: 'widget-selected', widget: WidgetDefinition): void
}

const emit = defineEmits<WidgetBrowserEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const filter          = ref('');
const filteredWidgets = computed(() => widgets?.filter(w => w.title.toLowerCase().includes(filter.value.toLowerCase())));


</script>

<style scoped>
.widget-browser {
    --height: 400px;
    width: 250px;
    height: var(--height);
    max-height: var(--height);
    padding: 8px;    
    display: flex;
    flex-direction: column;
}

.widget-scroller {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

.widget-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    cursor: pointer;
    user-select: none;
}

.widget-row:hover {
    background-color: #eee;    
}
.widget-title {
    font-size: 13px;
}
.filter-input {
    width: 95%;
    border: 0px;
    background-color: #eee;
    padding: 4px;
    margin-bottom: 8px;
}


</style>
