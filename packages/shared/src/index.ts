
interface HelloSteve {
    readonly steve: string;
}

export function doSteve() : HelloSteve {
    return {
        steve: "STEVE is here"
    }
}