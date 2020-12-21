import { inspect } from "util";

export function debug(target: any) {
    console.log(inspect(target, true, null, true))
}

export function log(...args: any) {
    // tslint:disable-next-line:no-console
    console.log(args)
}