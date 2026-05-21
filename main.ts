// ==========================================
// PHÂN VÙNG GIẢ LẬP API MAKECODE ĐỂ KHỬ LỖI VS CODE
// ==========================================
declare interface DigitalPin { }
declare namespace pins {
    function digitalWritePin(pin: any, value: number): void;
    function digitalReadPin(pin: any): number;
    function digitalPinOverclock(pin: any): void;
}
declare namespace basic {
    function pause(ms: number): void;
}
declare namespace control {
    function waitMicros(us: number): void;
}

// ==========================================
// MÃ NGUỒN CẤU TRÚC DRIVER BN_SENSORS
// ==========================================
/**
 * Hệ sinh thái giáo dục BN STEM
 * Khối lệnh điều khiển cảm biến nhiệt độ và độ ẩm BN_DHT11 viết bằng Pure TypeScript
 */
//% color="#E67E22" icon="\uf2c9" block="BN_Sensors" weight=100
namespace BNSensors {

    export enum BNDigitalPin {
        P0 = 0, P2 = 2, P4 = 4, P5 = 5, P12 = 12, P13 = 13, P14 = 14, P15 = 15, P16 = 16, P17 = 17, P18 = 18, P19 = 19, P21 = 21, P22 = 22, P23 = 23
    }

    export enum DHT11Type {
        //% block="Nhiệt độ (°C)"
        Temperature = 0,
        //% block="Độ ẩm (%)"
        Humidity = 1
    }

    export class BNDHT11 {
        private _pin: any; // Chuyển sang kiểu any để tương thích cơ chế ép kiểu offline

        constructor(pin: BNDigitalPin) {
            this._pin = pin;
        }

        /**
         * Đọc giá trị từ cảm biến BN_DHT11 bằng cách quét xung trực tiếp trong TypeScript
         */
        //% blockId=bn_dht11_read
        //% block="%this| đọc %type"
        //% weight=85
        read(type: DHT11Type): number {
            let pin = this._pin;
            
            // Kích xung 1-wire
            pins.digitalWritePin(pin, 0);
            basic.pause(18); 
            pins.digitalWritePin(pin, 1);
            pins.digitalPinOverclock(pin); 

            // Đợi phản hồi từ cảm biến
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            while (pins.digitalReadPin(pin) == 1);

            // Đọc 40 bit dữ liệu xung
            let data = [0, 0, 0, 0, 0];
            for (let i = 0; i < 40; i++) {
                while (pins.digitalReadPin(pin) == 0);
                control.waitMicros(30);
                if (pins.digitalReadPin(pin) == 1) {
                    data[Math.floor(i / 8)] |= (1 << (7 - (i % 8)));
                    while (pins.digitalReadPin(pin) == 1);
                }
            }

            // Kiểm tra Checksum dữ liệu
            if ((data[4] === ((data[0] + data[1] + data[2] + data[3]) & 0xFF))) {
                if (type === DHT11Type.Temperature) return data[2];
                if (type === DHT11Type.Humidity) return data[0];
            }
            
            return -99; 
        }
    }

    /**
     * Khởi tạo cảm biến BN_DHT11 với chân kết nối trên ESP32
     * @param pin Chân tín hiệu Data kết nối với cảm biến
     */
    //% blockId=bn_dht11_init
    //% block="Khởi tạo BN_DHT11 tại chân %pin"
    //% weight=90
    export function createDHT11(pin: BNDigitalPin): BNDHT11 {
        return new BNDHT11(pin);
    }
}