
class dayCalendarRenderer {

    constructor(calendar) {
        //DOM ELements
        this._currentDay = $("#currentDay");
        this._container = $(".container-fluid");

        //renderer defaults
        this._calendar = calendar; 

        //calendar data. 
        this._startHour = 9;
        this._endHour = 17;
        this._timeFormat = "12h"; //24h or 12h time format. 

        //default strings
        this._SUFFIX_AM = "AM";
        this._SUFFIX_PM = "PM";
        this._CLASSNAME_PAST = "past";
        this._CLASSNAME_PRESENT = "present";
        this._CLASSNAME_FUTURE = "future";
        this._DISPLAY_DATE_FORMAT = "dddd, MMMM Do";

        this.resetDisplay();
    }

    resetDisplay() {
        this.displayDate();
        this.renderDayView();
    }

    get is12hTimeFormat() {
        return this._timeFormat.localeCompare("12h") === 0;
    }
    //display date in p#currentDay 
    displayDate() {
        this._currentDay.html(this._calendar.moment.format(this._DISPLAY_DATE_FORMAT));
    }

    // check the time given is in past, present or future and return appropriate class. 
    getTimeClass(time) {
        let checkTime = this._calendar.whenThisTime(time);
        if (checkTime < 0 ){
            //if negative number, then it is in the past
            return this._CLASSNAME_PAST;
        }else if (checkTime === 0 ){
            //if equal to 0, then it is present
            return this._CLASSNAME_PRESENT
        } else if( checkTime > 0){
            //if positive number,  it is in future
            return this._CLASSNAME_FUTURE;
        }
    }

    renderHourlyDisplay(hour) {

        let timeClass = this.getTimeClass(hour);

        //check if we need fix and how to display the time. 
        let suffix = this.is12hTimeFormat ? this._SUFFIX_AM : "";
        if (hour >= 12 && this.is12hTimeFormat) {
            //afternoon, time suffix needs to be changed. 
            if (hour > 12) { hour -= 12; }
            suffix = this.is12hTimeFormat ? this._SUFFIX_PM : "";
        }

        return $("<div />", { "class": "row" }).append(
            $("<div />", {
                "class": "col-2 col-sm-1 hour",
                "text": hour+suffix,
            }),
            $("<div />", {
                "class": "col-8 col-sm-10 description " + timeClass,
            }).append($("<textarea>")),
            $("<div />", {
                "class": "col-2 col-sm-1 saveBtn",
                "html": '<span class="fa fa-save"></span>',
            }));
    }

    renderDayView() {
        let hourContainer;
        for (let i = this._startHour; i <= this._endHour; i++) {
            this._container.append(this.renderHourlyDisplay(i));
        }
    }
};
