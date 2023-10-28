"use client";
import React, { useRef, useState } from "react";

const ThermalPrinter = () => {
  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.0.101");
  const [printerPort, setPrinterPort] = useState("8008");
  const [textToPrint, setTextToPrint] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const ePosDevice = useRef();
  const printer = useRef();
  const STATUS_CONNECTED = "Connected";
  const connect = () => {
    setConnectionStatus("Connecting ...");
    if (!printerIPAddress) {
      setConnectionStatus("Type the printer IP address");
      return;
    }
    if (!printerPort) {
      setConnectionStatus("Type the printer port");
      return;
    }
    setConnectionStatus("Connecting ...");
    let ePosDev = new window.epson.ePOSDevice(); 
    ePosDevice.current = ePosDev;
    ePosDev.connect(printerIPAddress, printerPort, (data: string) => {
      if (data === "OK") {
        ePosDev.createDevice(
          "local_printer",
          ePosDev.DEVICE_TYPE_PRINTER,
          { crypto: true, buffer: false },
          (devobj: any, retcode: string) => {
            if (retcode === "OK") {
              printer.current = devobj;
              setConnectionStatus(STATUS_CONNECTED);
            } else {
              throw retcode;
            }
          }
        );
      } else {
        throw data;
      }
    });
  };

  const print = (text: string) => {
    let prn = printer.current as any;
    if (!prn) {
      alert("Not connected to printer");
      return;
    }
    prn.addTextSize(2, 2);
    prn.addText("Order:   HA0001\n");
    prn.addText("\n"); // Extra line space
    prn.addTextSize(1, 1); // Reset to default font size
    prn.addText("Date:    01-01-2022 12:33:13 pm\n");
    prn.addText("\n"); // Extra line space
    // Add the TAKEAWAY text with increased font size and center-aligned
    prn.addTextAlign(prn.ALIGN_CENTER);
    prn.addTextSize(2, 2); // Increase font size
    prn.addText("TAKE AWAY\n");
    prn.addTextSize(1, 1); // Reset to default font size
    prn.addText("\n"); // Extra line space
    prn.addTextAlign(prn.ALIGN_LEFT);
    prn.addText("-----------------------------\n"); // Separator
    // Make item names bold
    prn.addTextStyle(prn.TRUE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("1x Espresso      ");
    prn.addTextStyle(prn.FALSE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("Strong\n");
    prn.addTextStyle(prn.TRUE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("1x Cappuccino    ");
    prn.addTextStyle(prn.FALSE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("(Large) Hot\n");
    prn.addTextStyle(prn.TRUE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("1x Green Tea     ");
    prn.addTextStyle(prn.FALSE, prn.FALSE, prn.FALSE, prn.COLOR_1);
    prn.addText("Hot\n");
    prn.addText("-----------------------------\n"); // Separator
    prn.addTextAlign(prn.ALIGN_LEFT);
    prn.addText("\n"); // Extra line space
    prn.addText("Employee Name: test\n"); // Added employee name
    prn.addText("\n"); // Extra line space
    prn.addTextAlign(prn.ALIGN_CENTER);
    prn.addText("Note: ValidateMe\n");
    prn.addCut(prn.CUT_FEED);
    prn.send();
  };

  return (
    <div id="thermalPrinter">
      <input
        id="printerIPAddress"
        placeholder="Printer IP Address"
        value={printerIPAddress}
        onChange={(e) => setPrinterIPAddress(e.currentTarget.value)}
      />
      <input
        id="printerPort"
        placeholder="Printer Port"
        value={printerPort}
        onChange={(e) => setPrinterPort(e.currentTarget.value)}
      />
      <button
        disabled={connectionStatus === STATUS_CONNECTED}
        onClick={() => connect()}
      >
        Connect
      </button>
      <span className="status-label">{connectionStatus}</span>
      <hr />
      <textarea
        id="textToPrint"
        rows={3}
        placeholder="Text to print"
        value={textToPrint}
        onChange={(e) => setTextToPrint(e.currentTarget.value)}
      />
      <button
        disabled={connectionStatus !== STATUS_CONNECTED}
        onClick={() => print(textToPrint)}
      >
        Print
      </button>
    </div>
  );
};

export default ThermalPrinter;
