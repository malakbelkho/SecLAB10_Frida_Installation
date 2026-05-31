Java.perform(function () {
  console.log("[+] Hook File Java chargé");

  let count = 0;
  const maxLogs = 20;

  try {
    var File = Java.use("java.io.File");

    var initString = File.$init.overload("java.lang.String");
    initString.implementation = function (path) {
      if (count < maxLogs) {
        count++;
        console.log("[File] nouveau chemin #" + count + " : " + path);
      }
      return initString.call(this, path);
    };

    console.log("[+] Constructeur java.io.File surveillé");
  } catch (e) {
    console.log("[-] Hook File Java impossible : " + e);
  }
});
