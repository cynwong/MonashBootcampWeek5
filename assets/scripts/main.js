

$(document).ready(function(){

    let secondLeftToNextHour;
    let currentMoment = new Calendar();
    let renderer= new dayCalendarRenderer(currentMoment);
    
    function resetDisplay() {
        renderer.displayDate();
        renderer.renderDayView();

        if(currentMoment.whenThisDate()===0 && moment().hour() > renderer._startHour && moment().hour() < renderer._endHour) {
            //TODO this is not working, yet. so 
            // if same day, re-render the page every hours
            console.log("refresh until: ", currentMoment.getTimeLeft);
            // setTimeout(this.resetDisplay,this._calendar.getTimeLeft);
             setTimeout(resetDisplay,1000);

        }
    }
    
    
    //init
    resetDisplay();




    // =====================
    //  Event Listeners
    // =====================
    $(".saveBtn").click( function(){
        const hour = $(this).siblings(".hour").attr("data-hour");
        const description = $(this).siblings(".description").children("textarea").val();
        currentMoment.saveEvent(hour, description);
    });
    

});


/* User interaction with calendar
// user click in description box to add event description 
// then click "save button" to save the event => modify the events object and save the events to localstorage
// If the day is today, Calendar should have a function that 
//              * get the current minutes and seconds 
//              * and calculate secondremaining to next hour
                * use setTimeout to fire up the callback function to re-render the calendar. 
                * calendar need to change the color that show current hour. 

*/