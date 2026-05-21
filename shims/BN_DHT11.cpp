#ifdef CODAL_CORE
// Khi biên dịch thật trên MakeCode
#include "Arduino.h"
#include "pxt.h"
#else
// Khi viết code offline trên VS Code, giả lập môi trường để tránh lỗi IntelliSense
#include <math.h> // Để dập lỗi hàm isnan() và hằng số NAN
#include <stdint.h>
extern uint32_t millis();
extern void pinMode(uint8_t pin, uint8_t mode);
extern void digitalWrite(uint8_t pin, uint8_t val);
extern int digitalRead(uint8_t pin);
extern void delay(uint32_t ms);
extern void delayMicroseconds(uint32_t us);
#define INPUT_PULLUP 2
#define OUTPUT 1
#define HIGH 1
#define LOW 0
#endif

#include "BN_DHT11.h"


// DRIVER C++ CÓ SẴN CỦA HỆ SINH THÁI BN
// ==========================================

BN_DHT11::BN_DHT11(uint8_t pin)
{
    _pin = pin;
    _lastreadtime = millis() - 2000;
}

void BN_DHT11::begin(void)
{
    pinMode(_pin, INPUT_PULLUP);
}

float BN_DHT11::readHumidity(void)
{
    if (read())
        return _lasthumidity;
    return NAN;
}

float BN_DHT11::readTemperature(bool S)
{
    if (read())
        return _lasttemperature;
    return NAN;
}

bool BN_DHT11::read(bool force)
{
    uint32_t currenttime = millis();
    if (!force && ((currenttime - _lastreadtime) < 2000))
        return true;
    _lastreadtime = currenttime;

    _lasthumidity = _lasttemperature = NAN;

    uint8_t laststate = HIGH;
    uint32_t counter = 0;
    uint8_t j = 0, i;

    data[0] = data[1] = data[2] = data[3] = data[4] = 0;

    pinMode(_pin, OUTPUT);
    digitalWrite(_pin, LOW);
    delay(20);
    digitalWrite(_pin, HIGH);
    delayMicroseconds(40);
    pinMode(_pin, INPUT_PULLUP);

    for (i = 0; i < 85; i++)
    {
        counter = 0;
        while (digitalRead(_pin) == laststate)
        {
            counter++;
            delayMicroseconds(1);
            if (counter == 100)
                break;
        }
        laststate = digitalRead(_pin);
        if (counter == 100)
            break;

        if ((i >= 4) && (i % 2 == 0))
        {
            data[j / 8] <<= 1;
            if (counter > 30)
                data[j / 8] |= 1;
            j++;
        }
    }

    if ((j >= 40) && (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)))
    {
        _lasthumidity = data[0];
        _lasttemperature = data[2];
        return true;
    }
    return false;
}

// ==========================================
// CẦU NỐI WRAPPER LIÊN KẾT VỚI MAKECODE
// ==========================================

// Sử dụng namespace chung để map chuẩn với file shims.d.ts và main.ts
namespace BNSensors {
    
    // Hàm Wrapper nhận tham số từ TypeScript truyền xuống tầng cứng ESP32
    int readDHT11Native(int pin, int type) {
        
        // Tạo thực thể từ Class driver của bạn với chân pin nhận được
        BN_DHT11 dht(pin);
        
        if (type == 0) {
            // Học sinh chọn đọc Nhiệt độ
            float temp = dht.readTemperature();
            return (isnan(temp)) ? -99 : (int)temp; 
        } else {
            // Học sinh chọn đọc Độ ẩm
            float hum = dht.readHumidity();
            return (isnan(hum)) ? -99 : (int)hum;
        }
    }
}