<script setup>

const stats = defineModel('stats',{default: {}});

function decrease(key){
    stats.value[key].value -=1;
}

function increase(key){
    stats.value[key].value += 1;
}
</script>
<template>
    <div class="container-fluid">
        <ul class="list-group">
            <li class="list-group-item d-flex flex-column" v-for="(stat_info,stat_key) in stats">
                <span>{{ stat_info.name }} ({{ stat_key }})</span>  
                <div class="control d-flex align-items-baseline">    
                    <button class="decrement btn btn-danger" @click="decrease(stat_key)">&#45;</button>
                    <p class="border" style="flex-grow: 1;">{{ stat_info.value }}</p>
                    <button class="increment btn btn-success" @click="increase(stat_key)">&#43;</button>
                </div>
            </li>
        </ul>
    </div>
    
</template>
<style scoped lang="scss">
    
</style>