/**
 * Passthrogh Worker that sends incremental waveform data and progress reports back to main UI thread.
 * 
 * The AudioWorkletProcessor process function works in blocks of 128 frames.
 */
class ProgressMonitor extends AudioWorkletProcessor {

    constructor() {
        super();
        this.sampleCount = 0;
    }

    // basic passthrough
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const input = inputs[0];
        let amin = 1.0, amax = -1.0, sum = 0;
        for (let c=0; c < input.length && c < output.length; c++) {
            for (let i=0; i < output[c].length; i++) {
                const v = input[c][i];
                amin = Math.min(amin, v);
                amax = Math.max(amax, v);
                sum += v;
                output[c][i] = v;
            }
        }
        let samples = 0;
        if (output.length > 0) {
            samples = output[0].length;
            this.sampleCount += samples;
        }
        this.port.postMessage({
            'wmin' : amin,
            'wmax' : amax,
            'wavg' : sum / samples,
            'total-frames' : this.sampleCount,
        });
        return true;
    }
}
  
registerProcessor("progress-monitor", ProgressMonitor);
