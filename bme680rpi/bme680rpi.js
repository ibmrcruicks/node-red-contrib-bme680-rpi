module.exports = function(RED){

    var bme680Sensor = require('bme680-sensor');

    function bme680rpi(n){
        //init
        RED.nodes.createNode(this, n);

        //properties
        this.name = n.name;
        this.bus = n.bus;
        this.address = n.address;
        this.interval = n.interval;
	    //console.log(this.address, this.bus);
        this.sensor = new bme680Sensor({i2cBusNo: parseInt(this.bus), i2cAddress: parseInt(this.address, 16)});
        this.status({});

        var node = this;

        var msg = { topic:node.name + '/A' + node.bus };

        node.sensor.init()
          .then(() => {
            console.log('BME680 initialization succeeded');
          })
          .catch((err) => console.error(`BME680 initialization failed: ${err} `));

        //poll reading at interval
        this.timer = setInterval(() => {

            node.sensor.readSensorData()
                .then((data) => {
                    var temperature = data.temperature;
                    var pressure = data.pressure;
                    var humidity = data.humidity;
                    var gas_resistance = data.gas_resistance;
                    msg.temperature = temperature;
                    msg.pressure = pressure;
                    msg.humidity = humidity;
                    msg.gas_resistance = gas_resistance;
                    msg.calibration_data = data.calibration_data;
                    msg.payload = JSON.stringify({temperature: temperature, pressure: pressure, humidity: humidity, gas_resistance: gas_resistance});
                    node.send(msg);
                })
                .catch((err) => {
                  console.log(`BME680 read error: ${err}`);
                });
        }, node.interval);

        //clear interval on exit
        this.on('close', function() {
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('bme680rpi', bme680rpi);
};
