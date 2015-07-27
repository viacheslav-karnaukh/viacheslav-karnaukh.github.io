define(function() {
    'use strict';
    var mediator = (function() {
        var subscribe = function(channel, fn) {
            if (!mediator.channels[channel]) mediator.channels[channel] = [];
            mediator.channels[channel].push({
                context: this,
                callback: fn
            });
            return this;
        };
        var publish = function(channel) {
            if (!mediator.channels[channel]) return false;
            var args = [].slice.call(arguments, 1);
            mediator.channels[channel].forEach(function(subscription) {
                subscription.callback.apply(subscription.context, args);
            });
            return this;
        };
        return {
            channels: {},
            publish: publish,
            subscribe: subscribe,
            installTo: function(obj) {
                obj.subscribe = subscribe;
                obj.publish = publish;
            }
        };

    }());
    return mediator;
});