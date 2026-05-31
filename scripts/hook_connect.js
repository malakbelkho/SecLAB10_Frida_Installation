console.log("[+] Hook connect chargé");

let count = 0;
const maxLogs = 10;

function findExport(name) {
  try {
    return Process.getModuleByName("libc.so").getExportByName(name);
  } catch (e) {
    try {
      return Module.getGlobalExportByName(name);
    } catch (e2) {
      console.log("[-] Export introuvable : " + name);
      return null;
    }
  }
}

const connectPtr = findExport("connect");

if (connectPtr !== null) {
  console.log("[+] connect trouvée à : " + connectPtr);

  Interceptor.attach(connectPtr, {
    onEnter(args) {
      if (count < maxLogs) {
        count++;
        console.log("[+] connect appelée #" + count);
        console.log("    fd = " + args[0]);
        console.log("    sockaddr = " + args[1]);
      }
    },
    onLeave(retval) {
      if (count <= maxLogs) {
        console.log("    retour = " + retval.toInt32());
      }

      if (count === maxLogs) {
        console.log("[*] Limite atteinte : affichage réduit pour éviter le spam.");
        count++;
      }
    }
  });
}
