<script setup lang="js">
import { ref } from 'vue';
const pointValue = ref(0);

function sendCommand(message) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, message);
        }
    });
}

function highlightCellsOnConditions() {
    const conditions = Object.values(conditionMap.value);
    sendCommand({
        command: 'highlightCellsOnConditions',
        conditionFunc:conditionFunc.value, 
        conditions: conditions
    });
}   

function clearStyles() {
    sendCommand({
        command: 'clear'
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
    pts: { name: 'Points', type: 'int', value: 0 },
    fga: { name: 'Field Goal Attempts', type: 'int', value: 0 },
    fg: { name: 'Field Goals', type: 'int', value: 0 },
    fg3a: { name: '3 Point Field Goal Attempts', type: 'int', value: 0 },
    fg3: { name: '3 Point Field Goals', type: 'int', value: 0 },
    fg_pct: { name: 'Field Goal Percentage', type: 'float', value: 0.0 },
    fg3_pct: { name: 'Three Point Percentage', type: 'float', value: 0.0 },
    trb: { name: 'Rebounds', type: 'int', value: 0 },
    ast: { name: 'Assists', type: 'int', value: 0 },
});

const selectedStat = ref('pts');
const statValue = ref(0);
const conditionType = ref('under');
const conditionFunc = ref('and');
const conditionMap = ref({});

function addCondition() {
    const condition = {
        stat: selectedStat.value,
        value: statValue.value,
        type: conditionType.value
    };
    console.log ('Adding condition:', condition);
    
    conditionMap.value[condition.stat] = condition;
}

function removeCondition(statKey) {
    delete conditionMap.value[statKey];
}

function getComparisonOperator(type) {
    switch (type) {
        case 'under':
            return '<=';
        case 'over':
            return '>=';
        case 'exact':
            return '=';
        default:
            return '';
    }
}

</script>
<template>
    <div class="main-container">
        <div class="title-container d-flex justify-content-between">
            <h2>Bball-Ref Table Highlighter</h2>
            <button class="btn btn-primary clear" @click="clearStyles"><span>clear</span></button>
        </div>
        <div class="and-or-container mt-2">
            <fieldset class="d-flex align-items-center">
                <h6 class="type-label">Boolean:</h6>
                <input type="radio" class="btn-check" name="boolean-base" id="and-option" autocomplete="off" checked @change="conditionFunc='and'">
                <label class="btn" for="and-option">And</label>

                <input type="radio" class="btn-check" name="boolean-base" id="or-option" autocomplete="off" @change="conditionFunc='or'">
                <label class="btn" for="or-option">Or</label>
            </fieldset>
        </div>
        <div class="condition-builder d-flex flex-column border rounded-2">
            
            <!--radio option for over, under or exact-->
            <fieldset class="d-flex align-items-center">
                <h6 class="type-label">type:</h6>
                <input type="radio" class="btn-check" name="options-base" id="under-option" autocomplete="off" checked @change="conditionType='under'">
                <label class="btn" for="under-option">Under</label>

                <input type="radio" class="btn-check" name="options-base" id="over-option" autocomplete="off" @change="conditionType='over'">
                <label class="btn mx-1" for="over-option">Over</label>

                <input type="radio" class="btn-check" name="options-base" id="exact-option" autocomplete="off" @change="conditionType='exact'">
                <label class="btn" for="exact-option">Exact</label>
            </fieldset>

            <select class="form-select" name="stat-select" v-model="selectedStat">
                <option v-for="(stat, key) in stats" :key="key" :value="key">{{ stat.name }}({{ key }})</option>
            </select>
            <!--number input range -->
            <div class="d-flex flex-column value-range-container border rounded-2 p-1">
                <div class="d-flex range-label-wrapper align-items-center">
                    <h6>Value:&nbsp;</h6>
                    <output for="value-range" id="rangeValue" aria-hidden="true">{{statValue}}</output>
                </div>
                <input type="range" class="form-range" min="0" max="40" value="50" id="value-range" v-model="statValue">
            </div>
            <button class="btn btn-primary add-condition-btn" @click="addCondition">add condition</button>
        </div>
        <div class="condition-list-container d-flex w-100">
            <ul class="condition-list list-group w-100">
                <li class="list-group-item d-flex align-items-baseline justify-content-between" v-for="(condition, conditionKey) in conditionMap" :key="conditionKey">
                    
                    <span>{{ stats[condition.stat].name }}&nbsp;{{ getComparisonOperator(condition.type) }}&nbsp;{{ condition.value }}</span>
                    <button class="btn btn-danger" @click="removeCondition(condition.stat)">remove</button>
                </li>
            </ul>
        </div>
        
        <div class="controls-container">
            <button class="btn btn-primary" @click="highlightCellsOnConditions">show</button>
            <button class="btn btn-secondary">hide</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-container {
    width: 100%;
    padding: 0.6rem;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: start;

    button {
        text-transform: capitalize;
    }

    .controls-container {
        padding-top: 0.6rem;
        margin-top: auto;
        margin-left: auto;
        :first-child {
            margin-right: 0.6rem;
        }
    }

    .title-container {
        width: 100%;
    }
    
    fieldset h6 {
        margin: 0px;
        text-align: center;
        text-transform: capitalize;
        margin-right: 1rem;
        margin-left: 0.6rem;
    }


    .condition-builder{
        margin-top: 0.8rem;
        margin-bottom: 0.8rem;

        width : 100%;
        gap: 0.8rem;
        padding: 0.6rem;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
        // background-color: lavender;

        .add-condition-btn{
            width: fit-content;
            margin-left: auto;
        }

        

        .range-label-wrapper{
            margin-left: 0.4rem;
            label, h6{
                margin: 0px;
            }
        }

    }
}
</style>