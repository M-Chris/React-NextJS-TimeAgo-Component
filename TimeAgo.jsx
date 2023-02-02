import React, { useState, useEffect } from 'react';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import enUS from 'date-fns/locale/en-US';
import * as Locales from 'date-fns/locale';


const formatDistanceLocale = {
    lessThanXSeconds: '{{count}}s',
    xSeconds: '{{count}}s',
    halfAMinute: '30s',
    lessThanXMinutes: '{{count}}m',
    xMinutes: '{{count}}m',
    aboutXHours: '{{count}}h',
    xHours: '{{count}}h',
    xDays: '{{count}}d',
    aboutXWeeks: '{{count}}w',
    xWeeks: '{{count}}w',
    aboutXMonths: '{{count}}m',
    xMonths: '{{count}}m',
    aboutXYears: '{{count}}y',
    xYears: '{{count}}y',
    overXYears: '{{count}}y',
    almostXYears: '{{count}}y',
};


function _tokenDistance(token, count, options) {
    options = options || {};
    const result = formatDistanceLocale[token].replace('{{count}}', count);
    if (options.addSuffix) {
        if (options.comparison > 0) {
            return 'in ' + result;
        } else {
            return result + ' ago';
        }
    }
    return result;
}


function getDateFnsLocaleLang() {
    const preferredLanguages = navigator.language || navigator.userLanguage;
    for (let i = 0; i < preferredLanguages.length; i++) {
        const locale = preferredLanguages[i].replace('-', '');
        if (!(locale in Locales)) {
            continue;
        }
        return Locales[locale];
    }
    console.warn(`Unsupported locale: ${preferredLanguages}. Falling back to en-US.`);
    return Locales.enUS;
}

function getDateFnsLocaleOS() {
    // eslint-disable-next-line new-cap
    const osLocale = Intl.DateTimeFormat().resolvedOptions().locale.replace('-', '');
    if (!(osLocale in Locales)) {
        console.warn(`Unsupported locale: ${osLocale}. Falling back to en-US.`);
        return Locales.enUS;
    }
    return Locales[osLocale];
}


export default ({ date, daysPassedThreshold = 6, daysFutureThreshold = 6, formatDate = 'MM/dd/yy', formatTime = 'h:mm a', useTimeUpdates=true, timeUpdateInterval=60000, useLanguageReference }) => {
    const [timePassed, setTimePassed] = useState('');
    const [locale, setLocale] = useState(enUS);

    useEffect(() => {
        // eslint-disable-next-line new-cap
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = utcToZonedTime(date, timeZone);
        setLocale(useLanguageReference ? getDateFnsLocaleLang() : getDateFnsLocaleOS());
        setTimePassed(() => {
            const msPassed = localTime.getTime() - Date.now();
            const daysPassed = msPassed / (1000 * 60 * 60 * 24);
            if (msPassed > 0) {
                if (daysPassed > daysFutureThreshold) {
                    return `${format(localTime, formatDate)} ${format(localTime, formatTime)}`;
                } else {
                    return formatDistanceToNowStrict(localTime, {
                        addSuffix: true,
                        locale: {
                            ...locale,
                            _tokenDistance,
                        },
                    });
                }
            } else {
                if (Math.abs(daysPassed) > daysPassedThreshold) {
                    return `${format(localTime, formatDate)} ${format(localTime, formatTime)}`;
                } else {
                    return formatDistanceToNowStrict(localTime, {
                        addSuffix: true,
                        locale: {
                            ...locale,
                            _tokenDistance,
                        },
                    });
                }
            }
        });
        if (useTimeUpdates) {
            const intervalId = setInterval(() => {
                const msPassed = localTime.getTime() - Date.now();
                const daysPassed = msPassed / (1000 * 60 * 60 * 24);
                if (msPassed > 0) {
                    if (daysPassed > daysFutureThreshold) {
                        setTimePassed(`${format(localTime, formatDate)} ${format(localTime, formatTime)}`);
                    } else {
                        setTimePassed(formatDistanceToNowStrict(localTime, {
                            addSuffix: true,
                            locale: {
                                ...locale,
                                _tokenDistance,
                            },
                        }));
                    }
                } else {
                    if (Math.abs(daysPassed) > daysPassedThreshold) {
                        setTimePassed(`${format(localTime, formatDate)} ${format(localTime, formatTime)}`);
                    } else {
                        setTimePassed(formatDistanceToNowStrict(localTime, {
                            addSuffix: true,
                            locale: {
                                ...locale,
                                _tokenDistance,
                            },
                        }));
                    }
                }
            }, timeUpdateInterval);
            return () => clearInterval(intervalId);
        }
    }, [date, daysPassedThreshold, daysFutureThreshold, formatDate, formatTime]);

    return <span>{timePassed}</span>;
};
