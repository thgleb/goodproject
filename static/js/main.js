var Slider = function(slider) {
    this.slider = slider;

    var slides = slider.querySelectorAll(".slide");

    this.activeSlide = slides[0];
    this.slidesLength = slider.querySelectorAll(".slide").length;

    this.arrows = {};
    this.autoClick = 0;
    this.autoClickMode = true;

    // initialization
    (function(init) {

        init.arrows = {
            prev: init.slider.querySelector(".a-prev"),
            next: init.slider.querySelector(".a-next")
        };

        init.arrows.prev.onclick = function() {
            init.arrowPrev();
        };

        init.arrows.next.onclick = function() {
            init.arrowNext();
        };

        if (init.autoClickMode === true && init.slidesLength > 1) {
            init.slider.onmouseover = function() { // Hover
                clearTimeout(init.autoClick);
                init.autoClick = null;
            };

            init.autoClick = setInterval(function() {
                init.arrowNext();
            }, 5000);

            init.slider.onmouseout = function() { // Off Hover
                if (init.autoClick === null) {
                    init.autoClick = setInterval(function() {
                        init.arrowNext();
                    }, 5000);
                };
            };
        };

        if (init.slidesLength === 1) {
            init.arrows.next.style.display = "none";
            init.arrows.prev.style.display = "none";
        };

    })(this);

    this.isSlideLast = function(slide) {
        var slides = this.slider.querySelectorAll(".slide"),
            length = slides.length;

        for (var i = 0; i < length; i++) {
            if (slides[i] === slide) {
                return (i + 1) === length;
            };
        };
    };

    this.isSlideFirst = function(slide) {
        return this.slider.querySelector(".slide") === slide;
    };

    this.getFirstSlide = function() {
        return this.slider.querySelector(".slide");
    };

    this.getLastSlide = function() {
        var slides = this.slider.querySelectorAll(".slide"),
            length = slides.length;

        return slides[length - 1];
    };

    this.arrowPrev = function() {
        var slides = this.slider.querySelectorAll(".slide"),
            length = slides.length;

        if (length > 1 === false) {
            return;
        };

        for (var i = 0; i < length; i++) {
            if (slides[i] === this.activeSlide) {
                var prevSlide,
                    activeSlide = this.activeSlide;

                if (i - 1 === -1) {
                    prevSlide = this.getLastSlide();
                } else {
                    prevSlide = slides[i - 1];
                };

                this.resetOpacity();

                prevSlide.className = "slide active";
                activeSlide.className = "slide active";

                activeSlide.style.zIndex = 1;
                activeSlide.style.opacity = 1;

                var animation = setInterval(function() {
                    var opacity = parseFloat(activeSlide.style.opacity);

                    activeSlide.style.opacity = opacity - 0.25;

                    if (activeSlide.style.opacity <= -0.25) {
                        clearInterval(animation);

                        activeSlide.style.opacity = null;
                        prevSlide.style.opacity = null;

                        activeSlide.className = "slide";
                        activeSlide.style.zIndex = null;
                    };
                }, 20);

                this.activeSlide = prevSlide;

                break;
            };
        };
    };

    this.arrowNext = function() {
        var slides = this.slider.querySelectorAll(".slide"),
            length = slides.length;

        if (length > 1 === false) {
            return;
        };

        for (var i = 0; i < length; i++) {
            if (slides[i] === this.activeSlide) {
                var nextSlide,
                    activeSlide = this.activeSlide;

                if (i + 1 === length) {
                    nextSlide = this.getFirstSlide();
                } else {
                    nextSlide = slides[i + 1];
                };

                this.resetOpacity();

                nextSlide.className = "slide active";
                activeSlide.className = "slide active";

                nextSlide.style.opacity = 1;
                activeSlide.style.opacity = 1;

                activeSlide.style.zIndex = 1;

                var animation = setInterval(function() {
                    var opacity = parseFloat(activeSlide.style.opacity);

                    activeSlide.style.opacity = opacity - 0.25;

                    if (activeSlide.style.opacity <= 0) {
                        clearInterval(animation);

                        nextSlide.style.opacity = null;
                        activeSlide.style.opacity = null;

                        activeSlide.style.zIndex = null;

                        activeSlide.className = "slide";
                    };
                }, 20);

                this.activeSlide = nextSlide;

                break;
            };
        };
    };

    this.resetOpacity = function() {
        var slides = this.slider.querySelectorAll(".slide");

        for (var i = slides.length - 1; i >= 0; i--) {
            slides[i].style.opacity = null;
        };
    };
};

// All dropdowns
var allDropdowns = [];

/**
 * [something will be here, but not today]
 *
 * @param HTMLElement dropdownCore A main element which has "dropdown" class.
 * @param Function    initCallback Initial callback.
 * @param Function    ocDbCallback This function is called when a dropbox closes or opens.
 * @param Function    hOCCallback  This function is called when an option is selected.
 * @param Function    rCSOCallback This function is called when the selected options become unselected.
 *
 * @return itself
 */
var Dropdown = function(dropdownCore, initCallback, hOCCallback, ocDbCallback, rCSOCallback) {
    this.ddCore = dropdownCore;
    this.ddTitle = dropdownCore.querySelector(".dd-title span");
    this.initialDdTitle = this.ddTitle.innerHTML;
    this.ddOptions = dropdownCore.querySelectorAll(".dd-options li");

    this.selectedOptions = [];
    this.multiSelect = this.ddCore.hasAttribute("data-multiselect");

    this.openClose = function() {
        var state;

        if (this.ddCore.hasAttribute("data-opened") === true) {
            this.ddCore.removeAttribute("data-opened");
            state = "closed";
        } else {
            for (var i = allDropdowns.length - 1; i >= 0; i--) {
                allDropdowns[i].removeAttribute("data-opened");
            };

            this.ddCore.setAttribute("data-opened", "");
            state = "opened";
        };

        if (ocDbCallback instanceof Function) {
            ocDbCallback(this, state);
        };
    };

    this.optionSetState = function(option) {
        var index = this.selectedOptions.indexOf(option.getAttribute("data-id"));

        if (index > -1) {
            option.removeAttribute("data-selected");
            this.selectedOptions.splice(index, 1);
        } else {
            option.setAttribute("data-selected", "");
            this.selectedOptions.push(option.getAttribute("data-id"));
        };

        this.ddCore.setAttribute("data-selected", JSON.stringify(this.selectedOptions));
    };

    this.setSelectedOption = function(option) {
        this.optionSetState(option);

        if (this.selectedOptions.length === 1) {
            var lastOption = this.ddCore.querySelector(".dd-options li[data-selected]");

            if (lastOption.hasAttribute("data-not-change") === true) {
                // Изменять this.ddTitle при выборе элемента на первоначальное
                // значение, а не значение данного option.
                this.ddTitle.innerHTML = this.initialDdTitle;
            } else {
                this.ddTitle.innerHTML = lastOption.innerHTML;
            };
        } else {
            this.ddTitle.innerHTML = this.selectedOptions.length+" "+decline(
                this.selectedOptions.length, [
                    "выбран", "выбрано", "выбрано"
                ]
            );
        };
    };

    this.removeCurrentSelectedOption = function() {
        var i,
            len;

        for (i = 0, len = this.ddOptions.length; i < len; i++) {
            this.ddOptions[i].removeAttribute("data-selected");
        };

        this.selectedOptions = [];

        if (rCSOCallback instanceof Function) {
            rCSOCallback(this);
        };
    };

    this.handleOptionClick = function(option) {
        if (this.multiSelect) {
            this.setSelectedOption(option);
        } else {
            this.removeCurrentSelectedOption();
            this.setSelectedOption(option);
            this.openClose();
        };

        if (hOCCallback instanceof Function) {
            hOCCallback(this, option);
        };
    };

    this.getSelectedOptionId = function() {
        return this.ddCore.getAttribute("data-selected");
    };

    // init
    (function(init) {
        var i,
            len,
            option,
            selectedOption = false;

        init.ddTitle.onclick = function() {
            init.openClose();
        };

        for (i = 0, len = init.ddOptions.length; i < len; i++) {
            option = init.ddOptions[i];

            option.onclick = function() {
                init.handleOptionClick(this);
            };

            if (option.hasAttribute("data-id") === false) {
                option.setAttribute("data-id", i);
            };

            if (option.hasAttribute("data-selected") === true
                && selectedOption === false) {

                init.setSelectedOption(option);
                selectedOption = true;
            };
        };

        if (selectedOption === false) {
            init.setSelectedOption(init.ddOptions[0]);
        };

        if (initCallback instanceof Function) {
            initCallback(init);
        };

        allDropdowns.push(init.ddCore);
    })(this);

    return this;
};

/**
 * @param callback This function is called when a day is selected. (after loading the page)
 * @param callback This function is called when a calendar opens or closes.
 */
var Calendar = function(calendarCore, callback, ocCallback) {

    this.calendarCore = calendarCore;
    this.calendarTitle = this.calendarCore.querySelector(".dtp-title");
    this.calendarMonthYear = this.calendarCore.querySelector(".dtp-month-name span");
    this.calendarTable = this.calendarCore.querySelector(".dtp-table");

    this.date = undefined;
    this.markedDay = undefined;

    this.calendarNavs = {
        prev: this.calendarCore.querySelector("[data-arrow='left']"),
        next: this.calendarCore.querySelector("[data-arrow='right']")
    };

    this.entities = {
        months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль",
                 "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],

        monthsInDeclination: ["января", "февраля", "марта", "апреля", "мая",
                                "июня", "июля",  "августа", "сентября", "октября",
                                "ноября", "декабря"]
    };

    this.openClose = function() {
        var state;

        if (this.calendarCore.hasAttribute("data-opened") === true) {
            this.calendarCore.removeAttribute("data-opened");
            state = "closed";
        } else {
            for (var i = allDropdowns.length - 1; i >= 0; i--) {
                allDropdowns[i].removeAttribute("data-opened");
            };

            this.calendarCore.setAttribute("data-opened", "");
            state = "opened";
        };

        if (ocCallback instanceof Function) {
            ocCallback(this, state);
        };
    };

    this.getFirstDay = function(month, year) {
        return new Date(year, month, 1).getDay();
    };

    /**
     * @param int shift Should be negative
     */
    this.getTheLastOfDays = function(month, year, shift) {
        var shift = isNaN(shift) ? 0 : shift,
            daysInMonth = this.monthLength(month, year);

        return daysInMonth + shift;
    };

    this.monthLength = function(month, year) {
        return (new Date(year, ++month, 0)).getDate();
    };

    this.showMonth = function(date) {
        var currentDate = date,
            currentMonth = parseInt(currentDate.getMonth()),
            currentYear = parseInt(currentDate.getFullYear()),
            monthYear;

        monthYear = this.entities.months[currentMonth] + " / " + currentYear;
        this.calendarMonthYear.textContent = monthYear;

        var day = 1,
            anotherMonthDay = 1,

            prevDate,
            prevMonthDay = 0,
            prevMonthDays = [],

            startingDay = this.getFirstDay(currentMonth, currentYear),
            monthLength = this.monthLength(currentMonth, currentYear),
            html = "<tr>";

        // this loop is for is weeks (rows)
        for (var i = 0; i < 9; i++) {

            // this loop is for weekdays (cells)
            for (var j = 1; j <= 7; j++) {

                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    html += "<td data-id=\"" + day + "\"><span>";
                    html += day;

                    day++;
                } else {
                    // another month
                    html += "<td class=\"non-match\"><span>";

                    if (day > 27) { // next month
                        html += anotherMonthDay;
                        anotherMonthDay++;
                    } else { // prev month
                        if (prevMonthDay === 0) {
                            prevDate = shiftMonth("prev", currentDate);

                            prevMonthDay = this.getTheLastOfDays(
                                parseInt(prevDate.getMonth()),
                                parseInt(prevDate.getFullYear()),
                                0
                            );
                        } else {
                            prevMonthDay--;
                        };

                        prevMonthDays.push(prevMonthDay);
                    };
                };

                html += "</span></td>";
            };

            // stop making rows if we've run out of days
            if (day > monthLength) {
                break;
            } else {
                html += "</tr><tr>";
            };
        };

        html += "</tr>";

        // FIX!
        // this.calendarTable.insertAdjacentHTML("beforeend", html);
        setTableBodyInnerHTML(
            this.calendarTable.querySelector("tbody"),
            (this.calendarTable.querySelector("tbody").innerHTML + html)
        );

        // replace empty cells of a prev. month
        (function(self) {
            prevMonthDays.reverse();

            var nonMatchCells = self.calendarTable.querySelectorAll(".non-match");

            for (var i = 0; i < nonMatchCells.length; i++) {
                if (prevMonthDays[i] === undefined) {
                    break;
                };

                nonMatchCells[i].innerHTML = prevMonthDays[i];
            };
        })(this);


        // setting onclick action
        (function(self) {
            var days = self.calendarTable.querySelectorAll("[data-id]"),
                i;

            for (i = 0; i < days.length; i++) {
                days[i].onclick = function() {
                    self.setDay(
                        parseInt(this.getAttribute("data-id")),
                        currentMonth,
                        currentYear
                    );

                    self.setDayHTML();

                    self.openClose();
                };
            };
        })(this);
    };

    this.clearTable = function() {
        var trs = this.calendarTable.querySelectorAll("tr");

        for (var i = 1; i < trs.length; i++) {
            trs[i].parentNode.removeChild(trs[i]);
        };
    };

    this.removeAllChosenDays = function() {
        var days = this.calendarTable.querySelectorAll(".chosen"),
            i;

        for (i = 0; i < days.length; i++) {
            days[i].classList.remove("chosen");
        };
    };

    this.setDay = function(id, month, year) {
        this.removeAllChosenDays();

        var day = this.calendarTable.querySelector("[data-id='" + id + "']");

        // FIX!
        if (day) {
            day.classList.add("chosen");
        };

        this.markedDay = {
            dayId: id,
            month: month, // this isn't a real month, a real month is month++
            year: year
        };
    };

    this.setDayHTML = function() {
        var date = String.format(
            "{0}-{1}-{2}",
            this.markedDay.year,
            (this.markedDay.month + 1),
            this.markedDay.dayId
        );

        this.calendarCore.setAttribute("data-time", date);

        date = String.format(
            "<span class='bl'>Дата: <span>{0} {1} {2}</span></span>",
            this.markedDay.dayId,
            this.entities.monthsInDeclination[this.markedDay.month],
            this.markedDay.year
        );

        this.calendarTitle.innerHTML = date;

        if (callback instanceof Function) {
            callback(this);
        };
    };

    this.blockNextMonthButton = function() {
        var currentDate = new Date();

        if (this.date.getMonth() === currentDate.getMonth()
            && this.date.getFullYear() === currentDate.getFullYear()) {

            this.calendarNavs.next.setAttribute("data-nomore", "");
            return true;
        };
    };

    // Mark day again if date is the same
    this.setDayAgain = function() {
        if (this.date.getMonth() === this.markedDay.month
            && this.date.getFullYear() === this.markedDay.year) {

            this.setDay(
                this.markedDay.dayId,
                this.markedDay.month,
                this.markedDay.year
            );
        };
    };

    this.switchMonthToPrev = function() {
        this.clearTable();

        this.date = shiftMonth("prev", this.date);
        this.showMonth(this.date);
        this.setDayAgain();

        if (this.blockNextMonthButton() !== true) {
            this.calendarNavs.next.removeAttribute("data-nomore");
        };
    };

    this.switchMonthToNext = function() {
        if (this.blockNextMonthButton() === true) {
            return;
        };

        this.clearTable();

        this.date = shiftMonth("next", this.date);
        this.showMonth(this.date);

        this.setDayAgain();

        this.blockNextMonthButton();
    };

    // init
    (function(init) {
        init.date = new Date();

        init.showMonth(init.date);

        init.setDay(
            init.date.getDate(),
            init.date.getMonth(),
            init.date.getFullYear()
        );

        init.calendarTitle.onclick = function() {
            init.openClose();
        };

        init.calendarNavs.prev.onclick = function() {
            init.switchMonthToPrev();
        };

        init.calendarNavs.next.onclick = function() {
            init.switchMonthToNext();
        };

        allDropdowns.push(init.calendarCore);
    })(this);
};

var Switcher = function(switcherCore, itemSelectedCallback) {
    this.switcherCore = switcherCore;
    this.elements = this.switcherCore.querySelectorAll("li");

    this.reset = function() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].removeAttribute("data-active");
        };
    };

    this.selectItem = function(item) {
        item.setAttribute("data-active", "");
        this.switcherCore.setAttribute("data-selected", item.getAttribute("data-id"));
    };

    (function(init) {
        var thereIsActiveEl = false;

        for (var i = 0; i < init.elements.length; i++) {
            (function(item) {
                if (item.hasAttribute("data-id") === false) {
                    item.setAttribute("data-id", i);
                };

                if (thereIsActiveEl === false && item.hasAttribute("data-active")) {
                    thereIsActiveEl = true;
                };

                item.onclick = function() {
                    init.reset();
                    init.selectItem(item);
                    itemSelectedCallback(item);
                };
            })(init.elements[i]);
        };

        if (thereIsActiveEl === false) {
            init.selectItem(init.elements[0]);
        };
    })(this);
};

domLoaded.add(function() { // header nav paddings
    var headerNavMain,
        headerNavAbout;

    headerNavMain = document.querySelectorAll("#header-nav-main li a");
    headerNavAbout = document.querySelectorAll("#header-nav-about li a");

    if (headerNavMain && headerNavAbout) {
        headerNavMain[0].classList.add("f-child");
        headerNavMain[headerNavMain.length - 1].classList.add("l-child");

        headerNavAbout[0].classList.add("f-child");
        headerNavAbout[headerNavAbout.length - 1].classList.add("l-child");
    };
});

domLoaded.add(function() {
    // set medium font for PF

    var css = '\
        @font-face {\
            font-family: "PF Din Text Comp Pro";\
            font-style: normal;\
            font-weight: {fw};\
            src: local("PF Din Text Comp Pro"), local("PFDinTextCompPro"),\
                 url("static/fonts/pfdintextcomppro-medium-webfont.eot");\
            src: local("PF Din Text Comp Pro"), local("PFDinTextCompPro"),\
                 url("static/fonts/pfdintextcomppro-medium-webfont.eot?#iefix") format("embedded-opentype"),\
                 url("static/fonts/pfdintextcomppro-medium-webfont.woff") format("woff"),\
                 url("static/fonts/pfdintextcomppro-medium-webfont.ttf") format("truetype"),\
                 url("static/fonts/pfdintextcomppro-medium-webfont.svg#aleobold") format("svg");\
        }\
        h3 {\
            font-weight: {fw};\
        }';

    if (browserDetection() === "Windows") {
        css = css.replace(/\{fw\}/g, 700);
    } else {
        css = css.replace(/\{fw\}/g, 500);
    };

    var styleEl = document.createElement("style");
    styleEl.innerHTML = css;

    document.body.appendChild(styleEl);
});

var DropboxesConsts = (function() {
    var dropdownsClosing = function(self, state) {
        if (state === "opened") {
            document.onclick = function(e) {
                var target = (e && e.target) || (event && event.srcElement),
                    close = true;

                while (target.parentNode) {
                    if ((self.hasOwnProperty("ddCore") && target === self.ddCore) ||
                        (self.hasOwnProperty("calendarCore") && target === self.calendarCore)) {

                        close = false;
                        break;
                    };

                    target = target.parentNode;
                };

                if (close === true) {
                    self.openClose();
                    document.onclick = null;
                };
            };
        } else {
            document.onclick = null;
        };
    };

    var selectRestsPhotosOption = function(self, option) {
        if (self.selectedOptions.length === 1
            && self.ddOptions[0].hasAttribute("data-selected") === false) {

            // Если выделен 1 ресторан, при этом первая опция не выделена
            // Сделать заголовок следующего вида:
            self.ddTitle.innerHTML = "<span>Ресторан:</span> " + self.ddTitle.innerHTML;

        } else if (self.selectedOptions.length === 0) {

            // Если не выделено ни одной опции, то выделить первую.
            self.setSelectedOption(self.ddOptions[0]);

        } else if (self.selectedOptions.length >= 2) {

            console.log(
                self.ddOptions[0].hasAttribute("data-selected") === false
                && self.selectedOptions.length === self.ddOptions.length - 1
            );

            if (
                option !== self.ddOptions[0]
                && self.ddOptions[0].hasAttribute("data-selected")
            ) { // Выделено +2 элемента, один из которых - первая опция,
                // которая _уже_ была выделена

                // убираем выделение у первой опции
                self.optionSetState(self.ddOptions[0]);

                self.ddTitle.innerHTML = "<span>Ресторан: </span>" + option.innerHTML;

            } else if (
                self.ddOptions[0].hasAttribute("data-selected") === false
            ) { // Выделено >= 2 элемента. Первый элемент не выделен

                self.ddTitle.innerHTML = "<span>Рестораны: </span>" + self.selectedOptions.length + " " + decline(self.selectedOptions.length, [
                    "выбран", "выбрано", "выбрано"
                ]);

                // Выделены все элементы
                if (self.selectedOptions.length === self.ddOptions.length - 1) {
                    for (var i = self.ddOptions.length - 1; i >= 0; i--) {
                        self.optionSetState(self.ddOptions[i]);
                    };

                    self.ddTitle.innerHTML = self.initialDdTitle;
                };

            } else if (
                option === self.ddOptions[0] &&
                self.ddOptions[0].hasAttribute("data-selected")
            ) { // Осуществлен клик по первой опции, которая уже была выделена
                // Убираем выделение у всех элеменов, кроме первого,
                // ставя заголовок в начальное положение

                for (var i = self.ddOptions.length - 1; i >= 1; i--) {
                    if (self.ddOptions[i].hasAttribute("data-selected")) {
                        self.optionSetState(self.ddOptions[i]);
                    };
                };

                self.ddTitle.innerHTML = self.initialDdTitle;

            };

        };
    };

    var selectRestsOption = function(self, option) {
        if (self.selectedOptions.length === 1
            && self.ddOptions[0].hasAttribute("data-selected") === false) {

            // Если выделен 1 ресторан, при этом первая опция не выделена
            // Сделать заголовок следующего вида:
            self.ddTitle.innerHTML = self.ddTitle.innerHTML;

        } else if (self.selectedOptions.length === 0) {

            // Если не выделено ни одной опции, то выделить первую.
            self.setSelectedOption(self.ddOptions[0]);

        } else if (self.selectedOptions.length >= 2) {

            if (
                option !== self.ddOptions[0]
                && self.ddOptions[0].hasAttribute("data-selected")
            ) { // Выделено +2 элемента, один из которых - первая опция,
                // которая _уже_ была выделена

                // убираем выделение у первой опции
                self.optionSetState(self.ddOptions[0]);

                self.ddTitle.innerHTML = option.innerHTML;

            } else if (
                self.ddOptions[0].hasAttribute("data-selected") === false
            ) { // Выделено >= 2 элемента. Первый элемент не выделен

                self.ddTitle.innerHTML = "<span>Рестораны: </span>" + self.selectedOptions.length + " " + decline(self.selectedOptions.length, [
                    "выбран", "выбрано", "выбрано"
                ]);

                // Выделены все элементы
                if (self.selectedOptions.length === self.ddOptions.length - 1) {
                    for (var i = self.ddOptions.length - 1; i >= 0; i--) {
                        self.optionSetState(self.ddOptions[i]);
                    };

                    self.ddTitle.innerHTML = self.initialDdTitle;
                };

            } else if (
                option === self.ddOptions[0] &&
                self.ddOptions[0].hasAttribute("data-selected")
            ) { // Осуществлен клик по первой опции, которая уже была выделена
                // Убираем выделение у всех элеменов, кроме первого,
                // ставя заголовок в начальное положение

                for (var i = self.ddOptions.length - 1; i >= 1; i--) {
                    if (self.ddOptions[i].hasAttribute("data-selected")) {
                        self.optionSetState(self.ddOptions[i]);
                    };
                };

                self.ddTitle.innerHTML = self.initialDdTitle;

            };

        };
    };

    return {
        DROPDOWNS_CLOSING: dropdownsClosing,
        SELECT_RESTS_PHOTOS_OPTION: selectRestsPhotosOption,
        SELECT_RESTS_OPTION: selectRestsOption
    };
})();

var paths = {
    homePage: "index.html",
    restsPage: "rests.html",
    articlesPage: "articles.html"
};

var pathChecker = function(path) {
    // ONLY FOR DEVELOPMENT ON LOCALHOST!
    var locationLocalhost = location.pathname
                                    .match(/\/([A-Za-z\.]+)$/g)[0]
                                    .substring(1);

    // return location.pathname.indexOf(path);
    return locationLocalhost.indexOf(path);
};

if (pathChecker(paths.homePage) === 0) {
    domLoaded.add(function() {
        // Slider
        new Slider($id("slider"));

        // Dropdowns
        var photoReportsRestsDd = new Dropdown(
            $id("photoreports-rests"), null,
            DropboxesConsts.SELECT_RESTS_PHOTOS_OPTION, DropboxesConsts.DROPDOWNS_CLOSING
        );

        var dropdownRests = new Dropdown(
            $id("dropdown-rests"), null,
           DropboxesConsts.SELECT_RESTS_OPTION, DropboxesConsts.DROPDOWNS_CLOSING
        );

        var photoReportsDates = new Calendar(
            $id("photoreports-dates"), null, DropboxesConsts.DROPDOWNS_CLOSING
        );

        // Restaurants: types of views
        Switcher($id("rests-show-type"), function(item) {
            console.log(
                "Restaurants: types of views. View type:",
                item.getAttribute("data-id")
            );
        });
    });
} else if (pathChecker(paths.restsPage) === 0) {
    domLoaded.add(function() {
        // Slider
        new Slider($id("slider"));

        // Dropdown: types of restaurants
        var dropdownRests = new Dropdown(
            $id("dropdown-rests"), null,
            DropboxesConsts.SELECT_RESTS_OPTION, DropboxesConsts.DROPDOWNS_CLOSING
        );

        // Restaurants: types of views
        Switcher($id("rests-show-type"), function(item) {
            console.log(
                "Restaurants: types of views. View type:",
                item.getAttribute("data-id")
            );
        });
    });
} else if (pathChecker(paths.articlesPage) === 0) {
    domLoaded.add(function() {
        // Slider
        Slider($id("slider"));

        // Dropdown: type of articles' order
        var articlesOrder = new Dropdown(
            $id("dropdown-articles-sort"), null, null,
            DropboxesConsts.DROPDOWNS_CLOSING
        );

        // Restaurants: types of views
        Switcher($id("articles-show-type"), function(item) {
            console.log(
                "Articles: types of views. View type:",
                item.getAttribute("data-id")
            );
        });
    });
};

domLoaded.init();