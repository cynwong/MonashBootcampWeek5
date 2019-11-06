
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

    // =================
    //    GET functions
    // =================

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

    /**
     * check if this moment is today
     * @return {boolean} 
     */
    get isToday() {
        return moment().isSame(this._moment, 'day');
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

    // ==================
    //   Other functions
    // ==================

    /**
     *  if valid date is given, create moment with that date
     *  Once moment is created, load related events
     * @param {string} date 
     */
    resetCalendar(date = "") {
        this._moment = moment(date);
        if (!this._moment.isValid()) {
            if (date !== "") {
                //if date is not empty string then date is in valid date format. 
                // so throw this message
                console.log("Error in getting Calendar:", "Constructing calendar with today date");
            }
            //set default moment, .i.e. now. 
            this._moment = moment();
        }

        this._EVENTS_KEY = this._moment.format(this._DEFAULT_TIME_FORMAT);
        //load the events for this day. 
        this.load();
    }

    /** 
    * check if this calendar date is for past, present or future date
    * @returns {number} value -1, 0 or 1
    *       -1 for past date
    *        0 for present date a.k.a Today
    *        1 for future date
    */
    checkStatus(date = "") {
        if (this.isToday === true) {
            //if today,
            return 0;
        } else if (this._moment.isBefore(moment()) === true) {
            //past
            return -1;
        } else if (this._moment.isAfter(moment()) === true) {
            //future
            return 1;
        }
    }

    /** 
    * check if this calendar time is for past, present or future time
    * @param {number} time expected value 0 to 23
    * @returns {number}
    *       -1 for past time
    *        0 for present time a.k.a now
    *        1 for future time
    */
    checkStatusByTime(time = "") {
        const isSameDay = this.checkStatus();
        if (isSameDay !== 0) {
            //if not the same day, then return the result date. 
            return isSameDay;
        }
        let givenTime = moment(time, "hour");
        if (!givenTime.isValid()) { givenTime = moment(); }
        //if same day, check the time
        if (this._moment.isSame(givenTime, "hour")) {
            return 0;
        } else if (this._moment.isAfter(givenTime, "hour")) {
            // if past hour
            return -1;
        } else if (this._moment.isBefore(givenTime, "hour")) {
            return 1;
        }
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
        if ($.isEmptyObject(this._events)) {
            //if this._events is empty. delete the localStorage data as well
            if (localStorage[this._LOCAL_STORAGE_KEY]) {
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

        if ((time <= 0 || time >= 23)) {
            console.log("Error in storing event: invalid time value. Aborting the save...");
            return false;
        }

        if (description === "") {
            //if description is empty string, delete this property
            delete this._events[this._EVENTS_KEY][`${time}`];
            //check if there is any data left for this date
            //if no data then delete the date as well
            if ($.isEmptyObject(this._events[this._EVENTS_KEY])) {
                delete this._events[this._EVENTS_KEY];
            }
        } else {
            //if there is a description, save it.
            if (!this._events[this._EVENTS_KEY]) {
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
        3. when user click save button.

    when user change the date/ start with today date
    1. load the day's contents.
*/
