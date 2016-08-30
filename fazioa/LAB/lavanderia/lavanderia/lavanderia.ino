/**************************************************************************
    Souliss - Hello World

    This is the basic example, control one LED via a push-button or Android
    using SoulissApp (get it from Play Store).

    Run this code on one of the following boards:
      - Arduino Ethernet (W5100)
      - Arduino with Ethernet Shield (W5100)

    As option you can run the same code on the following, just changing the
    relevant configuration file at begin of the sketch
      - Arduino with W5200 Ethernet Shield
      - Arduino with W5500 Ethernet Shield

***************************************************************************/

// Let the IDE point to the Souliss framework
#include "SoulissFramework.h"

// Configure the framework
#include "bconf/StandardArduino.h"          // Use a standard Arduino
#include "conf/ethW5100.h"                  // Ethernet through Wiznet W5100
#include "conf/Gateway.h"                   // The main node is the Gateway, we have just one node
#include "conf/Webhook.h"                   // Enable DHCP and DNS

// Include framework code and libraries
#include <SPI.h>

/*** All configuration includes should be above this line ***/
#include "Souliss.h"

// This identify the number of the LED logic
#define slotT22_saracinesca 0
#define slotT11_WARNINGLIGHT 2
#define slotT13_CURTAINLIGHT 3

#define pinInputOPEN   2   //used internal pull up resistor
#define pinInputCLOSE   3 //used internal pull up resistor

#define pinOutputReleOPEN   4
#define pinOutputReleCLOSE   5
#define pinOutputReleWARNINGLIGHT   6
#define pinInputCURTAINLIGHT   7  //need pull down resistor

#define timer_saracinesca      0x12 //18 DEC - Circa 20 secondi

void setup()
{
  Initialize();

  // Get the IP address from DHCP
  GetIPAddress();
  SetAsGateway(myvNet_dhcp);       // Set this node as gateway for SoulissApp

  pinMode(pinInputOPEN, INPUT_PULLUP);
  pinMode(pinInputCLOSE, INPUT_PULLUP);
  pinMode(pinInputCURTAINLIGHT, INPUT);

  pinMode(pinOutputReleOPEN, OUTPUT);
  pinMode(pinOutputReleCLOSE, OUTPUT);
  pinMode(pinOutputReleWARNINGLIGHT, OUTPUT);

  Set_Windows(slotT22_saracinesca);
  Set_SimpleLight(slotT11_WARNINGLIGHT); //luce lampeggiante di sicurezza
  Set_DigitalInput(slotT13_CURTAINLIGHT); //barriera infrarosso di sicurezza - E' impostata solo per avere lo stato in SoulissApp
}

void loop()
{
  // Here we start to play
  EXECUTEFAST() {
    UPDATEFAST();

    FAST_50ms() {   // We process the logic and relevant input and output every 50 milliseconds
      DigIn(pinInputOPEN, Souliss_T2n_OpenCmd_Local, slotT22_saracinesca);
      DigIn(pinInputCLOSE, Souliss_T2n_CloseCmd_Local, slotT22_saracinesca);
      DigIn(pinInputCURTAINLIGHT, Souliss_T2n_StopCmd, slotT22_saracinesca);  //collega il pin di input del sensore di sicurezza allo slot della saracinesca. Passa il comando STOP in caso di attivazione

      Souliss_Logic_T22(memory_map, slotT22_saracinesca, &data_changed, timer_saracinesca);
      Logic_SimpleLight(slotT11_WARNINGLIGHT); //processa la logica per la luce lampeggiante di sicurezza
      Logic_T13(slotT13_CURTAINLIGHT);   //processa la logica per la barriera infrarosso di sicurezza

      DigOut(pinOutputReleOPEN, Souliss_T2n_Coil_Open, slotT22_saracinesca); //pone a 1 il PIN di OUTPUT quando lo stato di uscita dello slot è Souliss_T2n_Coil_Open
      DigOut(pinOutputReleCLOSE, Souliss_T2n_Coil_Close, slotT22_saracinesca); //pone a 1 il PIN di OUTPUT quando lo stato di uscita dello slot è Souliss_T2n_Coil_Close
    }

    FAST_510ms() {
      if (mOutput(slotT22_saracinesca)  == Souliss_T2n_Coil_Open || mOutput(slotT22_saracinesca)  == Souliss_T2n_Coil_Close) {
        mInput(slotT11_WARNINGLIGHT) = Souliss_T1n_OnCmd;
      } else {
        mInput(slotT11_WARNINGLIGHT) = Souliss_T1n_OffCmd;
      }
    }



    FAST_1110ms() {
      // Time out commands if no limit switches are received
      Timer_Windows(slotT22_saracinesca);
    }
    // Here we handle here the communication with Android, commands and notification
    // are automatically assigned to MYLEDLOGIC
    FAST_GatewayComms();

  }
  EXECUTESLOW() {
    UPDATESLOW();


  }
}
