/*jshint node:true*/
'use strict';

const utils = require('../utils');


/*
*! Audio-related methods
*/

module.exports = function (proto) {
    /**
     * Disable audio in the output
     *
     * @method FfmpegCommand#noAudio
     * @category Audio
     * @return FfmpegCommand
     */
    proto.noAudio = function () {
        this._currentOutput.audio.clear();
        this._currentOutput.audioFilters.clear();
        this._currentOutput.audio('-an');

        return this;
    };


    /**
     * Specify audio codec
     *
     * @method FfmpegCommand#audioCodec
     * @category Audio
     *
     * @param {String} codec audio codec name
     * @return FfmpegCommand
     */
    proto.audioCodec = function (codec) {
        this._currentOutput.audio('-acodec', codec);
        return this;
    };


    /**
     * Specify audio bitrate
     *
     * @method FfmpegCommand#audioBitrate
     * @category Audio
     *
     * @param {String|Number} bitrate audio bitrate in kbps (with an optional 'k' suffix)
     * @return FfmpegCommand
     */
    proto.audioBitrate = function (bitrate) {
        this._currentOutput.audio('-b:a', ('' + bitrate).replace(/k?$/, 'k'));
        return this;
    };


    /**
     * Specify audio channel count
     *
     * @method FfmpegCommand#audioChannels
     * @category Audio
     *
     * @param {Number} channels channel count
     * @return FfmpegCommand
     */
    proto.audioChannels = function (channels) {
        this._currentOutput.audio('-ac', channels);
        return this;
    };


    /**
     * Specify audio frequency
     *
     * @method FfmpegCommand#audioFrequency
     * @category Audio
     *
     * @param {Number} freq audio frequency in Hz
     * @return FfmpegCommand
     */
    proto.audioFrequency = function (freq) {
        this._currentOutput.audio('-ar', freq);
        return this;
    };


    /**
     * Specify audio quality
     *
     * @method FfmpegCommand#audioQuality
     * @category Audio
     *
     * @param {Number} quality audio quality factor
     * @return FfmpegCommand
     */
    proto.audioQuality = function (quality) {
        this._currentOutput.audio('-aq', quality);
        return this;
    };


    /**
     * Specify custom audio filter(s)
     *
     * Can be called both with one or many filters, or a filter array.
     *
     * @example
     * command.audioFilters('filter1');
     *
     * @example
     * command.audioFilters('filter1', 'filter2=param1=value1:param2=value2');
     *
     * @example
     * command.audioFilters(['filter1', 'filter2']);
     *
     * @example
     * command.audioFilters([
     *   {
     *     filter: 'filter1'
     *   },
     *   {
     *     filter: 'filter2',
     *     options: 'param=value:param=value'
     *   }
     * ]);
     *
     * @example
     * command.audioFilters(
     *   {
     *     filter: 'filter1',
     *     options: ['value1', 'value2']
     *   },
     *   {
     *     filter: 'filter2',
     *     options: { param1: 'value1', param2: 'value2' }
     *   }
     * );
     *
     * @method FfmpegCommand#audioFilters
     * @category Audio
     *
     * @param {...String|String[]|Object[]} filters audio filter strings, string array or
     *   filter specification array, each with the following properties:
     * @param {String} filters.filter filter name
     * @param {String|String[]|Object} [filters.options] filter option string, array, or object
     * @return FfmpegCommand
     */
    proto.audioFilters = function (...filters) {
        this._currentOutput.audioFilters(utils.makeFilterStrings(filters));
        return this;
    };
};
