<template>
    <div class="dateModel">
        <div class="dateContent">
            <div class="title">
                <div class="pre" @click="preMonth"><i class="prePage"></i>上月</div>
                <div class="text">{{showTime}}</div>
                <div class="next" @click="nextMonth">下月<i class="nextPage"></i></div>
            </div>
            <div class="weeks">
                <div class="week" v-for="(wk,key) in weekName" :key="key">{{wk}}</div>
            </div>
            <div class="main">
                <div class="day" v-for="(day,key) in dateArr" :key="key" @click="clickDate(day,key)">
                    <div class="value" :class="((day.flag && 'disbaled') || (day.isActive && 'on'))" >{{day.value}}</div>
                    <!-- <div class="parameter"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'simple-calendar',
        props:{
            parentTime:{        // 当前时间，可由父级传入指定时间
                type: String,
                default:'',
                required: false
            }
        },
        data(){
            let today = new Date();
            return {
                today:today,                                    // 当天
                weekName:['日','一','二','三','四','五','六'],   //  星期
                currentDate:'',                                 // 当前时间
                currentYear:'',                                 // 当年
                currentMonth:'',                                // 当月
                currentDay:'',                                  // 当天
                tempDay:'',                                     // 切换时用到的临时变量
                firstDay:'',                                    // 当月第一天是星期几
                monthDays:[],                                   // 12个月份中每个月的天数
                showTime:'',                                    // 用于显示的年月份
                dateArr:[],                                     // 用于循环的日
            }
        },
        mounted(){
            let time = this.parentTime?new Date(this.parentTime):new Date();        // 如果父级传入就以父级为准，反之默认为当前时间
            this.init(time);                                                        // 初始化数据
            this.$emit('getQueryByDate',this.showTime+'/'+this.currentDay);         // 初始化时像父级发送当前日期（没有使用watch监听时间是否改变）
        },
        methods:{
            init(time){         // 初始化
                this.currentDate = time;
                this.currentYear = time.getFullYear();
                this.currentMonth = time.getMonth();
                this.currentDay = time.getDate();       // this.tempDay || time.getDate();
                this.getMonthDays();
                this.getFirstDay();
                this.calcullateDates();
                this.showTime = this.currentYear+'/'+(this.currentMonth+1);//+'/'+this.currentDay;
            },
            isLeap(year){       // 计算闰年
                return year%100==0?(year%400==0?1:0):(year%4==0?1:0);
            },
            getMonthDays(){     // 预先设置每月天数并计算二月天数
                this.monthDays = new Array(31,28+this.isLeap(this.currentYear),31,30,31,30,31,31,30,31,30,31);
            },
            getFirstDay(){      // 获取当月第一天是星期几
                this.firstDay = new Date(this.currentYear,this.currentMonth,1).getDay();
            },
            calcullateDates(){  // 计算月内天数，共显示5行，所以循环35次，超出当月天数的要重新计算
                let tempArr = [];
                for(let i=0;i<42;i++){
                    let dateValue = i-this.firstDay+1;                                // 当月
                    let clickFlag = false;                                            // 是否可点击
                    let isActive = false;                                             // 是否选中
                    let time = {                                                      // 用于传回父级的时间
                        year:this.currentYear,
                        month:this.currentMonth+1,
                        day:dateValue
                    }
                    if(dateValue<=0&&this.currentMonth!=0){                           // 上月
                        dateValue = this.monthDays[this.currentMonth-1]+dateValue;
                        clickFlag = true;
                        time.month = this.currentMonth;
                        time.day = dateValue;
                    }else if(dateValue<=0&&this.currentMonth==0){                     // 去年
                        dateValue = this.monthDays[this.monthDays.length-1]+dateValue;
                        clickFlag = true;
                        time.year = this.currentYear-1;
                        time.month = this.currentMonth+1;
                        time.day = dateValue;
                    }else if(dateValue>this.monthDays[this.currentMonth]){            // 下月
                        dateValue = dateValue-this.monthDays[this.currentMonth];
                        clickFlag = true;
                        time.month = this.currentMonth+1+1;
                        time.day = dateValue;
                    }else if((this.today.getDate()<dateValue && this.today.getMonth()<=this.currentMonth && this.today.getFullYear()==this.currentYear) || (this.today.getMonth()<this.currentMonth && this.today.getFullYear()<=this.currentYear) || this.today.getFullYear()<this.currentYear){    // 大于今天日期不能点击
                        clickFlag = true;
                    }
                    if(dateValue == this.currentDay && this.today.getFullYear()==this.currentYear && this.today.getMonth()==this.currentMonth){    // 当天才会默认选中
                        isActive = true;
                        this.tempDay = dateValue;
                    }
                    tempArr.push({value:dateValue,flag:clickFlag,isActive,dateObj:time});
                }
                this.dateArr = tempArr;
                this.initNum++;
            },
            nextMonth(){        // 下月
                let time = new Date(this.currentYear,this.currentMonth+2,0);
                this.init(time);
            },
            preMonth(){         // 上月
                let time = new Date(this.currentYear,this.currentMonth,0);
                this.init(time);
            },
            clickDate(day,key){ // 点击事件，向父组件传递所点击的年月日
                // if(day.flag){return false;}
                if(day.dateObj.month>this.today.getMonth()+1 || (day.dateObj.month==this.today.getMonth()+1 && day.dateObj.day>this.today.getDate())){
                    return false;
                }
                if(day.dateObj.month != this.currentMonth+1){        // 点击当前区域内的灰色部分，自动跳转到上个月或者下个月。
                    if(day.dateObj.year<=this.currentYear && day.dateObj.month>this.currentMonth+1){
                        this.nextMonth();
                    }else if(day.dateObj.year>=this.currentYear && day.dateObj.month<this.currentMonth+1){
                        this.preMonth();
                    }
                }
                this.showTime = day.dateObj.year+'/'+(day.dateObj.month);//+'/'+day.dateObj.day;
                this.tempDay = day.dateObj.day;
                this.dateArr.forEach((item,index) => {
                    this.dateArr[index].isActive = (this.dateArr[index].dateObj.month==day.dateObj.month && this.dateArr[index].dateObj.day == day.dateObj.day);
                });
                this.$emit('getQueryByDate',this.showTime+'/'+day.dateObj.day);
            }
        }
    }
</script>
<style scoped>
    .dateModel *{box-sizing: border-box;margin:0;padding:0;}
    .dateModel{
        width:100%;
        height:11rem;
        background: -webkit-linear-gradient(#00a4ff, #25c8ff);
        background: -o-linear-gradient(#00a4ff, #25c8ff);
        background: -moz-linear-gradient(#00a4ff, #25c8ff);
        background: linear-gradient(#00a4ff, #25c8ff);
        color:#fff;
        font-size:0.5rem;
    }
    .dateContent{
        width:100%;
        height:100%;
    }
    .title,.weeks{
        width:100%;
        height: 1.2rem;
        line-height: 1.2rem;
        vertical-align: middle;
        border-bottom:1px solid #fff;
    }
    .title .pre,.title .next{
        width:25%;
        height: 1.2rem;
        text-align: center;
        display:inline-block;
        vertical-align: middle;
    }
    .title .text{
        width:48%;
        height: 1.2rem;
        text-align: center;
        display:inline-block;
    }
    .title i{
        display:inline-block;
        width:0.6rem;
        height: 0.6rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        background-position-y: -0.05rem;
    }
    .title .prePage{
        /* background-image:url('../assets/prePage.png'); */
        background-image: url("data:image/png;base64,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");
    }
    .title .nextPage{
        /* background-image:url('../assets/nextPage.png'); */
        background-image: url("data:image/png;base64,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");
    }
    .weeks .week,.main .day{
        width: 14.2%;
        height: 1.4rem;
        line-height:1.2rem;
        text-align:center;
        display:inline-block;
    }
    .main{
        width:100%;
        /* height:100%; */
    }
    .main .day div{
        display:block;
    }
    .main .day .value{
        height: 1rem;
        width: 1rem;
        margin: 0 auto;
        border-radius: 50%;
        color:#fff;
        line-height: 1rem;
    }
    .main .day .value.on{
        background-color: #fff;
        color:#00a4ff;
    }
    .main .day .value.disbaled{
        color:#ccc;
    }
    .main .day .parameter{
        width:0.2rem;
        height:0.2rem;
        border-radius: 50%;
        background-color: #fff;
        margin: 0.05rem auto;
    }
</style>
