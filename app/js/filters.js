'use strict';

/* Filters */

angular.module('gw2catFilters', []).filter('gw2currency', function () {
    return function (val) {
        if (!isNaN(val)) {
            var positive = (val >= 0);
            var round = Math.abs(parseInt(val));
            var g = parseInt(round / 10000);
            var s = parseInt((round - (g * 10000)) / 100);
            var c = round - (g * 10000) - (s * 100);
            return (positive ? '' : '-') + (g != 0 ? g + ' <i class="gw2money-gold">g</i> ' : '') +
                (g != 0 || s != 0 ? s + ' <i class="gw2money-silver">s</i> ' : '') +
                c + ' <i class="gw2money-copper">c</i>'; // (' + round + ')';
        }
    };
});
