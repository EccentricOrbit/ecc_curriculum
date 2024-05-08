/*
 * TunePad
 *
 * Michael S. Horn
 * Northwestern University
 * michael-horn@northwestern.edu
 *
 * This project was funded by the National Science Foundation (grant DRL-1612619).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */

export class EffectCurve {

    // coarse-grain parameter value curve
    values: number[];

    // fine-grain parameter value curve
    curve: number[] = [];

    // duration of the curve in seconds (-1 means infinite)
    duration: number;

    // curve samples per second
    static SAMPLE_RATE = 200;

    constructor(values: number[], duration: number) {
        this.values = values;
        this.duration = duration;

        if (this.duration < 0) this.duration = 0;

        if (this.values.length > 1 && this.duration > 0) {
            let samples = Math.ceil(EffectCurve.SAMPLE_RATE * this.duration);
            let srci = 1.0 / (this.values.length - 1);
            let dsti = 1.0 / (samples - 1);
            let y0 = this.values[0];
            let y1 = this.values[1];
            let index = 1;
            let t0 = 0.0;
            let t1 = srci;
            let t = 0.0;

            for (let i = 0; i < samples; i++) {
                this.curve.push(y0 + (y1 - y0) * ((t - t0) / srci));
                t += dsti;
                if (t >= t1) {
                    t0 = t1;
                    t1 += srci;
                    y0 = y1;
                    index++;
                    if (index < this.values.length) y1 = this.values[index];
                }
            }
        }
    }

    // trim out time from beginning of the curve
    trimStart(seconds: number) {
        let p = seconds / this.duration;
        if (p >= 1) {
            this.curve = [];
            this.duration = 0;
        } else if (p >= 0) {
            let cut = Math.round(this.curve.length * p);
            this.curve = this.curve.slice(cut);
            this.duration *= 1 - p;
        }
    }

    // trim out time at the end of the curve
    trimEnd(seconds: number) {
        let p = seconds / this.duration;
        if (p >= 1) {
            this.curve = [];
            this.duration = 0;
        } else if (p >= 0) {
            let cut = Math.round(this.curve.length * p);
            this.curve = this.curve.slice(0, this.curve.length - cut);
            this.duration *= 1 - p;
        }
    }

    apply(
        param: AudioParam,
        delta: number,
        context: BaseAudioContext,
        baseVal: number = 0
    ) {
        // web audio timing is incredibly finicky. calling setValueCurveAtTime that overlaps
        // with previous scheduled values or curves will throw an exception.
        // the unit tests should prevent this from ever happening, but if something does go
        // wrong, we want to avoid a meltdown.
        try {
            let offsetCurve = this.curve;
            if (baseVal !== 0) {
                offsetCurve = this.curve.slice();
                for (let i = 0; i < offsetCurve.length; i++) {
                    offsetCurve[i] += baseVal;
                }
            }
            let now = context.currentTime!;
            if (this.values.length > 1 && this.duration > 0 && offsetCurve.length > 0) {
                if (delta >= 0) {
                    param.setValueCurveAtTime(offsetCurve, now + delta, this.duration);
                } else {
                    let p = -delta / this.duration;
                    if (p < 1.0) {
                        let i = Math.round(offsetCurve.length * p);
                        if (i < offsetCurve.length) {
                            param.setValueCurveAtTime(offsetCurve.slice(i), now, this.duration * (1 - p));
                        }
                    }
                }
            } else if (this.values.length > 0) {
                param.value = this.values[0];
                param.setValueAtTime(this.values[0], now + Math.max(0, delta));
            }
        } catch (x) {
            console.error('Web audio exception in curve.ts:', x);
        }
    }

    map(conversion: (value: number) => number): EffectCurve {
        let fx = new EffectCurve(this.values, this.duration);
        fx.curve = this.curve.map(conversion);
        return fx;
    }
}

