int SERIAL_COMMUNICATION_SPEED = 9600;
int BLINKING_LED_PIN = 12;

void setup() {
  Serial.begin(SERIAL_COMMUNICATION_SPEED);
  pinMode(BLINKING_LED_PIN, OUTPUT);
  Serial.print("Setup done.");
}

void loop() {
  Serial.print("HIGH");
  digitalWrite(BLINKING_LED_PIN, HIGH);
  delay(1000);
  Serial.print("LOW");
  digitalWrite(BLINKING_LED_PIN, LOW);
  delay(1000);
}
