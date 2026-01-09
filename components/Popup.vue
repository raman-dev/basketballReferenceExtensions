<script setup lang="js">
import { ref } from 'vue';
import StatTable from './StatTable.vue';
const pointValue = ref(0);

function sendCommand(message){
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

function clearStyles(){
    sendCommand({
        command:'clear'
    });
}

function limit(element) {
    const input = element.target;
    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);
        pointValue.value = Number(input.value);
    }
}

const stats = ref({
    pts: { name: 'Points',type:'int',value: 0},
    fga: { name: 'Field Goal Attempts',type:'int', value:0},
    fg: { name: 'Field Goals',type:'int' , value:0},
    fg3a: { name: '3 Point Field Goal Attempts',type:'int', value:0 },
    fg3: { name: '3 Point Field Goals',type:'int' , value:0},
    orb: { name: 'Offensive Rebounds',type:'int' , value:0},
    drb: { name: 'Defensive Rebounds',type:'int' , value:0},
    trb: { name: 'Total Rebounds',type:'int' , value:0},
    ast: { name: 'Assists',type:'int', value:0 },
    fg_pct: { name: 'Field Goal Percentage',type:'float' , value:0.0},
    fg3_pct: { name: 'Three Point Percentage',type:'float' , value:0.0},
    ft_pct: { name: 'Free Throw Percentage',type:'float' , value:0.0},
});

</script>
<template>
    <div class="main-container">
        <div class="title-container d-flex justify-content-between border">
            
        <h1>Popup</h1>
        <button class="btn btn-primary clear" @click="clearStyles"><span>clear</span></button>
        </div>
        <!--integer input-->
        <div class="">
            <input name="pts-stat" type="number" placeholder="00" v-model="pointValue" @input="limit"/>
            <button class="btn btn-primary mx-1" @click="highlightPointsOver">Points Over</button>
        </div>
        <!--because it is named in child definition need to use v-model:name can't use v-model -->
        <StatTable v-model:stats="stats"></StatTable>
    </div>
</template>

<style scoped lang="scss">
.main-container {
    width: 100%;
    padding: 0.6rem;
    min-height: 400px;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: start;

    input {
        width: 6ch;
    }

    .title-container{
        width: 100%;
    }
}
</style>