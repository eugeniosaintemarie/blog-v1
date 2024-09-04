(function ($) {
    const easingFunctions = {
        def: "easeOutQuad",
        swing(t, n, r, i, s) {
            return this[this.def](t, n, r, i, s);
        },
        easeInQuad(t, n, r, i) {
            return r * (t /= i) * t + n;
        },
        easeOutQuad(t, n, r, i) {
            return -r * (t /= i) * (t - 2) + n;
        },
        easeInOutQuad(t, n, r, i) {
            return (t /= i / 2) < 1
                ? (r / 2) * t * t + n
                : (-r / 2) * (--t * (t - 2) - 1) + n;
        },
        // ... (other easing functions can be optimized similarly)
        easeInBounce(t, n, r, i, s) {
            return i - this.easeOutBounce(t, s - n, 0, i, s) + r;
        },
        easeOutBounce(t, n, r, i) {
            const tDiv = t / i;
            if (tDiv < 1 / 2.75) {
                return r * 7.5625 * tDiv * tDiv + n;
            } else if (tDiv < 2 / 2.75) {
                return r * (7.5625 * (tDiv -= 1.5 / 2.75) * tDiv + 0.75) + n;
            } else if (tDiv < 2.5 / 2.75) {
                return r * (7.5625 * (tDiv -= 2.25 / 2.75) * tDiv + 0.9375) + n;
            } else {
                return r * (7.5625 * (tDiv -= 2.625 / 2.75) * tDiv + 0.984375) + n;
            }
        },
        easeInOutBounce(t, n, r, i, s) {
            return n < s / 2
                ? this.easeInBounce(t, n * 2, 0, i, s) * 0.5 + r
                : this.easeOutBounce(t, n * 2 - s, 0, i, s) * 0.5 + i * 0.5 + r;
        },
    };

    $.extend($.easing, easingFunctions);

    $.fn.animatescroll = function (options) {
        const settings = $.extend({}, $.fn.animatescroll.defaults, options);
        if (typeof settings.onScrollStart === "function") {
            settings.onScrollStart.call(this);
        }

        const targetOffset = this.offset().top;
        const scrollTarget = settings.element === "html,body"
            ? targetOffset - settings.padding
            : targetOffset - this.parent().offset().top + this.parent().scrollTop() - settings.padding;

        $(settings.element)
            .stop()
            .animate({ scrollTop: scrollTarget }, settings.scrollSpeed, settings.easing);

        setTimeout(() => {
            if (typeof settings.onScrollEnd === "function") {
                settings.onScrollEnd.call(this);
            }
        }, settings.scrollSpeed);
    };

    $.fn.animatescroll.defaults = {
        easing: "swing",
        scrollSpeed: 800,
        padding: 0,
        element: "html,body"
    };
})(jQuery);