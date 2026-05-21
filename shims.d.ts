// Định nghĩa các hàm C++ sẽ được ánh xạ sang môi trường TypeScript
declare namespace BNSensors {
    /**
     * Hàm này sẽ map trực tiếp với hàm xử lý C++ dưới phần cứng
     * @param pin Chân đọc dữ liệu
     * @param type Loại dữ liệu (0: Nhiệt độ, 1: Độ ẩm)
     */
    //% shim=BNSensors::readDHT11Native
    function readDHT11Native(pin: number, type: number): number;
}