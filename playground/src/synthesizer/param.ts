/*
 * TunePad
 *
 * Michael S. Horn
 * Northwestern University
 * michael-horn@northwestern.edu
 * Copyright 2022, Michael S. Horn
 *
 * This project was funded by the National Science Foundation (grant DRL-1612619).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */

import { clamp, toInt, toNum, toStr } from "../core/utils";

/**
 * Represents an exposed shortcut audio parameter that can be adjusted in real time
 * by the user through the UI or through code. e.g. resonance, feedback, reverb
 */
export class SynthParameter {

    private _value: number = 1.0;

    get isAssigned(): boolean { return this.nodeId >= 0; }

    /** which node in the synth chain to adjust (-1 means unassigned) */
    nodeId: number = -1;

    /** which parameter to adjust */
    name: string = '';

    /** user-visible parameter label */
    label: string = '';

    /** a slot is like an address or location of the parameter in the UI
     * typically a number in the range 0 - 5.
     */
    slot: number = 0;

    /** current value of the parameter */
    get value(): number {
        return clamp(this._value, this.minValue, this.maxValue);
    }

    set value(v: number) {
        this._value = clamp(v, this.minValue, this.maxValue);
    }

    get percentValue(): number {
        return (this.value - this.minValue) / this.range;
    }

    set percentValue(p: number) {
        this.value = p * this.range + this.minValue;
    }

    get range(): number {
        return this.maxValue - this.minValue;
    }

    /** min value of the parameter */
    minValue: number = 0.0;

    /** max value of the parameter */
    maxValue: number = 1.0;

    constructor() { }

    static fromJSON(config: any): SynthParameter {
        const param = new SynthParameter();
        param.nodeId = toInt(config['node'], -1);
        param.name = toStr(config['name'], '');
        param.label = toStr(config['label'], '');
        param.slot = toInt(config['slot'], 0);
        param.minValue = toNum(config['min'], 0);
        param.maxValue = toNum(config['max'], 1);
        param._value = clamp(toNum(config['value'], 1.0), param.minValue, param.maxValue);
        return param;
    }

    toJSON(): any {
        return {
            'node': this.nodeId,
            'name': this.name,
            'label': this.label,
            'slot': this.slot,
            'min': this.minValue,
            'max': this.maxValue,
            'value': this.value
        };
    }
}
