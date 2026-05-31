Java.perform(function () {
  console.log("[+] Hook SQLite chargé");

  let count = 0;
  const maxLogs = 15;

  try {
    var SQLiteDatabase = Java.use("android.database.sqlite.SQLiteDatabase");

    var execSQL1 = SQLiteDatabase.execSQL.overload("java.lang.String");
    execSQL1.implementation = function (sql) {
      if (count < maxLogs) {
        count++;
        console.log("[SQLite][execSQL] " + sql);
      }
      return execSQL1.call(this, sql);
    };

    var execSQL2 = SQLiteDatabase.execSQL.overload("java.lang.String", "[Ljava.lang.Object;");
    execSQL2.implementation = function (sql, bindArgs) {
      if (count < maxLogs) {
        count++;
        console.log("[SQLite][execSQL args] " + sql);
      }
      return execSQL2.call(this, sql, bindArgs);
    };

    var rawQuery = SQLiteDatabase.rawQuery.overload("java.lang.String", "[Ljava.lang.String;");
    rawQuery.implementation = function (sql, args) {
      if (count < maxLogs) {
        count++;
        console.log("[SQLite][rawQuery] " + sql);
      }
      return rawQuery.call(this, sql, args);
    };

    console.log("[+] Méthodes SQLite surveillées");
  } catch (e) {
    console.log("[-] Hook SQLite impossible : " + e);
  }
});
