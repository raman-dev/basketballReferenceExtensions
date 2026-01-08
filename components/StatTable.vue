<script setup>

defineProps({
    stats: {type:Object,default:{}}
});
</script>
<template>
    <ul>
        <li v-for="(stat,index) in stats">
            {{ stat }}
        </li>
    </ul>
</template>