<script setup>

defineProps({
    stats: {type:Object,default:{}}
});
</script>
<template>
    <div class="container-fluid">
        <ul class="list-group">
            <li class="list-group-item d-flex flex-column" v-for="(stat_info,stat_key) in stats">
                <span>{{ stat_info.name }} ({{ stat_key }})</span>  
                <div class="control d-flex">    
                    <button class="decrement btn btn-danger">&#45;</button>
                    <span class="border" style="flex-grow: 1;">00</span>
                    <button class="increment btn btn-success">&#43;</button>
                </div>
            </li>
        </ul>
    </div>
    
</template>
<style scoped lang="scss">
    
</style>