import Vue from 'vue';
import App from './App.vue';
import simpleCalendar from './lib/index.js';

Vue.use(simpleCalendar);

new Vue({
    el: '#app',
    render: h => h(App)
})
