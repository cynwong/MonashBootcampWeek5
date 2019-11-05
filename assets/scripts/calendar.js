
class Calendar {

    constructor(date="") {
        this._LOCAL_STORAGE_KEY = "events";
        this._DEFAULT_TIME_FORMAT = "L";
        
        this.resetCalendar(date);
    }

    // ==============
    //  GET functions
    // ==============
    get moment(){
        return this._moment;
    }

    get events() {
        return this._events;
    }

    // ==============
    //  Other function
    // ==============

    /**
     *  if valid date is given, create moment with that date
     *  Once moment is created, load related events
     * @param {*} date 
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
        //load the events for this day. 
        this.load();
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
    

    // calculate the remaining time to next hour 
    // return time in millisecond
    get getTimeLeft() {
        const MILLISECOND_IN_AN_HOUR = 3600000;
        //convert current minute, second and milliesecond to milliesecond
        const current = (((this._moment.minute()* 60) + this._moment.second())*1000)+ this._moment.millisecond();
        return MILLISECOND_IN_AN_HOUR - current;
    }

    
    // ===================
    //  Storage functions
    // =================== 
    /**
        localStorage events format
            events = {
                    "2019-11-01" : {
                        time : 09,
                        description : "My event description"
                }
     */
    load(){
        this._events = this.getEventsFromStorage();
        const key = this._moment.format(this._DEFAULT_TIME_FORMAT);
        if(key in this._events){
            //if there is event data for this day, then get the events
            this._events = this._events[key];
        }
        
    }
    getEventsFromStorage() {
        if (localStorage[this._LOCAL_STORAGE_KEY]) {
            //if we have data
            return JSON.parse(localStorage[this._LOCAL_STORAGE_KEY]);
            
        } 
        return {};
    }
    save() {
        let allEvents = this.getEventsFromStorage();
        const key = this._moment.format(this._DEFAULT_TIME_FORMAT);

        if (! $.isEmptyObject(this._events)){
            //only save this if we have data. 
            allEvents[key] = this._events;
        } else {
            // if empty, delete the key
            if(allEvents[key]){
                delete allEvents[key];
            }
        }
        if($.isEmptyObject(allEvents) && localStorage[this._LOCAL_STORAGE_KEY]){
            // if all events is empty object and we have data in localstorage, 
            // delete local storage data. 
            localStorage.removeItem(this._LOCAL_STORAGE_KEY);
            return; 
        }
        localStorage.setItem(this._LOCAL_STORAGE_KEY, JSON.stringify(allEvents));
    }

    /**
     * Save the event to the events object and update local storage. 
     * 
     * @param {number} time 
     * @param {string} description 
     */
    saveEvent(time, description) {
        if (typeof(time) === "string" && !isNaN(time)){
            //if time is string and numeric try converting to integer
            time = parseInt(time);
        } else if(typeof(time)!== "number" || (time>=0 && time <= 23)){
            // if time is not a number and numeric string
            //throw error 
            console.log("Error in storing event: invalid time value. Aborting the save...");
            return false;
        }
        
        this._events[`${time}`] = description;
        
        if(description === ""){
            //if desciption is empty string, delete this property
            delete this._events[`${time}`];
        }

        this.save();
    }
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
