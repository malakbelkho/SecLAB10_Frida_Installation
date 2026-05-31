console.log("[+] Hooks réseau chargés");

let sendCount = 0;
let recvCount = 0;
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

const sendPtr = findExport("send");
const recvPtr = findExport("recv");

if (sendPtr !== null) {
  console.log("[+] send trouvée à : " + sendPtr);

  Interceptor.attach(sendPtr, {
    onEnter(args) {
      if (sendCount < maxLogs) {
        sendCount++;
        console.log("[+] send appelée #" + sendCount);
        console.log("    fd = " + args[0]);
        console.log("    len = " + args[2].toInt32());
      }
    }
  });
}

if (recvPtr !== null) {
  console.log("[+] recv trouvée à : " + recvPtr);

  Interceptor.attach(recvPtr, {
    onEnter(args) {
      if (recvCount < maxLogs) {
        recvCount++;
        console.log("[+] recv appelée #" + recvCount);
        console.log("    fd = " + args[0]);
        console.log("    len demandé = " + args[2].toInt32());
      }
    },
    onLeave(retval) {
      if (recvCount <= maxLogs) {
        console.log("    recv retourne = " + retval.toInt32());
      }

      if (recvCount === maxLogs) {
        console.log("[*] Limite atteinte : affichage réduit pour éviter le spam.");
        recvCount++;
      }
    }
  });
}
