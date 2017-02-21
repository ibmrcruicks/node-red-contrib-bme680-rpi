module.exports = function(RED){

    var bme280Sensor = require('bme280-sensor');

    function bme280rpi(n){
        //init
        RED.nodes.createNode(this, n);

        //properties
        this.name = n.name;
        this.bus = n.bus;
        this.address = n.address;
        this.interval = n.interval;
	    //console.log(this.address, this.bus);
        this.sensor = new bme280Sensor({i2cBusNo: parseInt(this.bus), i2cAddress: parseInt(this.address, 16)});
        this.status({});

        var node = this;

        var msg = { topic:node.name + '/A' + node.bus };

        node.sensor.init()
          .then(() => {
            console.log('BME280 initialization succeeded');
          })
          .catch((err) => console.error(`BME280 initialization failed: ${err} `));

        //poll reading at interval
        this.timer = setInterval(() => {

            node.sensor.readSensorData()
                .then((data) => {
                    var temperature = data.temperature_C;
                    var pressure = data.pressure_hPa;
                    var humidity = data.humidity;
                    msg.temperature = temperature;
                    msg.pressure = pressure;
                    msg.humidity = humidity;
                    msg.payload = JSON.stringify({temperature: temperature, pressure: pressure, humidity: humidity});
                    node.send(msg);
                })
                .catch((err) => {
                  console.log(`BME280 read error: ${err}`);
                });
        }, node.interval);

        //clear interval on exit
        this.on('close', function() {
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('bme280rpi', bme280rpi);
};
