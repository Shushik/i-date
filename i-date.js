/**
 * A wrapper for JavaScript Date object
 *
 * @author   Shushik <silkleopard@yandex.ru>
 * @version  1.0
 * @homepage http://github.com/shushik/i-date/
 */
var IDate = IDate || (function() {

    /**
     * Main object 
     *
     * @static
     *
     * @param {string}                         tmpl
     * @param {undefined|number|string|object} raw
     *
     * @return {string}
     */
    function
        self(tmpl, raw) {
            return self.human(tmpl, raw);
        }

    /**
     * The current date
     *
     * @static
     * @private
     *
     * @type {object}
     */
    self._now = new Date();

    /**
     * The current day
     *
     * @static
     * @private
     *
     * @type {number}
     */
    self._day = self._now.getDate();

    /**
     * The current year
     *
     * @static
     * @private
     *
     * @type {number}
     */
    self._year = self._now.getFullYear();

    /**
     * The current month
     *
     * @static
     * @private
     *
     * @type {number}
     */
    self._month = self._now.getMonth() + 1;

    /**
     * The current year prefix
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._ye = (self._year + '').substring(0, 2);

    /**
     * Current locale
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._locale = 'en';

    /**
     * Date formats
     *
     * @static
     * @private
     *
     * @type {object}
     */
    self._formats = {
        rplc : '',
        tmpl : '',
        pregs : {
            A : '(AM|PM)',
            D : '(\\w{3})',
            F : '(\\w{3,9})',
            G : '(\\d{1,2})',
            H : '(\\d{2})',
            M : '(\\w{3})',
            N : '(\\d)',
            O : '([+-]\\d{4})',
            T : '(\\w{3})',
            W : '(\\d{2})',
            Y : '(\\d{4})',
            a : '(am|pm)',
            d : '(\\d{1,2})',
            e : '(\\w{3})',
            g : '(\\d{1,2})',
            h : '(\\d{2})',
            i : '(\\d{2})',
            j : '(\\d{1,2})',
            l : '(\\w{6,9})',
            m : '(\\d{2})',
            n : '(\\d{1,2})',
            s : '(\\d{2})',
            t : '(\\d{1,2})',
            w : '(\\d)',
            y : '(\\d{2})',
            z : '(\\d{1,3})',
        }
    };

    /**
     * Locale settings
     *
     * @static
     * @private
     *
     * @type {object}
     */
    self._locales = {
        en : {
            ampm : {
                full  : 'ante meridiem;post meridiem',
                lower : 'am;pm',
                upper : 'AM;PM'
            },
            days : {
                plur : 'day;days;days'
            },
            years : {
                leap : 'is leap',
                plur : 'year;years;years',
            },
            common : {
                bwd  : 'Go back',
                fwd  : 'Go forward',
                hide : 'hide'
            },
            monthes : {
                decl : 'of January;of February;of March;of April;of May;of June;of July;of August;of September;of October;of November;of December',
                full : 'January;February;March;April;May;June;July;August;September;October;November;December',
                part : 'Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec',
                plur : 'month;monthes;monthes'
            },
            holidays : {
                list : '',
                from : null,
                till : null
            },
            weekdays : {
                motu : 'Mo;Tu;We;Th;Fr;Sa;Su',
                full : 'Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday',
                part : 'Mon;Tue;Wen;Thu;Fri;Sat;Sun',
                plur : 'week;weeks;weeks'
            }
        }
    };

    /**
     * Turn a date template into a regular expression
     *
     * @static
     *
     * @param {string} tmpl
     *
     * @return {object}
     */
    self._preg = function(tmpl) {
        var
            it0   = 0,
            ln0   = tmpl.length,
            al0   = '',
            al1   = '',
            pregs = self._formats.pregs;

        //
        for (it0 = 0; it0 < ln0; it0++) {
            al0 = tmpl[it0];

            if (pregs[al0]) {
                al1 += pregs[al0]
            } else {
                al1 += tmpl[it0];
            }
        }

        return new RegExp(al1, 'g');
    }

    /**
     * Get a number string with a leading zero
     *
     * @static
     * @private
     *
     * @param  {number}
     *
     * @return {string}
     */
    self._zero = function(num) {
        return ("0" + num).slice(-2);
    }

    /**
     * Count the number of days in a month
     *
     * @static
     *
     * @param {undefined|number|string|object} month
     * @param {undefined|number}               year
     * @param {undefined|boolean}              _tech
     *
     * @return {number}
     */
     
    self.days = function(month, year, _tech) {
        var
            m = 0,
            y = 0,
            t = null;

        if (typeof month == 'number') {
            m = month;
            y = typeof year == 'number' ? year : self._now.getFullYear();
        } else {
            t = self.parse(month);
            m = t.getMonth();
            y = t.getFullYear();
        }

        // For the JavaScript month number starting with 0
        if (_tech !== undefined) {
            m += 1;
        }

        return new Date(
            y,
            m,
            0
        ).getDate();
    };

    /**
     * Check if a year is leap
     *
     * @static
     *
     * @param {undefined|number|string|object} year
     *
     * @return {boolean}
     */
    self.leap = function(year) {
        var
            y = 0,
            t = null;

        if (typeof year == 'number') {
            y = year;
        } else {
            t = self.parse(year);
            y = t.getFullYear();
        }

        return new Date(y, 1, 29).getDate() !== 1 ? true : false;
    }

    /**
     * Turn the date object into the human string
     *
     * @static
     *
     * @param {undefined|string}               tmpl
     * @param {undefined|number|string|object} raw
     * @param {undefined|boolean}              part
     *
     * @return {string|object}
     */
    self.human = function(tmpl, raw, part) {
        var
            chr    = 0,
            tmp    = 0,
            parsed = '',
            cp     = self.parse(raw),
            hmn    = {},
            dist   = null,
            lang   = self._locales[self._locale] ?
                     self._locales[self._locale] :
                     self._locales['en'];

        // Basics
        hmn.day     = cp.getDate();
        hmn.year    = cp.getFullYear();
        hmn.hours   = cp.getHours();
        hmn.month   = cp.getMonth() + 1;
        hmn.offset  = cp.getTimezoneOffset();
        hmn.minutes = cp.getMinutes();
        hmn.seconds = cp.getSeconds();

        if (part === undefined) {
            dist = self.distance(
                new Date(cp.getFullYear(), 0, 1, 0, 0, 0),
                cp
            );

            // Day
            hmn.j = hmn.day;
            hmn.d = self._zero(hmn.j);
            hmn.w = cp.getDay();
            hmn.N = hmn.w === 0 ? 7 : hmn.w;
            hmn.z = dist.days;

            // Week
            tmp = hmn.N - 1;

            hmn.D = lang.weekdays.part.split(';')[tmp];
            hmn.l = lang.weekdays.full.split(';')[tmp];
            hmn.W = dist.weeks;

            // Month
            tmp = hmn.month - 1;

            hmn.n = hmn.month;
            hmn.m = self._zero(hmn.n);
            hmn.M = lang.monthes.part.split(';')[tmp];
            hmn.F = lang.monthes.full.split(';')[tmp];
            hmn.t = self.days(hmn.month, hmn.year);

            // Year
            hmn.Y = hmn.year;
            hmn.y = (hmn.Y + '').substring(2);
            hmn.L = self.leap(hmn.Y);

            // Time
            hmn.G = hmn.hours;
            hmn.g = hmn.G + -12;
            hmn.H = self._zero(hmn.G);
            hmn.h = self._zero(hmn.g);
            hmn.i = self._zero(hmn.minutes);
            hmn.s = self._zero(hmn.seconds);

            // A.M/P.M.
            if (hmn.G <= 12) {
                hmn.a = lang.ampm.lower.split(';')[0];
                hmn.A = lang.ampm.upper.split(';')[0];
            } else {
                hmn.a = lang.ampm.lower.split(';')[1];
                hmn.A = lang.ampm.upper.split(';')[1];
            }

            // Timezone
            tmp = cp.toString().split('GMT')[1].replace(')', '').split(' (');

            hmn.O = tmp[0];
            hmn.P = tmp[0].substring(0, 3) + ':' + tmp[0].substring(3);
            hmn.T = tmp[1];
            hmn.Z = hmn.offset;

            // Summer time
            tmp = [
                cp.getTimezoneOffset(),
                new Date(hmn.Y, 1, 1).getTimezoneOffset(),
                new Date(hmn.Y, 7, 1).getTimezoneOffset()
            ];

            hmn.I = tmp[1] !== tmp[2] && tmp[2] === tmp[0] ? true : false;

            // UTC
            hmn.U = cp.getTime();

            // Formats
            hmn.r = cp.toString();
            hmn.c = hmn.Y + '-' + hmn.m + '-' + hmn.d + '-' +
                    'T' +
                    hmn.H + ':' + hmn.i + ':' + hmn.s + hmn.P;
        }

        if (typeof tmpl === 'string') {
            tmp = tmpl.length;

            while (chr < tmp) {
                if (hmn[tmpl[chr]]) {
                    parsed += hmn[tmpl[chr]];
                } else {
                    parsed += tmpl[chr];
                }

                chr++;
            }

            return parsed;
        }

        return hmn;
    }

    /**
     * Get the minimal or the maximal date from the given list,
     * or the sorted dates list
     *
     * @static
     *
     * @param {object} dates
     * @param {string} which
     *
     * @return {object}
     */
    self.order = function(dates, which) {
        which = which || false;
        dates = dates.sort(function(a, b) {
            if (a > b) {
                return 1;
            } else {
                return - 1;
            }
        });

        if (which == 'min') {
            return dates.shift()
        } else if (which == 'max') {
            return dates.pop();
        }

        return dates;
    };

    /**
     * Parse a date from a number, string or object source
     *
     * @param {undefined|number|string|object} raw
     *
     * @return {object}
     */
    self.parse = function(raw) {
        if (raw instanceof Date && self.valid(raw)) {
            // Don`t parse, just clone
            return new Date(raw);
        } else if (raw === undefined) {
            // Don`t parse, return the current day
            return self._now;
        }

        var
            day   = 0,
            it0   = 0,
            ln0   = 0,
            year  = 0,
            month = 0,
            type  = typeof raw,
            cp    = null,
            now   = new Date(),
            preg  = null,
            rplcs = self._formats.rplc.split(';'),
            tmpls = self._formats.tmpl.split(';');

        if (type === 'number') {
            // Try to read a date using unixtimestamp
            return new Date(raw);
        } else if (type === 'string') {
            // Try to read a date using standart Date parser
            cp = new Date(raw);

            // Check if the date is valid
            if (self.valid(cp)) {
                return cp;
            }

            // Try to parse the date string manually
            cp  = raw;
            ln0 = tmpls.length;

            for (it0 = 0; it0 < ln0; it0++) {
                preg = self.preg(tmpls[it0]);

                if (cp.match(preg)) {
                    cp = cp.replace(preg, rplcs[it0]);

                    break;
                }
            }

            // Check if the new date is valid
            cp = new Date(cp);

            if (self.valid(cp)) {
                return cp;
            }
        }

        return null;
    }

    /**
     * Check if a Date object contains a valid date
     *
     * @static
     *
     * @param {object}
     *
     * @return {boolean}
     */
    self.valid = function(raw) {
        if (raw instanceof Date && !isNaN(raw.getDate())) {
            return true;
        }

        return false;
    }

    /**
     * Save a date format
     *
     * @static
     *
     * @param {string} format
     *
     * @return {undefined|object}
     */
    self.format = function(format) {
        var
            it0    = 0,
            ln0    = format.length,
            total  = 0,
            found  = '',
            dt     = [],
            tm     = [],
            keys   = ['year', 'month', 'day'],
            pregs  = self._formats.pregs;

        // Check the template existance
        if (self._formats.tmpl.indexOf(format) > -1) {
            return;
        }

        // Iterate through the string
        for (it0 = 0; it0 < ln0; it0++) {
            found = format[it0];

            // 
            if (pregs[found]) {
                total++;

                switch (found) {

                    case 'Y':
                        dt[0] = '$' + total;
                    break;

                    case 'y':
                        dt[0] = self._ye + '$' + total;
                    break;

                    case 'F':
                    case 'M':
                    case 'm':
                    case 'n':
                        dt[1] = '$' + total;
                    break;

                    case 'd':
                    case 'j':
                        dt[2] = '$' + total;
                    break;

                    case 'H':
                        tm[0] = '$' + total;
                    break;

                    case 'i':
                        tm[1] = '$' + total;
                    break;

                    case 's':
                        tm[2] = '$' + total;
                    break;

                }
            }
        }

        //
        for (it0 = 0; it0 < 3; it0++) {
            if (dt[it0] === undefined) {
                dt[it0] = self['_' + keys[it0]];
            }

            if (tm[it0] === undefined) {
                tm[it0] = '00';
            }
        }

        // Save the values
        self._formats.tmpl = format + ';' + self._formats.tmpl;
        self._formats.rplc = (dt.join(' ') + ' ' +
                             tm.join(':')) + ';' +
                             self._formats.rplc;
    }

    /**
     * Check if the day is holiday
     *
     * @static
     *
     * @param  {undefined|number|string|object}
     *
     * @return {boolean}
     */
    self.holiday = function(raw) {
        var
            hayfork  = '',
            haystack = '',
            craw     = null,
            holidays = null;

        if (self._locales[self._locale].holidays) {
            craw     = self.parse(raw);
            holidays = self.locales[self.locale].holidays;
            hayfork  = craw.getFullYear() + '-' +
                       self.zero(craw.getMonth() + 1) + '-' +
                       self.zero(craw.getDate());
            haystack = holidays.list;

            if (self.inside(craw, holidays.from, holidays.till, true)) {
                if (haystack.indexOf(hayfork) > -1) {
                    return true;
                }
            } else {
                return self.weekend(raw);
            }
        } else {
            return self.weekend(raw);
        }

        return false;
    }

    /**
     * Check if the given date is between the minimal and maximal
     *
     * @static
     *
     * @param  {number|string|object} now
     * @param  {number|string|object} min
     * @param  {number|string|object} max
     * @param  {undefined|boolean}    inc
     *
     * @return {boolean}
     */
    self.inside = function(now, min, max, inc) {
        var
            cmax = self.parse(max),
            cmin = self.parse(min),
            cnow = self.parse(now);

        if (
            inc && cnow >= cmin && cnow <= cmax ||
            cnow > cmin && cnow < cmax
        ) {
            return true;
        }

        return false;
    }

    /**
     * Check if the day is weekend
     *
     * @static
     *
     * @param  {undefined|number|string|object} raw
     *
     * @return {boolean}
     */
    self.weekend = function(raw) {
        var
            day = 0,
            cp  = self.parse(raw);

        day = cp.getDay();

        if (day == 0 || day == 6) {
            return true;
        }

        return false;
    }

    /**
     * A kind of calendar math
     *
     * @static
     *
     * @param {undefined|number|string|object} now
     *
     * @return {object}
     */
    self.calendar = function(now) {
        var
            day   = 0,
            from  = 0,
            last  = 0,
            rest  = 42,
            till  = 0,
            year  = 0,
            month = 0,
            cnow  = self.parse(now),
            data  = [];

        // Fill the variables
        month = cnow.getMonth();
        year  = cnow.getFullYear();
        last  = self.days(year, month, true);
        from  = new Date(year, month, 1).getDay();
        from  = from === 0 ? 7 : from;
        till  = last;

        rest -= last;

        // Get a first day in range
        if (from !== 1) {
            from = -(from - 2);
            rest = rest + from - 1;
        }

        // Get a last day in range
        if (rest > 0) {
            till = last + rest;
        }

        // Generate an array with the dates in range
        for (day = from; day <= till; day++) {
            data.push(new Date(year, month, day));
        }

        return data;
    }

    /**
     * Get the distance between the dates
     *
     * @static
     *
     * @param  {number|string|object} from
     * @param  {number|string|object} till
     *
     * @return {object}
     */
    self.distance = function(from, till) {
        var
            tmp   = 0,
            out   = {
                days    : 0,
                hours   : 0,
                weeks   : 0,
                years   : 0,
                seconds : 0,
                minutes : 0,
                monthes : 0
            },
            cfrom = self.parse(from),
            ctill = self.parse(till);

        // Just in case of crazy coder
        if (cfrom > ctill) {
            tmp  = ctill;
            ctill = cfrom;
            cfrom = tmp;
        }

        // Get the raw number of passed years between the dates
        tmp = (ctill.getFullYear() - cfrom.getFullYear()) * 12;

        // Get the number of monthes and years
        out.monthes = (tmp - cfrom.getMonth()) + ctill.getMonth();
        out.years   = Math.floor(out.monthes / 12);

        // Get the raw number of milliseconds between the dates
        tmp = ctill.getTime() - cfrom.getTime();

        // Get the seconds, minutes and hours
        out.seconds = Math.floor(tmp / 1000);
        out.minutes = Math.floor(out.seconds / 60);
        out.hours   = Math.floor(out.minutes / 60);

        // Get the days and weeks
        out.days  = Math.floor(out.hours / 24);
        out.weeks = Math.floor(out.days / 7);

        return out;
    }

    /**
     * Set the holidays
     *
     * @static
     *
     * @param  {string}        lang
     * @param  {string|object} items
     *
     * @return {undefined|object}
     */
    self.holidays = function(lang, items) {
        var
            ln0  = 0,
            raw  = null,
            from = null,
            till = null;

        if (items !== undefined) {
            raw = typeof items == 'string' ? items.split(';') : items;
            ln0 = raw.length;

            // Create the language object if not exists
            // or just switch the language to neededs
            if (!self._locales[lang]) {
                self.language(lang, {});
            } else {
                self.language(lang);
            }

            if (ln0) {
                from = ln0 ? self.parse(raw[0]) : null;
                till = ln0 ? self.parse(raw[ln0 - 1]) : null;
            }

            // Save the holidays properties into current locale
            self._locales[self._locale].holidays = {
                from : from ?
                       new Date(
                           from.getFullYear(),
                           from.getMonth(),
                           from.getDate()
                       ) :
                       from,
                list : raw.join(self.sep),
                till : till ?
                       new Date(
                           till.getFullYear(),
                           till.getMonth(),
                           till.getDate()
                       ) :
                       till
            };
        } else {
            if (self.locales[lang] && self.locales[lang].holidays) {
                return self.locales[lang].holidays.split(';');
            } else {
                return null;
            }
        }
        
    }

    /**
     * Set the language settings
     *
     * @static
     *
     * @param  {string}            lang
     * @param  {undefined|object}  items
     * @param  {undefined|boolean} rewrite
     *
     * @return {undefined}
     */
    self.language = function(lang, items, rewrite) {
        var
            al0 = '',
            al1 = '',
            def = self._locales['en'];

        if (items !== undefined) {
            // Create the locale object if not exists
            if (!self._locales[lang]) {
                self._locales[lang] = {};
            }

            // 
            for (al0 in def) {
                if (al0 == 'holidays') {
                    // Save the holidays
                    self.holidays(lang, items[al0]);
                } else {
                    // Create the locale setting object if not exists
                    if (!self._locales[lang][al0]) {
                        self._locales[lang][al0] = {};
                    }

                    for (al1 in def[al0]) {
                        if (
                            !self._locales[lang][al0][al1] ||
                            rewrite === true
                        ) {
                            // Take a locale setting from a given object
                            if (items[al0] && items[al0][al1]) {
                                if (items[al0][al1] instanceof Array) {
                                    self._locales[lang][al0][al1] = items[al0][al1].
                                                                    join(';');
                                } else {
                                    self._locales[lang][al0][al1] = items[al0][al1];
                                }
                            } else {
                                // Take a locale setting from a default object
                                self._locales[lang][al0][al1] = def[al0][al1];
                            }
                        }
                    }
                }
            }
        }

        // Switch to a given language
        if (self._locales[lang]) {
            self._locale = lang;
        } else {
            self._locale = 'en';
        }
    }

    return self;

 })();
 
 
 /**
 * Prefill the default formats
 */
;(function() {
    var
        it0 = 0,
        arr = 'D M d Y H:i:s eO \(T\);D M d Y H:i:s eO;D M d H:i:s e Y;' +
              'Y-m-d H:i:s;H:i:s;Y-m-d;y-m-d;M d,Y;Y-M-d;y-M-d;d-M-Y;M/d/y;' +
              'm-d-Y;m.d.Y;d/m/Y;d-m-Y;d.m.Y;M d, Y;M d;M-d;m/d;m-d;d-M;d/m;' +
              'd-m;d'.split(';');

    for (it0 in arr) {
        IDate.format(arr[it0]);
    }
})();