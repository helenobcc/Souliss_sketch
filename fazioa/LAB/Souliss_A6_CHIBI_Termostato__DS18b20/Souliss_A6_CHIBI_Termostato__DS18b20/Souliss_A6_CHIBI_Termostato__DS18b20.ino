#define  BOARDTYPE_INSKETCH
#define  QC_BOARDTYPE  0x01      /** Freaklabs Chibiduino */

#define  GATEWAYTYPE_INSKETCH
#define  QC_GATEWAYTYPE  0x00    // NO Define board as gateway
/**************************************************************************
	Souliss - Thermostat

	Control the heating or cooling of using a temperature measure and a
	setpoint, based on the percentage distance from the setpoint runs the
	fans.

	The temperature measure is acquired throught Souliss and available at the
	user interfaces as half-precision floating point. All calculation shall be
	performed as standard floating point and at the end converted in half
	precision using :
		void Souliss_AnalogIn(U8 pin, U8 *memory_map, U8 slot,
								float scaling, float bias);

	Is suggested a scaling to the vRef of the AVR's ADC, using an external
	amplification circuit, in order to use the whole resolution.

	The Device has
		- An analog sensor or device on PIN A0

	CONFIGURATION IS MANDATORY BEFORE COMPILING
	Before compiling this code, is mandatory the configuration of the framework
	this ensure the use of proper drivers based functionalities and requested
	communication interface.

	Configuration files are located on /conf folder, is suggested to use this
	code on one of the boards listed below, the code can also compile on other
	boards but may require modification on I/O definitions.

	Run this code on one of the following boards:

		Board Conf Code			Board Model
        0x03        			Arduino Ethernet (W5100)
		0x04					Arduino with Ethernet Shield (W5100)
		0x05					Arduino with ENC28J60 Ethernet Shield

	******************** Configuration Parameters *********************

		Configuration file		Parameter
		QuickCfg.h				#define	QC_ENABLE			0x01
		QuickCfg.h				#define	QC_BOARDTYPE		0x03, 0x04, 0x05

		QuickCfg.h				#define	QC_GATEWAYTYPE		0x01

	Is required an additional IP configuration using the following parameters
		QuickCfg.h				const uint8_t DEFAULT_BASEIPADDRESS[] = {...}
		QuickCfg.h				const uint8_t DEFAULT_SUBMASK[]       = {...}
		QuickCfg.h				const uint8_t DEFAULT_GATEWAY[]       = {...}

***************************************************************************/
#include "Souliss.h"
#include "Typicals.h"
#include <SPI.h>
#include <OneWire.h>
#include "DallasTemperature.h"

#define network_chibi_address_3	0x6512
#define network_my_subnet	0xFF00
#define network_my_supern	0x0069

#define ANALOGDAQ				0			// This is the memory slot used for the execution of the logic in network_address1

// define the shared memory map
U8 memory_map[MaCaco_MEMMAP];

// flag
U8 data_changed = 0;

#define time_base_fast		10				// Time cycle in milliseconds
#define time_base_slow		1000			// Time cycle in milliseconds
#define num_phases			255				// Number of phases

#define DSPIN       14
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(DSPIN);
// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);

U8 phase_speedy = 0, phase_fast = 0, phase_slow = 0;
unsigned long tmr_fast = 0, tmr_slow = 0;
    float temperature;
void setup()
{
  Serial.begin(9600);
  // Setup the network configuration
  //
  //	The vNet address is 11(hex) that is 17(dec), so the IP address is
  //	the base IP address with 17 as last octect (ex. 192.168.0.17)
  Souliss_SetAddress(network_chibi_address_3, network_my_subnet, network_my_supern);


  // Set the typical to use in slot 0
  Souliss_SetT31(memory_map, ANALOGDAQ);

  // Define output pins
  pinMode(2, OUTPUT);		// Heater
  pinMode(3, OUTPUT);		// Fan 1
  pinMode(4, OUTPUT);		// Fan 2
  pinMode(5, OUTPUT);		// Fan 3

  // Start up the library
  sensors.begin(); // IC Default 9 bit. If you have troubles consider upping it 12.
}

void loop()
{

  if (abs(millis() - tmr_fast) > time_base_fast)
  {
    tmr_fast = millis();
    phase_fast = (phase_fast + 1) % num_phases;

    // Execute the code every 5 time_base_fast
    if (!(phase_fast % 5))
    {
      // Retreive data from the MaCaco communication channel
      Souliss_CommunicationData(memory_map, &data_changed);
    }

    // Execute the code every 11 time_base_fast
    if (!(phase_fast % 11))
    {
      // The logic is executed faster than the data acquisition just to have a
      // prompt answer to the user commands, but the real rate is defined by
      // the temperature measure rate.

      // Compare the setpoint from the user interface with the measured temperature
      Souliss_Logic_T31(memory_map, ANALOGDAQ, &data_changed);

      // Start the heater and the fans
      Souliss_nDigOut(2, Souliss_T3n_HeatingOn, memory_map, ANALOGDAQ);	// Heater
      Souliss_nDigOut(3, Souliss_T3n_FanOn1   , memory_map, ANALOGDAQ);	// Fan1
      Souliss_nDigOut(4, Souliss_T3n_FanOn2   , memory_map, ANALOGDAQ);	// Fan2
      Souliss_nDigOut(5, Souliss_T3n_FanOn3   , memory_map, ANALOGDAQ);	// Fan3

      // We are not handling the cooling mode, if enabled by the user, force it back
      // to disable
      if (Souliss_Output(memory_map, ANALOGDAQ) & Souliss_T3n_CoolingOn)
        Souliss_Output(memory_map, ANALOGDAQ) &= ~Souliss_T3n_CoolingOn;
    }

    // Execute the code every 101 time_base_fast
    if (!(phase_fast % 101))
    {
  
      sensors.requestTemperatures(); // Send the command to get temperatures
      // SENSORE 1
      temperature = sensors.getTempCByIndex(0);
      Souliss_ImportAnalog(memory_map, ANALOGDAQ +1, &temperature);

    }
  } else if (abs(millis() - tmr_slow) > time_base_slow)
  {
    tmr_slow = millis();
    phase_slow = (phase_slow + 1) % num_phases;

    // Execute the code every 1 time_base_slow
    if (!(phase_slow % 1))
    {
      Serial.println(temperature);
    }
  }
}
