<template>
    <div id="app">
        <simple-calendar :parentTime="currentTime" @getQueryByDate="searchByDate"></simple-calendar>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data(){
            let time = new Date();
            return {
                currentTime:this.simpleDateFormat(new Date(),'yyyy/MM/dd')       
            }
        },
        mounted(){
            // this.currentTime = new Date();   // 不止为何初始化赋值才好使，加载完成后赋值无效。
        },
        methods:{
            searchByDate(time){                 //子组件返回的时间信息
                // console.log('我是子组件传过来的时间',time);
            },
            simpleDateFormat(time, format){     // 格式化日期，ios下建议'2017/11/15',斜杠'/'代替横线'-'
                var t = new Date(time);
                var tf = function(i) {
                    return (i < 10 ? '0' : '') + i
                };
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear());
                        case 'MM':
                            return tf(t.getMonth() + 1);
                        case 'mm':
                            return tf(t.getMinutes());
                        case 'dd':
                            return tf(t.getDate());
                        case 'HH':
                            return tf(t.getHours());
                        case 'ss':
                            return tf(t.getSeconds());
                    }
                })
            }
        }
    }
</script>

<style>

</style>
