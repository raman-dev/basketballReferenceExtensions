<script setup lang="ts">
import { ref } from 'vue';
const pointValue = ref(0);

function sendCommand(message: Object){
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, message);
        }
    });
}

function changeBackground() {
    sendCommand( {command: "changeBackgroundColor"});   
}

function highlightPointsOver() {
    sendCommand({
        command: "highlightPointsOver", 
        stat: "pts",
        points: pointValue.value
    });
}

function limit(element: Event) {
    const input = element.target as HTMLInputElement;
    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);
        pointValue.value = Number(input.value);
    }
}

</script>
<template>
    <div class="main-container">
        <h1>Popup</h1>
        <!--integer input-->
        <div>
            <input name="pts-stat" type="number" placeholder="00" v-model="pointValue" @input="limit"/>
            <button class="btn btn-primary mx-1" @click="highlightPointsOver">Points Over</button>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    padding: 0.6rem;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: start;

    input {
        width: 6ch;
    }
}
</style>