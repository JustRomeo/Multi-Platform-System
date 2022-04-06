
class Horloge {
    param = "";

    constructor(actionParameter) {
        this.param = actionParameter;
    }

    async areaFunc() {
        if (this.param[0] === "isEndOfWeek") {
            return (this.endOfWeek());
        }
        if (this.param[0] === "isSomeHour") {
            return (this.isSomeHour());
        }
    }

    isSomeHour() {
        var reference = new Date();
        var offset = Math.abs(reference.getTimezoneOffset() / 60);
        var hour = parseInt(this.param[1]) + offset;
        var date = new Date();
        var d2 = new Date();
        date.setHours(date.getHours() + offset)
        d2.setHours(hour, 0, 0, 0);
        // console.log(date);
        // console.log(d2)
        if (d2 < date)
            return (d2)
        return (null)
    }

    endOfWeek() {
        var d = new Date()
        d = new Date(d);
        d.setHours(1, 0, 0, 0);
        var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1);
        return new Date(d.setDate(diff));
    }
}

// var horloge = new Horloge(["isSomeHour", "14"])
// console.log(horloge.isSomeHour())

module.exports = Horloge;