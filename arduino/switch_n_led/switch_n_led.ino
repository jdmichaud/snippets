#include <LowPower.h>

/*
 * This example shows how to read the status of a input switch
 * and flash a LED when that switch change its state.
 * To reduce power consumption, the MCU is put to sleep and we
 * use the switch pin as a interrupt source.
 */

int SERIAL_COMMUNICATION_SPEED = 9600;
// Pin on which the magnetic swith is plugged.
int MAGNETIC_SWITCH_PIN = 3;
// Pin on which the RF device is plugged;
int RF_DEVICE_PIN = 12;
// internal LED
int INTERNAL_LED = 13;
// Status of the magnetic switch. We consider the door closed
boolean contact = true;

// Function called on interrupt
void wakeUp() {
  // It is a critical section so don't do anything
}

void flashLED() {
  digitalWrite(RF_DEVICE_PIN, HIGH);
  delay(50);
  digitalWrite(RF_DEVICE_PIN, LOW);
}

void setup() {
  Serial.begin(SERIAL_COMMUNICATION_SPEED);
  /*************************  Pins initialisation ****************************/
  // Allow wake up pin to trigger interrupt on state change.
  attachInterrupt(digitalPinToInterrupt(MAGNETIC_SWITCH_PIN), wakeUp, CHANGE);
  // Set the pin to PULLUP so we don't need an additional resistor
  // WARNING, the order of the instruction matters. attachInterrup will
  // erase the PULLUP switch, so configure the PULLUP after the
  // attacheInterrupt
  pinMode(MAGNETIC_SWITCH_PIN, INPUT_PULLUP);
  pinMode(RF_DEVICE_PIN, OUTPUT);
  // Just turn useless LED to off
  pinMode(INTERNAL_LED, OUTPUT);
  digitalWrite(INTERNAL_LED, LOW);
}

void loop() {
  // Go to sleep mode
  LowPower.powerDown(SLEEP_FOREVER, ADC_OFF, BOD_OFF);

  // Check contact state. We assume a normally closed switch.
  boolean newContact = digitalRead(MAGNETIC_SWITCH_PIN);
  // Does the contact status changed since we last check
  if (newContact != contact) {
    // Send the status of the contact on one bit
    //rfDevice.send(contact, 1);
    flashLED();
    // Update the status of the contact
    contact = newContact;
    //Serial.print("pushing to RF device: ");
    //Serial.println(contact);
  }
}
