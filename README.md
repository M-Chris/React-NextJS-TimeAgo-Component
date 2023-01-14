# Time Ago or Time Until Component

A React functional component that displays the time passed since a given date, or the time until a given date in the future. The component uses the `date-fns` library for handling and formatting the dates, and `date-fns-tz` library for handling time zones. It also has the ability to update on interval.

## Props

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| date | Date | N/A | The date to be used to calculate the time passed or time until. |
| daysPassedThreshold | Number | 6 | The number of days after which the exact date will be shown instead of the time passed. |
| daysFutureThreshold | Number | 6 | The number of days after which the exact date will be shown instead of the time until. |
| formatDate | String | 'MM/dd/yy' | The format for the date to be shown when the time passed or time until exceeds the respective threshold. |
| formatTime | String | 'h:mm a' | The format for the time to be shown when the time passed or time until exceeds the respective threshold. |
| useTimeUpdates | Boolean | true | If set to true, the component will update the time passed or time until at an interval. |
| timeUpdateInterval | Number | 60000 | The interval at which the component will update the time passed or time until. |
| useLanguageReference | Boolean | false | If set to true, the component will use the browser's language preference to determine the locale for the `date-fns` library. If set to false, the component will use the OS's locale. |


## Install
This code uses the following modules:

react as the base library for building user interfaces
date-fns for manipulating and formatting dates
date-fns-tz for working with time zones
In addition, the code imports en-US locale from date-fns/locale and * as Locales from date-fns/locale to support different locales.

`npm install react date-fns date-fns-tz`

It is also important to note that this code assumes that you have already setup a React project and that you have React and React-dom installed on your project.

Please let me know if there's anything else that you would like me to include in the documentation.


## Example Usage
```javascript
<TimeAgo date={new Date()} daysPassedThreshold={6} daysFutureThreshold={6} formatDate={'MM/dd/yy'} formatTime={'h:mm a'} useLanguageReference={false} />
```


## Note
It's worth noting that the time passed or time until is calculated based on the user's time zone, which is detected using the `Intl.DateTimeFormat().resolvedOptions().timeZone` method. If this method is not supported by the user's browser, the component will fall back to using the UTC time zone.

Also there is a fallback of the date-fns/locale if the browser's or OS's language preference is not supported.


## Error Handling 
Error handling in the provided code is minimal.

- When the `getDateFnsLocaleLang` function is unable to find a matching locale for the user's preferred languages, it will log a warning to the console and fall back to the default `en-US` locale.

- Similarly, the `getDateFnsLocaleOS` function will log a warning and fall back to `en-US` if it is unable to find a matching locale for the user's operating system.

- If the `utcToZonedTime` function is passed an invalid date, it will throw a `RangeError: Invalid time value`.

In a production environment, it is recommended to implement additional error handling measures such as:

- Displaying user-friendly error messages to the user instead of logging warnings to the console.
- Properly handling the `RangeError: Invalid time value` thrown by `utcToZonedTime` function, for example by displaying an error message to the user or falling back to a default value.