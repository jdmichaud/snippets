# Hardware

Plug the raspberry as shows in the included schematics (simple_RF_receiver.fzz).

# Software

Install wiringPi (a c library intended to ease use of the GPIO pins) and
433Utils (a suite of simple tools to manipulate you RF receiver).

## wiringPi

```
git clone https://github.com/WiringPi/WiringPi.git
```

A tarball is provided in this folder (`WiringPi.tgz`).
To compile it, in the WiringPi folder, enter:
```
./build
```

You might need to sudo.

To test it, try:
```
gpio readall
```

## 433Utils

```
git clone https://github.com/ninjablocks/433Utils.git
```

A tarball is provided in this folder (`433Utils.tgz`).
To build it, in `433Utils/RPi_utils`, enter:
```
make
```

Then launch the RCSniffer:
```
./RCSniffer
```

# :warning: Make sure you sure antennas and that the RX/TX module are not next to the board of the USB cable :warning:
