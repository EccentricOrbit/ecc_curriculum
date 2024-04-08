

/**
 * Parses an int from an object (usually a string)
 * @param d - The input value to be parsed
 * @param defaultValue - The default value to return if the parsing fails
 * @returns The parsed integer value
 */
export function toInt(d: any, defaultValue: number = 0): number {
    const n = parseInt(d);
    return isNaN(n) ? defaultValue : n;
}

/**
 * Parses a number from an object (usually a string)
 * @param d - The input value to be parsed
 * @param defaultValue - The default value to return if the parsing fails
 * @returns The parsed number value
 */
export function toNum(d: any, defaultValue: number = 0): number {
    const n = parseFloat(d);
    return isNaN(n) ? defaultValue : n;
}

/**
 * Parses a DateTime object from an int representing milliseconds since the epoch.
 * Returns DateTime.now() as a default value.
 * @param d - The input value to be parsed
 * @returns The parsed DateTime object
 */
export function toDateTime(d: string): number {
    return Date.parse(d);
}

/**
 * Formats a DateTime object as a string
 * @param d - The DateTime object to be formatted
 * @returns The formatted date and time string
 */
/*
function formatDateTime(d: DateTime): string {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${months[d.month]} ${d.day}, ${d.year}`;
    let h = d.hour % 12;
    if (h === 0) h = 12;
    const time = `${h}:${d.minute.toString().padStart(2, '0')}${d.hour < 12 ? 'AM' : 'PM'}`;
    return `${date} ${time}`;
}
*/

/**
 * Parses a boolean value from an object (usually a string or boolean)
 * @param b - The input value to be parsed
 * @param defaultValue - The default value to return if the parsing fails
 * @returns The parsed boolean value
 */
export function toBool(b: any, defaultValue: boolean = false): boolean {
    if (b == null) {
        return defaultValue;
    } else if (typeof b === 'boolean') {
        return b;
    } else {
        const s = b.toString().toLowerCase();
        if (s === 'true' || s === 't') {
            return true;
        } else if (s === 'false' || s === 'f') {
            return false;
        }
    }
    return defaultValue;
}

/**
 * Converts a value to a string
 * @param o - The input value to be converted
 * @param defaultValue - The default value to return if the conversion fails
 * @returns The converted string value
 */
export function toStr(o: any, defaultValue: string = ''): string {
    return (!o) ? defaultValue : o.toString();
}

/**
 * Linearly interpolates between two values
 * @param a - The starting value
 * @param b - The ending value
 * @param interp - The interpolation factor (between 0 and 1)
 * @returns The interpolated value
 */
export function mix(a: number, b: number, interp: number): number {
    return a + interp * (b - a);
}

/**
 * Converts a decibel value to a gain value
 * @param dB - The decibel value
 * @returns The gain value
 */
export function dBToGain(dB: number): number {
    return Math.max(0.0, Math.pow(10, dB / 20));
}

/**
 * Converts a gain value to a decibel value
 * @param gain - The gain value
 * @returns The decibel value
 */
export function gainTodB(gain: number): number {
    return 20 * Math.log(gain) / Math.LN10;
}

/**
 * Converts a decibel value to a value
 * @param dB - The decibel value
 * @returns The value
 */
export function dBToValue(dB: number): number {
    return Math.pow(10, dB / 20) / 1.78;
}

/**
 * Converts a gain value to a value
 * @param gain - The gain value
 * @returns The value
 */
export function gainToValue(gain: number): number {
    return dBToValue(gainTodB(gain));
}

/**
 * Converts a value to a decibel value
 * @param value - The value
 * @returns The decibel value
 */
export function valueTodB(value: number): number {
    return 20 * Math.log(1.78 * value) / Math.LN10;
}

/**
 * Converts a value to a gain value
 * @param value - The value
 * @returns The gain value
 */
export function valueToGain(value: number): number {
    return dBToGain(valueTodB(value));
}

/**
 * Converts a velocity value to a gain value
 * @param velocity - The velocity value (0-127)
 * @returns The gain value
 */
export function veloctyToGain(velocity: number): number {
    return valueToGain(velocity / 127.0);
}

export function clamp(val : number, minV : number, maxV : number) {
    return Math.max(minV, Math.min(maxV, val));
}