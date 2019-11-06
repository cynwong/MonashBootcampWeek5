
// This class construct a moment instance and handle moment related data. 
class Calendar {

    /**
     * 
     * @param {string} date 
     */
    constructor(date = "") {
        this._LOCAL_STORAGE_KEY = "events";
        this._DEFAULT_TIME_FORMAT = "L";
        this._MILLISECONDS_PER_HOUR = 3600000;
        this._events = {};
        
        this.resetCalendar(date);
    }

    // ==============
    //  GET functions
    // ==============
    
    /**
     * 
     * @param {string} format - moment.js format string
     * @returns {string} date(and time) formmatted as per format string.
     */
    getFormattedMoment(format) {
        return this._moment.format(format);
    }

    /**
     * @returns {array} array of events or empty array 
     */
    get events() {
        return this._events[this._EVENTS_KEY] ? this._events[this._EVENTS_KEY] : {};
    }

    // ==============
    //  Other function
    // ==============

    /**
     *  if valid date is given, create moment with that date
     *  Once moment is created, load related events
     * @param {string} date 
     */
    resetCalendar(date="") {
        let isValidDate = true;
        if (date !== "") {
            isValidDate = moment(date).isValid();
        }
        if (date && isValidDate) {
            //if there is date string and it is in valid moment.js's date string format
            //then create that moment
            this._moment = moment(date);
        } else {
            if (!isValidDate) {
                //if not in valid date format. throw this message and set moment object with today date. 
                console.log("Error in getting Calendar:", "Constructing calendar with today date");
            }
            this._moment = moment();
        }

        this._EVENTS_KEY = this._moment.format(this._DEFAULT_TIME_FORMAT);
        //load the events for this day. 
        this.load();
    }

    /** 
    * check if this calendar date is for past, present or future date
    * @returns {number}
    *        negative number/ -1 for past date
    *        0 for present date a.k.a Today
    *       postive number/1 for future date
    */
    whenThisDate() {
        return this._moment.format("L").localeCompare(moment().format("L"));
    }

    /** 
    * check if this calendar time is for past, present or future time
    * @param {number/ numeric string} time
    * @returns {number}
    *        negative number for past time
    *        0 for present time a.k.a now
    *        positive number for future time
    */

    whenThisTime(time = "") {
        let isSameDay = this.whenThisDate();

        if (isSameDay !== 0) {
            // if not the same day return the result of date
            return isSameDay;
        }
        // is same day, check the time.
        if (time === "") {
            //if no time given, then check the calendar time
            return this._moment.hour - moment().hour();
        } else if (typeof (time) === "number" && Number.isInteger(time)) {
            // if time data type is integer
            return time - moment().hour();
        } else if (typeof (time) === "string" && !isNaN(time)) {
            time = parseInt(time);
            return time - moment().hour();
        } else {
            console.log("Error in checking time: ", "Not a valid hour");
            return false;
        }
    }


    /** 
     * calculate the remaining time to next hour 
     * @returns {number} time in millisecond
     */
    get getTimeLeft() {
        //convert current minute, second and milliesecond to milliesecond
        const current = (((this._moment.minute() * 60) + this._moment.second()) * 1000) + this._moment.millisecond();
        return this._MILLISECONDS_PER_HOUR - current;
    }


    // ===================
    //  Storage functions
    // =================== 
    /**
        localStorage events format
            events = {
                    "11/05/2019": {
                        10 : "My event description",
                        11 : "another description",
                }
     */
    /**
     * load the events from localstorage to this._events
     */
    load() {
        if (localStorage[this._LOCAL_STORAGE_KEY]) {
            //if we have data
            this._events = JSON.parse(localStorage[this._LOCAL_STORAGE_KEY]);
        }
    }

    /**
     * update the local storage. 
     */
    save() {
        if($.isEmptyObject(this._events)){
            //if this._events is empty. delete the localStorage data as well
            if(localStorage[this._LOCAL_STORAGE_KEY]){
                localStorage.removeItem(this._LOCAL_STORAGE_KEY);
            }
            return;
        }
        localStorage.setItem(this._LOCAL_STORAGE_KEY, JSON.stringify(this._events));
    }

    /**
     * Save the event to the events object
     * 
     * @param {number} time value 00 to 23
     * @param {string} description 
     */
    saveEvent(time, description) {
        if (typeof (time) === "string" && !isNaN(time)) {
            //if time is string and numeric try converting to integer
            time = parseInt(time);
        } else if (typeof (time) !== "number") {
            // if time is not a number and numeric string
            //throw error 
            console.log("Error in storing event: invalid time value. Aborting the save...");
            return false;
        }

        if ((time <= 0 || time >= 23)){
            console.log("Error in storing event: invalid time value. Aborting the save...");
            return false;
        }

        if(description === ""){
            //if description is empty string, delete this property
            delete this._events[this._EVENTS_KEY][`${time}`];
            //check if there is any data left for this date
            //if no data then delete the date as well
            if($.isEmptyObject(this._events[this._EVENTS_KEY])){
                delete this._events[this._EVENTS_KEY];
            }
        } else {
            //if there is a description, save it.
            if(!this._events[this._EVENTS_KEY]){
                this._events[this._EVENTS_KEY] = {};
            }
            this._events[this._EVENTS_KEY][`${time}`] = description;
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
