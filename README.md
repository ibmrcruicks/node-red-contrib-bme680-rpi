# node-red-contrib-bme680-rpi

Repurpose [node-red-contrib-bme280-rpi](https://github.com/ngi644/node-red-contrib-bme280-rpi) to support BME680 I2C sensor, using underlying BME680 support from https://gitlab.com/ftmazzone/bme680

Returns environment data from [Bosch BME 680 multisensor](https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme680/):
+ temperature
+ humidity
+ air pressure
+ gas resistance

Assumes i2c interface, as implemented by [Pimoroni BME680 breakout board](https://shop.pimoroni.com/products/bme680-breakout)

![bme680](https://cdn.shopify.com/s/files/1/0174/1800/products/BME680_breakout_v2_1_of_3_1024x1024.JPG?v=1527869791)
