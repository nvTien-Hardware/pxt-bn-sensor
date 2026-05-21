enum BNDigitalPin {
    P0 = 0,
    P2 = 2,
    P4 = 4,
    P5 = 5,
    P12 = 12,
    P13 = 13,
    P14 = 14,
    P15 = 15,
    P16 = 16,
    P17 = 17,
    P18 = 18,
    P19 = 19,
    P21 = 21,
    P22 = 22,
    P23 = 23
}
namespace BNSensors {

    export class BNDHT11 {
        private _pin: BNDigitalPin;

        constructor(pin: BNDigitalPin) {
            this._pin = pin;
        }
    }

    /**
     * Khởi tạo cảm biến BN_DHT11 với chân kết nối trên ESP32
     * @param pin Chân tín hiệu Data kết nối với cảm biến, ví dụ: BNDigitalPin.P4
     */
    //% blockId=bn_dht11_init
    //% block="Khởi tạo BN_DHT11 tại chân %pin"
    //% weight=90
    export function createDHT11(pin: BNDigitalPin): BNDHT11 {
        return new BNDHT11(pin);
    }
}
