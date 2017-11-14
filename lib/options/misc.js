/*jshint node:true*/
'use strict';

const path = require('path');

/*
*! Miscellaneous methods
*/

module.exports = function (proto) {
    /**
     * Use preset
     *
     * @method FfmpegCommand#preset
     * @category Miscellaneous
     * @aliases usingPreset
     *
     * @param {String|Function} preset preset name or preset function
     */
    proto.preset = function (preset) {
        if (typeof preset === 'function') {
            preset(this);
        } else {
            try {
                let modulePath = path.join(this.options.presets, preset);
                let module = require(modulePath);

                if (typeof module.load === 'function') {
                    module.load(this);
                } else {
                    throw new Error('preset ' + modulePath + ' has no load() function');
                }
            } catch (err) {
                throw new Error('preset ' + modulePath + ' could not be loaded: ' + err.message);
            }
        }

        return this;
    };
};
