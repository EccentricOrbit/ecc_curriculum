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
import { toNum } from "../../core/utils";
import { SynthConnector } from "./connector";


export class SynthModulator {

    readonly gain: GainNode;

    readonly name: string;

    value: number = 1.0;


    constructor(context: BaseAudioContext, name: string, value: number) {
        this.gain = new GainNode(context);
        this.name = name;
        this.value = value;
        this.gain.gain.value = value;
    }

    connect(connector: SynthConnector, dest: string): boolean {
        if (dest == this.name) {
            connector.level.connect(this.gain);
            return true;
        } else {
            return false;
        }
    }

    destroy() {
        this.gain.disconnect();
    }

    updateParameter(pname: string, newValue: any): boolean {
        if (pname == `${this.name}-mod}`) {
            this.value = toNum(newValue, this.value);
            this.gain.gain.value = this.value;
            return true;
        }
        return false;
    }
}
