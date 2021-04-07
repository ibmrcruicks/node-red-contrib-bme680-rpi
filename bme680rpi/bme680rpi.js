module.exports = function(RED){
	
var Bme680 = require('bme680-sensor/lib/bme680.js');

function bme680rpi(n){
//init
	RED.nodes.createNode(this, n);

//properties
        this.name = n.name || "BME680";
        this.bus = n.bus;
        this.address = n.address;
        this.interval = n.interval;
        this.sensor = new Bme680( parseInt(this.bus),  parseInt(this.address, 16));
        this.status({});

        var node = this;
        var msg = { topic: node.name + '/' + node.bus + '/' + node.address};

        node.sensor.initialize()
		.then(() => {
		      console.log('BME680 initialization succeeded');
		})
		.catch((err) => console.error(`BME680 initialization failed: ${err} `));

//poll reading at interval
        this.timer = setInterval(() => {
		node.sensor.getSensorData()
			.then((data) => {
                const bme680data =  data;
			    const heat_stable = bme680data.data.heat_stable;
			    const temperature = bme680data.data.temperature;
                const pressure = bme680data.data.pressure;
                const humidity = bme680data.data.humidity;
                const gas_resistance = bme680data.data.gas_resistance;
                msg.calibration_data = bme680data.calibration_data;
                msg.gas_settings = bme680data.gas_settings;
                msg.payload = {
                    heat_stable: heat_stable,
                    temperature_C: temperature,
                    pressure_hPa: pressure,
                    humidity_pc: humidity,
                    gas_resistance_Ohms: gas_resistance
                };
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
