
// A Subject is similar to an RxJS Subject and exposes a similar API.
// It is an event-stream emitter that can be subscribed to.
function Subject(isAsync) {
    var observers = [];
    var closed = false;

    function subscribe(onNext, onError, onComplete) {
        if (closed) {
            return Subscription(Observer());
        } else {
            var observer = Observer(onNext, onError, onComplete, isAsync);
            observers.push(observer);
            return Subscription(observer);
        }
    }

    function next(value) {
        if (!closed) {
            observers = observers.filter(function (o) { return !o.isUnsubscribed; });
            observers.forEach(function (o) { o.onNext(value); });
        }
    }

    function error(err) {
        if (!closed) {
            observers.forEach(function (o) {
                if (!o.isUnsubscribed) {
                    o.onError(err);
                }
            });
            observers = [];
            closed = true;
        }
    }

    function complete() {
        if (!closed) {
            observers.forEach(function (o) {
                if (!o.isUnsubscribed) {
                    o.onComplete();
                }
            });
            observers = [];
            closed = true;
        }
    }

    function isClosed() {
        return closed;
    }

    function asObservable() {
        return Object.freeze({
            subscribe: subscribe
        });
    }

    return Object.freeze({
        subscribe: subscribe,
        next: next,
        error: error,
        complete: complete,
        isClosed: isClosed,
        asObservable: asObservable
    });
}


// A BehaviorSubject exposes the same API as the RxJS BehaviorSubject.
// It is just like a Subject, except that it includes a buffer, which
// stores a current value.
// The current value is emitted on the moment of subscription.
function BehaviorSubject(initialValue, isAsync) {
    var currentValue = initialValue;
    var subject = Subject(isAsync);

    function getValue() {
        return currentValue;
    }

    function subscribe(onNext, onError, onComplete) {
        onNext(currentValue);
        if (subject.isClosed()) {
            return Subscription(Observer());
        } else {
            return subject.subscribe(onNext, onError, onComplete);
        }
    }

    function next(value) {
        if (!subject.isClosed()) {
            currentValue = value;
            subject.next(value);
        }
    }

    function asObservable() {
        return Object.freeze({
            subscribe: subscribe
        });
    }

    return Object.freeze({
        getValue: getValue,
        subscribe: subscribe,
        next: next,
        error: subject.error,
        complete: subject.complete,
        isClosed: subject.isClosed,
        asObservable: asObservable
    });
}


// Similar to the RxJS Subscription. When you subscribe to a
// Subject/BehaviorSubject, you receive this object. You can use
// its unsubscribe method to stop receiving updates from the
// Subject/BehaviorSubject.
function Subscription(observer) {
    function unsubscribe() {
        if (observer) {
            observer.isUnsubscribed = true;
            observer = undefined;
        }
    }

    return Object.freeze({
        unsubscribe: unsubscribe
    });
}


// The Observer is an intermediary object that connects the
// Subject/BehaviorSubject to the Subscription.
function Observer(onNext, onError, onComplete, isAsync) {
    var isUnsubscribed = false;

    if (!onNext || typeof onNext !== 'function') {
        onNext = function () { }
    }
    if (!onComplete || typeof onComplete !== 'function') {
        onComplete = function () { }
    }
    if (!onError || typeof onError !== 'function') {
        onError = function () { }
    }
    if (isAsync) {
        onNext = setTimeout(onNext, 0);
        onError = setTimeout(onError, 0);
        onComplete = setTimeout(onComplete, 0);
    }

    return {
        onNext: onNext,
        onError: onError,
        onComplete: onComplete,
        isUnsubscribed: isUnsubscribed
    };
}

exports.Subject = Subject;
exports.BehaviorSubject = BehaviorSubject;
