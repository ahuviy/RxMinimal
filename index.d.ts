// Type definitions for RxMinimal

declare class Observer {
    constructor(onNext?: (value?: any) => void, onError?: (err: any) => void, onComplete?: () => void, isAsync?: boolean);
    isUnsubscribed: boolean;
    onNext: (value?: any) => void;
    onError: (err: any) => void;
    onComplete: () => void;
}

export declare class Subscription {
    constructor(observer: Observer);
    unsubscribe(): void;
}

export declare class Subject<T> {
    constructor(isAsync?: boolean);
    subscribe(onNext?: (value: T) => void, onError?: (err: any) => void, onComplete?: () => void): Subscription;
    next(value?: T): void;
    error(err: any): void;
    complete(): void;
    isClosed(): boolean;
    asObservable(): {
        subscribe(onNext?: (value: T) => void, onError?: (err: any) => void, onComplete?: () => void): Subscription;
    };
}

export declare class BehaviorSubject<T> extends Subject<T> {
    constructor(initialValue: T, isAsync?: boolean);
    getValue(): T;
    subscribe(onNext?: (value: T) => void, onError?: (err: any) => void, onComplete?: () => void): Subscription;
    next(value?: T): void;
    error(err: any): void;
    complete(): void;
    isClosed(): boolean;
    asObservable(): {
        subscribe(onNext?: (value: T) => void, onError?: (err: any) => void, onComplete?: () => void): Subscription;
    };
}
