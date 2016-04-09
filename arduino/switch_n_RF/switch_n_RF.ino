#include <RCSwitch.h>
#include <LowPower.h>

/*
 * This example demonstrate how to use the generic 433 Mhz
 * Radio Frequency emitter using the RFSwitch library
 * LowPower is used to decrease power consumption.
 */

RCSwitch rfDevice = RCSwitch();

int SERIAL_COMMUNICATION_SPEED = 9600;  
// Pin on which the RF device is plugged;
int RF_DEVICE_PIN = 12;
// internal LED
int INTERNAL_LED = 13;

void setup() {
  Serial.begin(SERIAL_COMMUNICATION_SPEED);
  /***********************  RF Device initialisation **************************/
  rfDevice.enableTransmit(RF_DEVICE_PIN);
  // Optional set pulse length.
  // rfDevice.setPulseLength(320);
  // Optional set protocol (default is 1, will work for most outlets)
  // rfDevice.setProtocol(2);
  // Optional set number of transmission repetitions.
  // rfDevice.setRepeatTransmit(15);
  /*************************  Pins initialisation ****************************/
  pinMode(RF_DEVICE_PIN, OUTPUT);
  // Just turn useless LED to off
  pinMode(INTERNAL_LED, OUTPUT);
  digitalWrite(INTERNAL_LED, LOW);
}

void loop() {
  Serial.print("sending...");
  rfDevice.send(5393, 24);
  Serial.println("done");
  delay(1000);  
  Serial.print("sending...");
  rfDevice.send(5396, 24);
  Serial.println("done");
  delay(1000);  
}
