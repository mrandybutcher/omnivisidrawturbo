import {pointScale} from "./point";
import {Box} from "./box";

describe("pointScale Tests", () => {
    const originBox: Box = {
        x1: 100, y1: 100, x2: 200, y2: 200
    };
    describe("translate noscale tests", () => {
        const translateBox: Box = {
            x1: 200, y1: 200, x2: 300, y2: 300
        };
        it("translate 0,0", () => {
            expect(pointScale({
                x: 100, y: 100
            }, originBox, translateBox)).toStrictEqual({
                x: 200, y: 200
            });
        });
        it("translate 1,0", () => {
            expect(pointScale({
                x: 200, y: 100
            }, originBox, translateBox)).toStrictEqual({
                x: 300, y: 200
            });
        });
        it("translate 0,1", () => {
            expect(pointScale({
                x: 100, y: 200
            }, originBox, translateBox)).toStrictEqual({
                x: 200, y: 300
            });
        });
        it("translate 1,1", () => {
            expect(pointScale({
                x: 200, y: 200
            }, originBox, translateBox)).toStrictEqual({
                x: 300, y: 300
            })
        });
        it("translate 0.5,0.5", () => {
            expect(pointScale({
                x: 150, y: 150
            }, originBox, translateBox)).toStrictEqual({
                x: 250, y: 250
            })
        });
    });
    describe("translate scale test extremes", () => {
        const translateBox: Box = {
            x1: 100, y1: 100, x2: 300, y2: 300
        };
        it("translate 0,0", () => {
            expect(pointScale({
                x: 100, y: 100
            }, originBox, translateBox)).toStrictEqual({
                x: 100, y: 100
            });
        });
        it("translate 1,0", () => {
            expect(pointScale({
                x: 200, y: 100
            }, originBox, translateBox)).toStrictEqual({
                x: 300, y: 100
            });
        });
        it("translate 0,1", () => {
            expect(pointScale({
                x: 100, y: 200
            }, originBox, translateBox)).toStrictEqual({
                x: 100, y: 300
            });
        });
        it("translate 1,1", () => {
            expect(pointScale({
                x: 200, y: 200
            }, originBox, translateBox)).toStrictEqual({
                x: 300, y: 300
            })
        });
    });
    describe("translate scale test midpoint", () => {
        const translateBox: Box = {
            x1: 100, y1: 100, x2: 300, y2: 300
        };
        it("translate 0,0", () => {
            expect(pointScale({
                x: 150, y: 150
            }, originBox, translateBox)).toStrictEqual({
                x: 200, y: 200
            });
        });
    });
});
