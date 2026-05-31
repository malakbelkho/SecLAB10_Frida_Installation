Java.perform(function () {
  console.log("[+] Hook Runtime.exec chargé");

  let count = 0;
  const maxLogs = 15;

  try {
    var Runtime = Java.use("java.lang.Runtime");

    var execString = Runtime.exec.overload("java.lang.String");
    execString.implementation = function (cmd) {
      if (count < maxLogs) {
        count++;
        console.log("[Runtime.exec String] " + cmd);
      }
      return execString.call(this, cmd);
    };

    var execArray = Runtime.exec.overload("[Ljava.lang.String;");
    execArray.implementation = function (cmdArray) {
      if (count < maxLogs) {
        count++;
        console.log("[Runtime.exec String[]] " + cmdArray);
      }
      return execArray.call(this, cmdArray);
    };

    console.log("[+] Méthodes Runtime.exec surveillées");
  } catch (e) {
    console.log("[-] Hook Runtime.exec impossible : " + e);
  }
});
