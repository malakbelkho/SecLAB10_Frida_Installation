console.log("[+] Script chargé");

function getExport(name) {
  if (Module.getGlobalExportByName) {
    return Module.getGlobalExportByName(name);
  }
  return Module.getExportByName(null, name);
}

const recvPtr = getExport("recv");
console.log("[+] recv trouvée à : " + recvPtr);

Interceptor.attach(recvPtr, {
  onEnter(args) {
    console.log("[+] recv appelée");
  }
});