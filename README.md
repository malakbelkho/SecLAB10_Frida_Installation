<div align="center">

# 🧪 LAB 10 — Frida Installation & Android Instrumentation

### Sécurité des Applications Mobiles

![Frida](https://img.shields.io/badge/Frida-17.9.11-blueviolet?style=for-the-badge)
![Android](https://img.shields.io/badge/Android-Emulator-green?style=for-the-badge)
![ADB](https://img.shields.io/badge/ADB-Platform_Tools-blue?style=for-the-badge)
![PowerShell](https://img.shields.io/badge/Shell-PowerShell-5391FE?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

</div>

---

## 🎯 Objectif du laboratoire

Ce laboratoire consiste à mettre en place un environnement complet d’analyse dynamique Android avec **Frida**.

L’objectif principal est de :

- installer le client Frida sur Windows ;
- vérifier les outils Python, pip et Frida CLI ;
- configurer ADB pour communiquer avec un émulateur Android ;
- identifier l’architecture CPU de l’appareil cible ;
- déployer et lancer `frida-server` sur Android ;
- vérifier la connexion avec `frida-ps` ;
- injecter un script JavaScript minimal ;
- tester un hook natif sur une fonction réseau ;
- simuler une panne et documenter la correction.

---

## 🧠 Résumé rapide du lab

| Élément | Résultat |
|---|---|
| Client Frida installé | ✅ Oui |
| Version Frida | `17.9.11` |
| Appareil cible | Android Emulator |
| Device ID | `emulator-5554` |
| Architecture Android | `x86_64` |
| Frida Server utilisé | `frida-server-17.9.11-android-x86_64` |
| Application cible | `com.android.chrome` |
| Injection Java | ✅ Réussie |
| Hook natif `recv` | ✅ Réussi |
| Dépannage | ✅ Réalisé |

> L’application `ma.ens.app1` mentionnée dans l’énoncé n’était pas installée sur l’émulateur.  
> Les tests d’injection ont donc été effectués sur **Google Chrome**, via le package `com.android.chrome`.

---

## 📁 Arborescence du projet

```text
LAB10_Frida
├── screenshots
│   ├── adb_forwarding.png
│   ├── adb_root_shell-id.png
│   ├── adb_version_devices.png
│   ├── correction_depannage.png
│   ├── cpu_architecture.png
│   ├── erreur_frida.png
│   ├── frida-ps_U.png
│   ├── frida-ps_Uai.png
│   ├── frida-server_extracted.png
│   ├── frida-server_run.png
│   ├── frida-server_run_verification.png
│   ├── frida_install.png
│   ├── frida_server_push_chmod.png
│   ├── frida_versions.png
│   ├── hello-js_injection.png
│   ├── hello_native-js_injection.png
│   └── python_pip_version.png
│
└── scripts
    ├── hello.js
    └── hello_native.js
```

---

# 1. Préparation de l’environnement

## 1.1 Vérification de Python et pip

Avant d’installer Frida, j’ai vérifié la disponibilité de Python et pip sur Windows.

```powershell
python --version
pip --version
```

<p align="center">
  <img src="screenshots/python_pip_version.png" width="850">
</p>

---

## 1.2 Installation du client Frida

Le client Frida correspond aux outils utilisés côté ordinateur : la bibliothèque Python `frida` et les outils CLI `frida-tools`.

```powershell
python -m pip install --upgrade frida frida-tools
```

<p align="center">
  <img src="screenshots/frida_install.png" width="850">
</p>

---

## 1.3 Vérification des versions

Après l’installation, les versions ont été vérifiées avec les commandes suivantes :

```powershell
frida --version
frida-ps --version
python -c "import frida; print(frida.__version__)"
```

Résultat obtenu :

```text
17.9.11
```

<p align="center">
  <img src="screenshots/frida_versions.png" width="850">
</p>

---

# 2. Configuration Android avec ADB

## 2.1 Vérification d’ADB et de l’émulateur

ADB permet d’établir la communication entre le PC et l’émulateur Android.

```powershell
adb version
adb devices
```

L’émulateur a été détecté correctement :

```text
emulator-5554   device
```

<p align="center">
  <img src="screenshots/adb_version_devices.png" width="850">
</p>

---

## 2.2 Activation de l’accès root

L’accès root est nécessaire pour lancer correctement `frida-server` dans l’environnement de test.

```powershell
adb root
adb shell id
```

<p align="center">
  <img src="screenshots/adb_root_shell-id.png" width="850">
</p>

---

## 2.3 Identification de l’architecture CPU Android

Avant de télécharger `frida-server`, il faut identifier l’architecture CPU de l’émulateur.

```powershell
adb shell getprop ro.product.cpu.abi
```

Résultat obtenu :

```text
x86_64
```

La version compatible est donc :

```text
frida-server-17.9.11-android-x86_64.xz
```

<p align="center">
  <img src="screenshots/cpu_architecture.png" width="850">
</p>

---

# 3. Déploiement de `frida-server`

## 3.1 Extraction du binaire

Le fichier téléchargé était :

```text
frida-server-17.9.11-android-x86_64.xz
```

Après extraction, le binaire obtenu a été utilisé comme serveur Frida côté Android.

<p align="center">
  <img src="screenshots/frida-server_extracted.png">
</p>

---

## 3.2 Copie vers l’émulateur Android

Le binaire a été transféré vers le répertoire `/data/local/tmp`.

```powershell
adb push .\frida-server /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell ls -l /data/local/tmp/frida-server
```

Les permissions confirment que le fichier est exécutable :

```text
-rwxr-xr-x
```

<p align="center">
  <img src="screenshots/frida_server_push_chmod.png" width="850">
</p>

---

## 3.3 Lancement de `frida-server`

Le serveur Frida a été lancé sur l’émulateur Android.

```powershell
adb shell "/data/local/tmp/frida-server -l 0.0.0.0"
```

Une autre méthode permet de le lancer en arrière-plan :

```powershell
adb shell "nohup /data/local/tmp/frida-server -l 0.0.0.0 >/dev/null 2>&1 &"
```

<p align="center">
  <img src="screenshots/frida-server_run.png">
</p>

---

## 3.4 Vérification de l’exécution du serveur

```powershell
frida-ps -U
```

<p align="center">
  <img src="screenshots/frida-ps_U.png" width="850">
</p>

---

## 3.5 Redirection des ports Frida

Les ports Frida ont été redirigés avec ADB.

```powershell
adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043
```

<p align="center">
  <img src="screenshots/adb_forwarding.png" width="850">
</p>

---

# 4. Test de connexion Frida

La commande suivante permet de lister les applications Android depuis le PC.

```powershell
frida-ps -Uai
```

Plusieurs applications ont été listées, notamment :

| Application | État |
|---|---|
| Chrome | ✅ Visible |
| Camera | ✅ Visible |
| Settings | ✅ Visible |
| Messages | ✅ Visible |
| Photos | ✅ Visible |

<p align="center">
  <img src="screenshots/frida-ps_Uai.png" width="850">
</p>

Cette étape valide que le client Frida communique correctement avec `frida-server`.

---

# 5. Injection Java minimale

## 5.1 Script `hello.js`

Le premier script teste l’accès au runtime Java de l’application Android.

```javascript
Java.perform(function () {
  console.log("[+] Frida Java.perform OK");
});
```

Fichier créé :

```text
scripts/hello.js
```

---

## 5.2 Injection dans Chrome

Commande utilisée :

```powershell
frida -U -f com.android.chrome -l .\scripts\hello.js
```

Résultat attendu :

```text
[+] Frida Java.perform OK
```

<p align="center">
  <img src="screenshots/hello-js_injection.png" width="850">
</p>

Cette étape confirme que :

- Frida peut démarrer l’application cible ;
- le script JavaScript est chargé ;
- l’API Java de Frida fonctionne dans le processus Android.

---

# 6. Injection native avec hook sur `recv`

## 6.1 Script `hello_native.js`

Le second script intercepte la fonction native `recv`, utilisée lors de certaines opérations réseau.

```javascript
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
```

Fichier créé :

```text
scripts/hello_native.js
```

---

## 6.2 Injection dans Chrome

Commande utilisée :

```powershell
frida -U -f com.android.chrome -l .\scripts\hello_native.js
```

Résultat observé :

```text
[+] Script chargé
[+] recv trouvée à : 0x...
[+] recv appelée
```

<p align="center">
  <img src="screenshots/hello_native-js_injection.png" width="850">
</p>

Cette étape confirme que :

- le script natif est chargé ;
- la fonction `recv` est localisée ;
- l’intercepteur Frida fonctionne ;
- des appels réseau peuvent être observés dynamiquement.

---

# 7. Dépannage : erreur Frida / ADB

## 7.1 Simulation de l’erreur

Pour simuler une panne de communication, le serveur ADB a été arrêté.

```powershell
adb disconnect
adb kill-server
frida-ps -U
```

Résultat observé :

```text
Waiting for USB device to appear...
```

<p align="center">
  <img src="screenshots/erreur_frida.png" width="850">
</p>

Cette sortie indique que Frida ne peut plus détecter l’émulateur Android.

---

## 7.2 Diagnostic

Le diagnostic consiste à vérifier l’état de la connexion ADB.

```powershell
adb devices
```

Lorsque le serveur ADB est arrêté ou que l’appareil n’est pas visible, Frida ne peut plus communiquer correctement avec l’émulateur.

---

## 7.3 Correction

La correction a consisté à :

1. redémarrer ADB ;
2. vérifier la présence de l’émulateur ;
3. réactiver l’accès root ;
4. restaurer `frida-server` ;
5. relancer `frida-server` ;
6. rétablir les ports Frida ;
7. vérifier la connexion avec `frida-ps -Uai`.

```powershell
adb start-server
adb devices
adb root
adb wait-for-device
adb shell mv /data/local/tmp/frida-server_OFF /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell "nohup /data/local/tmp/frida-server -l 0.0.0.0 >/dev/null 2>&1 &"
adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043
frida-ps -Uai
```

<p align="center">
  <img src="screenshots/correction_depannage.png" width="850">
</p>

La liste des applications est réapparue, ce qui confirme que la communication Frida a été restaurée.

---

# 8. Bilan des livrables demandés

| Livrable demandé | Réalisé | Preuve |
|---|---:|---|
| `frida --version` | ✅ | `frida_versions.png` |
| `frida-ps --version` | ✅ | `frida_versions.png` |
| `python -c "import frida; print(frida.__version__)"` | ✅ | `frida_versions.png` |
| `adb devices` | ✅ | `adb_version_devices.png` |
| Architecture CPU Android | ✅ | `cpu_architecture.png` |
| Déploiement de `frida-server` | ✅ | `frida_server_push_chmod.png` |
| Lancement de `frida-server` | ✅ | `frida-server_run.png` |
| `frida-ps -Uai` avec au moins 3 apps | ✅ | `frida-ps_Uai.png` |
| Injection `hello.js` | ✅ | `hello-js_injection.png` |
| Hook natif `hello_native.js` | ✅ | `hello_native-js_injection.png` |
| Erreur simulée | ✅ | `erreur_frida.png` |
| Correction documentée | ✅ | `correction_depannage.png` |

---

# 9. Extensions avancées du lab

Certaines parties de l’énoncé proposent une exploration plus avancée de Frida.  
Elles permettent d’aller au-delà de l’installation et de l’injection minimale.

## 9.1 Exploration interactive Frida

Dans la console Frida, il est possible d’exécuter directement des commandes JavaScript :

```javascript
Process.arch
Process.platform
Process.id
Process.mainModule
Java.available
Process.getModuleByName("libc.so")
Process.getModuleByName("libc.so").getExportByName("recv")
Process.enumerateModules()
Process.enumerateThreads()
Process.enumerateRanges('r-x')
```

Ces commandes permettent d’identifier :

- l’architecture du processus ;
- le module principal ;
- les bibliothèques chargées ;
- les threads actifs ;
- les zones mémoire exécutables ;
- la disponibilité du runtime Java.

---

## 9.2 Observation des fonctions réseau sensibles

Des hooks plus avancés peuvent être utilisés pour observer les fonctions réseau natives :

```javascript
const connectPtr = Process.getModuleByName("libc.so").getExportByName("connect");
const sendPtr = Process.getModuleByName("libc.so").getExportByName("send");
const recvPtr = Process.getModuleByName("libc.so").getExportByName("recv");
```

Ces fonctions permettent d’observer :

- les connexions réseau ;
- les envois de données ;
- les réceptions de données.

---

## 9.3 Observation du stockage local

D’autres hooks peuvent cibler les fonctions natives liées aux fichiers :

```javascript
const openPtr = Process.getModuleByName("libc.so").getExportByName("open");
const readPtr = Process.getModuleByName("libc.so").getExportByName("read");
```

Cela permet de repérer certains accès à des fichiers internes, préférences locales ou ressources applicatives.

---

## 9.4 Exploration Java : SharedPreferences, SQLite et Debug

Frida peut aussi observer des composants Java sensibles :

```javascript
Java.available
```

Exemples de classes intéressantes :

```text
android.app.SharedPreferencesImpl
android.database.sqlite.SQLiteDatabase
android.os.Debug
java.lang.Runtime
java.io.File
```

Ces hooks permettent d’observer :

- les lectures et écritures dans `SharedPreferences` ;
- certaines requêtes SQLite ;
- les vérifications liées au débogage ;
- les commandes système lancées par l’application ;
- les chemins de fichiers manipulés côté Java.

> Ces extensions constituent une base pour des analyses dynamiques plus avancées : stockage local, communications réseau, chiffrement, debug detection et comportement runtime.

---

# 10. Bonnes pratiques et sécurité

Frida est un outil puissant d’instrumentation dynamique.  
Son utilisation doit rester strictement encadrée.

Bonnes pratiques :

- utiliser Frida uniquement sur ses propres applications ou dans un environnement autorisé ;
- garder les versions du client Frida et de `frida-server` alignées ;
- documenter toutes les commandes exécutées ;
- conserver les captures d’écran comme preuves ;
- ne pas analyser d’applications tierces sans autorisation ;
- travailler dans un environnement de test isolé.

---

# 11. Commandes principales utilisées

```powershell
python --version
pip --version

python -m pip install --upgrade frida frida-tools

frida --version
frida-ps --version
python -c "import frida; print(frida.__version__)"

adb version
adb devices
adb root
adb shell id

adb shell getprop ro.product.cpu.abi

adb push .\frida-server /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell ls -l /data/local/tmp/frida-server

adb shell "nohup /data/local/tmp/frida-server -l 0.0.0.0 >/dev/null 2>&1 &"

adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043

frida-ps -U
frida-ps -Uai

frida -U -f com.android.chrome -l .\scripts\hello.js
frida -U -f com.android.chrome -l .\scripts\hello_native.js

adb disconnect
adb kill-server
adb start-server
```

---

# 12. Nettoyage optionnel

Pour arrêter `frida-server` :

```powershell
adb shell pkill -f frida-server
```

Pour supprimer le binaire de l’émulateur :

```powershell
adb shell rm /data/local/tmp/frida-server
```

Pour désinstaller Frida côté PC :

```powershell
pip uninstall frida frida-tools
```

---

# 13. Conclusion

Ce laboratoire m’a permis de mettre en place un environnement complet d’analyse dynamique Android avec Frida.

Les étapes réalisées couvrent :

- l’installation du client Frida ;
- la configuration d’ADB ;
- l’identification de l’architecture Android ;
- le déploiement de `frida-server` ;
- la vérification de la communication Frida ;
- l’injection d’un script Java ;
- l’injection d’un hook natif ;
- la simulation et la correction d’une erreur de communication.

Le hook natif sur `recv` a confirmé que Frida peut intercepter dynamiquement des appels réseau dans un processus Android.  
Ce lab constitue donc une base solide avant de passer à des analyses plus avancées comme l’observation du stockage local, des bibliothèques cryptographiques, des fonctions réseau sensibles ou des vérifications anti-debug.

---

<div align="center">

## ✅ LAB 10 terminé avec succès

**Frida Client + ADB + Frida Server + Injection Java + Hook Natif + Dépannage**

</div>
