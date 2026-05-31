Java.perform(function () {
  console.log("[+] Hook lecture SharedPreferences chargé");

  try {
    var Impl = Java.use("android.app.SharedPreferencesImpl");

    var getString = Impl.getString.overload("java.lang.String", "java.lang.String");
    getString.implementation = function (key, defValue) {
      var result = getString.call(this, key, defValue);
      console.log("[SharedPreferences][getString] key=" + key + " => " + result);
      return result;
    };

    var getBoolean = Impl.getBoolean.overload("java.lang.String", "boolean");
    getBoolean.implementation = function (key, defValue) {
      var result = getBoolean.call(this, key, defValue);
      console.log("[SharedPreferences][getBoolean] key=" + key + " => " + result);
      return result;
    };

    console.log("[+] Lectures SharedPreferences surveillées");
  } catch (e) {
    console.log("[-] Hook lecture SharedPreferences impossible : " + e);
  }
});
