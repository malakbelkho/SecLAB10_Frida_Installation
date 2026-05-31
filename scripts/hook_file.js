console.log("[+] Hook fichiers chargé");

let openCount = 0;
let openAtCount = 0;
let readCount = 0;
const maxLogs = 12;

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

const openPtr = findExport("open");
const openAtPtr = findExport("openat");
const readPtr = findExport("read");

if (openPtr !== null) {
  console.log("[+] open trouvée à : " + openPtr);

  Interceptor.attach(openPtr, {
    onEnter(args) {
      if (openCount < maxLogs) {
        openCount++;
        try {
          console.log("[+] open appelée #" + openCount + " : " + args[0].readUtf8String());
        } catch (e) {
          console.log("[+] open appelée #" + openCount + " : chemin non lisible");
        }
      }
    }
  });
}

if (openAtPtr !== null) {
  console.log("[+] openat trouvée à : " + openAtPtr);

  Interceptor.attach(openAtPtr, {
    onEnter(args) {
      if (openAtCount < maxLogs) {
        openAtCount++;
        try {
          console.log("[+] openat appelée #" + openAtCount + " : " + args[1].readUtf8String());
        } catch (e) {
          console.log("[+] openat appelée #" + openAtCount + " : chemin non lisible");
        }
      }
    }
  });
}

if (readPtr !== null) {
  console.log("[+] read trouvée à : " + readPtr);

  Interceptor.attach(readPtr, {
    onEnter(args) {
      if (readCount < maxLogs) {
        readCount++;
        console.log("[+] read appelée #" + readCount);
        console.log("    fd = " + args[0]);
        console.log("    taille = " + args[2].toInt32());
      }
    }
  });
}
