
class Calendar {

    constructor(date="") {
        this.resetCalendar(date);
        this._LOCAL_STORAGE_KEY = "events";
    }

    get moment(){
        return this._moment;
    }

    /**
     * new date so create a new moment.  
     * date: string in the format of YYYY-MM-DD 
     *  e.g. 2019-11-22
     */
    resetCalendar(date = "") {
        let isValidDate = true;
        if(date !== ""){
            isValidDate = moment(date).isValid();
        }
        if (date && isValidDate) {
            //if there is date string and it is in valid moment.js's date string format
            //then create that moment
            this._moment = moment(date);
        } else {
            if(!isValidDate ){
                //if not in valid date format. throw this message and set moment object with today date. 
                console.log("Error in getting Calendar:","Constructing calendar with today date");
            }
            this._moment = moment();
        }
    }

    /* 
    * check if this calendar date is for past, present or future date
    * return:
    *        negative number/ -1 for past date
    *        0 for present date a.k.a Today
    *       postive number/1 for future date
    */
    whenThisDate() {
        return this._moment.format("L").localeCompare(moment().format("L"));
    }

    /* 
    * check if this calendar time is for past, present or future time
    * return:
    *        negative number for past time
    *        0 for present time a.k.a now
    *        positive number for future time
    */
    
    whenThisTime(time = "") {
        let isSameDay = this.whenThisDate();

        if(isSameDay !== 0 ){
            // if not the same day return the result of date
            return isSameDay;
        }
        // is same day, check the time.
        if(time === ""){
            //if no time given, then check the calendar time
            return this._moment.hour - moment().hour();
        } else if (typeof(time) === "number" && Number.isInteger(time)) {
            // if time data type is integer
            return time - moment().hour();
        } else if(typeof(time) === "string" && !isNaN(time)){
            time = parseInt(time);
            return time - moment().hour();
        } else {
            console.log("Error in checking time: ", "Not a valid hour");
            return false; 
        }
    }
    

    // convertTimeToMillisecond(minute, second) {
    //     return ((60 * minute) + second) * 1000;
    // }
    // get remainingSecondToNextHour() {
    //     let minute = this._moment.format("mm");
    //     let second = this._moment.format("ss");
    // }

    get events() {
        return this._events;
    }

    /**
     *  localStorage events format
     *      events = {
     *              "2019-11-01" : {
                        time : 09,
                        description : "My event description"
     *          }
     */
    // load() {
    //     if (localStorage[this._LOCAL_STORAGE_KEY]) {
    //         //if we have data
    //         this._events = JSON.parse(localStorage[this._LOCAL_STORAGE_KEY]);
    //         //now get this day's events
    //         this._events = this._events[this._moment().format("L")];
    //     } else {
    //         this._events = {};
    //     }
    // }
    // save() {
    //     localStorage.setItem(this._LOCAL_STORAGE_KEY, JSON.stringify(this._events));
    // }

    // saveEvent(event) {


    //     this.save();
    // }
}



/* calendar -
    for each day, construct row for each hours from 9AM to 5PM
    in each row, 3 cols,
        1. Hour display e.g 11AM
        2. description /event
        3. save button

    when user click in the description area, they are allowed to type the description
    1. save to localStorage for now.
        1. when user leave the textarea .focusout
        2. when user press enter
        3. when user click save button.

    when user change the date/ start with today date
    1. load the day's contents.



*/
