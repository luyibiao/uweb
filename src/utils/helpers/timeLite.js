import 'date-format-lite'

const DATE_TIME_FORMATTER = 'YYYY-MM-DD hh:mm:ss'
const DATE_FORMATTER = 'YYYY-MM-DD'
const DATE_FORMATTER_CONCISE = 'MM/DD/YYYY'
const TIME_FORMATTER = 'hh:mm:ss'
const TIME_FORMAMM='YYYY-MM'

export default {
  name: 'time',

  /**
   * 格式化时间
   * @param {string} time 时间
   * @param {string} formatter 格式
   * @return {string}
   */
  format (time, formatter) {
    return time ? time.date(formatter) : ''
  },

  /**
   * 年-月-日 时:分:秒
   * @param {string} time 时间
   * @return {string}
   */
  getDateTime (time) {
    return this.format(time, DATE_TIME_FORMATTER)
  },

  /**
   * 年-月-日
   * @param {string} time 时间
   * @return {string}
   */
  getDate (time) {
    return this.format(time, DATE_FORMATTER)
  },
  /**
   * 年/月/日
   * @param {string} time 时间
   * @return {string}
   */
  getDateConcise (time) {
    return this.format(time, DATE_FORMATTER_CONCISE)
  },

  /**
   * 时:分:秒
   * @param {string} time 时间
   * @return {string}
   */
  getTime (time) {
    return this.format(time, TIME_FORMATTER)
  },

  /**
   * 在 time 基础上加 unit 秒、分钟...
   * @param {string} time 时间
   * @param {string} num 数量
   * @param {string} unit 单位（eg: seconds, minutes, hours, days, weeks, months, years）
   */
  add (time, num, unit) {
    time = this.format(time, DATE_TIME_FORMATTER)
    if(!time) return
    return new Date(time.replace(/-/g,"/")).add(num, unit)
  },
  /**
   *  比较日期相差数  默认天
   * @param startDate 开始日期 yyyy-mm-dd
   * @param endDate  截止日期 yyyy-mm-dd
   * @param unit 单位 （eg: seconds, minutes, hours, days, weeks, months, years）
   */
  difference(startDate, endDate, unit, absFlag){
    let iDays, dateSpan
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    dateSpan = endDate - startDate;
    dateSpan = absFlag ? dateSpan : Math.abs(dateSpan);
    let unitNum;
    switch (unit){
      case 'months' :
        break;
      case 'minutes' :
        unitNum = 1000*60;
        break
      default :
        unitNum = 24 * 3600 * 1000;
        break;
    }
    return Math.floor(dateSpan/unitNum);
  }
}
