/*jshint node:true*/
'use strict';

const utils = require('../utils');


/*
*! Output-related methods
*/

module.exports = function (proto) {
    /**
     * Add output
     *
     * @method FfmpegCommand#output
     * @category Output
     *
     * @param {String|Writable} target target file path or writable stream
     * @param {Object} [pipeopts={}] pipe options (only applies to streams)
     * @return FfmpegCommand
     */
    proto.output = function (target, pipeopts={}) {
        let isFile = false;

        // No target is only allowed when called from constructor
        if (!target && this._currentOutput)
            throw new Error('Invalid output');

        if (target && typeof target !== 'string') {
            if (!('writable' in target) || !(target.writable)) {
                throw new Error('Invalid output');
            }
        } else if (typeof target === 'string') {
            let protocol = target.match(/^([a-z]{2,}):/i);
            isFile = !protocol || protocol[0] === 'file';
        }

        if (target && !('target' in this._currentOutput)) {
            // For backwards compatibility, set target for first output
            this._currentOutput.target = target;
            this._currentOutput.isFile = isFile;
            this._currentOutput.pipeopts = pipeopts;
        } else {
            if (target && typeof target !== 'string') {
                let hasOutputStream = this._outputs.some(output => typeof output.target !== 'string');

                if (hasOutputStream)
                    throw new Error('Only one output stream is supported');
            }

            this._outputs.push(this._currentOutput = {
                target: target,
                isFile: isFile,
                flags: {},
                pipeopts
            });

            ['audio', 'audioFilters', 'video', 'videoFilters', 'sizeFilters', 'options']
                .forEach(key => this._currentOutput[key] = utils.args());

            if (!target) {
                // Call from constructor: remove target key
                delete this._currentOutput.target;
            }
        }

        return this;
    };


    /**
     * Specify output seek time
     *
     * @method FfmpegCommand#seek
     * @category Input
     *
     * @param {String|Number} seek seek time in seconds or as a '[hh:[mm:]]ss[.xxx]' string
     * @return FfmpegCommand
     */
    proto.seek = function (seek) {
        this._currentOutput.options('-ss', seek);
        return this;
    };


    /**
     * Set output duration
     *
     * @method FfmpegCommand#duration
     * @category Output
     *
     * @param {String|Number} duration duration in seconds or as a '[[hh:]mm:]ss[.xxx]' string
     * @return FfmpegCommand
     */
    proto.duration = function (duration) {
        this._currentOutput.options('-t', duration);
        return this;
    };


    /**
     * Set output format
     *
     * @method FfmpegCommand#format
     * @category Output
     *
     * @param {String} format output format name
     * @return FfmpegCommand
     */
    proto.format = function (format) {
        this._currentOutput.options('-f', format);
        return this;
    };


    /**
     * Add stream mapping to output
     *
     * @method FfmpegCommand#map
     * @category Output
     *
     * @param {String} spec stream specification string, with optional square brackets
     * @return FfmpegCommand
     */
    proto.map = function (spec) {
        this._currentOutput.options('-map', spec.replace(utils.streamRegexp, '[$1]'));
        return this;
    };


    /**
     * Run flvtool2/flvmeta on output
     *
     * @method FfmpegCommand#flvmeta
     * @category Output
     *
     * @return FfmpegCommand
     */
    proto.flvmeta = function () {
        this._currentOutput.flags.flvmeta = true;
        return this;
    };
};
