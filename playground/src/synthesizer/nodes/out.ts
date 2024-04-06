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

import { ADSRNode } from './adsr';

//-----------------------------------------------------------------------
// Out Node: Just an ADSR envelope
//-----------------------------------------------------------------------
export class OutNode extends ADSRNode {
    constructor (context : BaseAudioContext, config : any) {
        super (context, config);
    }
}
