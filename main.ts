/**
 * Hệ sinh thái giáo dục BN STEM
 * Khối lệnh điều khiển cảm biến nhiệt độ và độ ẩm BN_DHT11
 */
//% color="#E67E22" icon="\uf2c9" block="BN_Sensors" weight=100
namespace BNSensors {
  /**
   * Danh sách các chân GPIO cho bo mạch ESP32 BN STEM
   */
  export enum BNDigitalPin {
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
    P23 = 23,
  }

  /**
   * Lựa chọn thông số cần đọc từ cảm biến BN_DHT11
   */
  export enum DHT11Type {
    //% block="Nhiệt độ (°C)"
    Temperature = 0,
    //% block="Độ ẩm (%)"
    Humidity = 1,
  }

  // Lớp quản lý thực thể cảm biến
  export class BNDHT11 {
    private _pin: BNDigitalPin;

    constructor(pin: BNDigitalPin) {
      this._pin = pin;
    }

    /**
     * Đọc giá trị từ cảm biến BN_DHT11
     */
    //% blockId=bn_dht11_read
    //% block="%this| đọc %type"
    //% weight=85
    read(type: DHT11Type): number {
      // Đã bỏ tag //% shim ở đây.
      // TypeScript tự bóc tách số chân (_pin) và gọi hàm bắc cầu đã khai báo trong shims.d.ts
      return readDHT11Native(this._pin, type);
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
