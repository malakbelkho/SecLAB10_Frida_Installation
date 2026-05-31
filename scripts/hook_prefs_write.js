Java.perform(function () {
  console.log("[+] Hook écriture SharedPreferences chargé");

  try {
    var EditorImpl = Java.use("android.app.SharedPreferencesImpl$EditorImpl");

    var putString = EditorImpl.putString.overload("java.lang.String", "java.lang.String");
    putString.implementation = function (key, value) {
      console.log("[SharedPreferences][putString] key=" + key + " value=" + value);
      return putString.call(this, key, value);
    };

    var putBoolean = EditorImpl.putBoolean.overload("java.lang.String", "boolean");
    putBoolean.implementation = function (key, value) {
      console.log("[SharedPreferences][putBoolean] key=" + key + " value=" + value);
      return putBoolean.call(this, key, value);
    };

    console.log("[+] Écritures SharedPreferences surveillées");
  } catch (e) {
    console.log("[-] Hook écriture SharedPreferences impossible : " + e);
  }
});
