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
        background-image:url('../assets/prePage.png');
    }
    .title .nextPage{
        background-image:url('../assets/nextPage.png');
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
