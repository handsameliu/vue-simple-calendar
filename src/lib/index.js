import vueSimpleCalendar from './vue-simple-calendar.vue';
const simpleCalendar = {
    install (Vue, options) {
        Vue.component(vueSimpleCalendar.name, vueSimpleCalendar);
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(simpleCalendar);
}
export default simpleCalendar; 