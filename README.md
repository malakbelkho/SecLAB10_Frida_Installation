# 🧪 LAB 10 — Guide d'installation de Frida

> **Cours : Sécurité des applications mobiles**  
> **Objectif principal :** installer Frida, déployer `frida-server` sur Android, tester la connexion et valider l’injection de scripts JavaScript dans une application Android.

---

## 📌 Objectifs du lab

Ce laboratoire a pour but de :

- Installer Frida côté ordinateur avec Python et `frida-tools`.
- Installer et vérifier ADB pour communiquer avec l’émulateur Android.
- Identifier l’architecture CPU de l’appareil Android.
- Télécharger et déployer la version compatible de `frida-server`.
- Vérifier la connexion Frida avec l’émulateur.
- Injecter un script Java minimal dans une application Android.
- Injecter un script natif pour intercepter une fonction réseau.
- Simuler une erreur de communication et documenter la correction.

---

## 🧰 Environnement utilisé

| Élément | Détail |
|---|---|
| Système hôte | Windows |
| Terminal | PowerShell |
| Appareil cible | Android Emulator |
| Identifiant appareil | `emulator-5554` |
| Architecture Android | `x86_64` |
| Version Frida | `17.9.11` |
| Application cible | `com.android.chrome` |

> L’application `ma.ens.app1` utilisée dans l’énoncé n’était pas installée sur l’émulateur.  
> Les tests d’injection ont donc été réalisés sur **Chrome**, identifié par le package `com.android.chrome`.

---

## 📁 Structure du projet

```text
LAB10_Frida
├───screenshots
│       adb_forwarding.png
│       adb_root_shell-id.png
│       adb_version_devices.png
│       correction_depannage.png
│       cpu_architecture.png
│       erreur_frida.png
│       frida-ps_U.png
│       frida-ps_Uai.png
│       frida-server_extracted.png
│       frida-server_run.png
│       frida-server_run_verification.png
│       frida_install.png
│       frida_server_push_chmod.png
│       frida_versions.png
│       hello-js_injection.png
│       hello_native-js_injection.png
│       python_pip_version.png
│
└───scripts
        hello.js
        hello_native.js
```
# 🧪 LAB 10 — Guide d’installation de Frida

> **Cours :** Sécurité des applications mobiles  
> **Objectif principal :** installer Frida, déployer `frida-server` sur Android, tester la connexion et valider l’injection de scripts JavaScript dans une application Android.

---

## 📌 Objectifs du lab

Ce laboratoire a pour but de :

- Installer Frida côté ordinateur avec Python et `frida-tools`.
- Installer et vérifier ADB pour communiquer avec l’émulateur Android.
- Identifier l’architecture CPU de l’appareil Android.
- Télécharger et déployer la version compatible de `frida-server`.
- Vérifier la connexion Frida avec l’émulateur.
- Injecter un script Java minimal dans une application Android.
- Injecter un script natif pour intercepter une fonction réseau.
- Simuler une erreur de communication et documenter la correction.

---

## 🧰 Environnement utilisé

| Élément | Détail |
|---|---|
| Système hôte | Windows |
| Terminal | PowerShell |
| Appareil cible | Android Emulator |
| Identifiant appareil | `emulator-5554` |
| Architecture Android | `x86_64` |
| Version Frida | `17.9.11` |
| Application cible | `com.android.chrome` |

> L’application `ma.ens.app1` utilisée dans l’énoncé n’était pas installée sur l’émulateur.  
> Les tests d’injection ont donc été réalisés sur **Chrome**, identifié par le package `com.android.chrome`.

---

## 📁 Structure du projet

```text
LAB10_Frida
├───screenshots
│       adb_forwarding.png
│       adb_root_shell-id.png
│       adb_version_devices.png
│       correction_depannage.png
│       cpu_architecture.png
│       erreur_frida.png
│       frida-ps_U.png
│       frida-ps_Uai.png
│       frida-server_extracted.png
│       frida-server_run.png
│       frida-server_run_verification.png
│       frida_install.png
│       frida_server_push_chmod.png
│       frida_versions.png
│       hello-js_injection.png
│       hello_native-js_injection.png
│       python_pip_version.png
│
└───scripts
        hello.js
        hello_native.js
```

---

## 1. Vérification de Python et pip

Avant d’installer Frida, j’ai vérifié que Python et pip étaient bien disponibles sur Windows.

```powershell
python --version
pip --version
```

📸 **Preuve :**

![Python et pip](screenshots/python_pip_version.png)

---

## 2. Installation de Frida

Frida a été installé côté PC avec `pip`.

```powershell
python -m pip install --upgrade frida frida-tools
```

📸 **Preuve :**

![Installation Frida](screenshots/frida_install.png)

---

## 3. Vérification des versions Frida

Après l’installation, j’ai vérifié les versions du client Frida, de `frida-ps` et de la bibliothèque Python.

```powershell
frida --version
frida-ps --version
python -c "import frida; print(frida.__version__)"
```

Résultat obtenu :

```text
17.9.11
```

📸 **Preuve :**

![Versions Frida](screenshots/frida_versions.png)

---

## 4. Vérification d’ADB et de l’émulateur

ADB permet de communiquer avec l’appareil Android ou l’émulateur.

```powershell
adb version
adb devices
```

L’émulateur a bien été détecté :

```text
emulator-5554   device
```

📸 **Preuve :**

![ADB devices](screenshots/adb_version_devices.png)

---

## 5. Accès root sur l’émulateur

Pour exécuter `frida-server` correctement, l’accès root a été activé sur l’émulateur.

```powershell
adb root
adb shell id
```

📸 **Preuve :**

![ADB root](screenshots/adb_root_shell-id.png)

---

## 6. Identification de l’architecture Android

Avant de télécharger `frida-server`, il faut connaître l’architecture CPU de l’appareil.

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

📸 **Preuve :**

![Architecture CPU](screenshots/cpu_architecture.png)

---

## 7. Téléchargement et extraction de `frida-server`

Le fichier téléchargé était :

```text
frida-server-17.9.11-android-x86_64.xz
```

Après extraction, le binaire obtenu a été utilisé comme serveur Frida côté Android.

📸 **Preuve :**

![Extraction frida-server](screenshots/frida-server_extracted.png)

---

## 8. Déploiement de `frida-server` sur Android

Le binaire a été copié dans `/data/local/tmp`, puis rendu exécutable.

```powershell
adb push .\frida-server /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell ls -l /data/local/tmp/frida-server
```

Les permissions obtenues montrent que le fichier est exécutable :

```text
-rwxr-xr-x
```

📸 **Preuve :**

![Push chmod frida-server](screenshots/frida_server_push_chmod.png)

---

## 9. Lancement de `frida-server`

Le serveur Frida a été lancé sur l’émulateur Android.

```powershell
adb shell "/data/local/tmp/frida-server -l 0.0.0.0"
```

Une autre méthode utilisée pour le lancer en arrière-plan :

```powershell
adb shell "nohup /data/local/tmp/frida-server -l 0.0.0.0 >/dev/null 2>&1 &"
```

📸 **Preuve :**

![Lancement frida-server](screenshots/frida-server_run.png)

---

## 10. Vérification de l’exécution de `frida-server`

Pour vérifier que Frida fonctionne bien, j’ai listé les processus Android depuis le PC.

```powershell
frida-ps -U
```

📸 **Preuve :**

![frida-ps -U](screenshots/frida-ps_U.png)

---

## 11. Redirection des ports ADB

Les ports utilisés par Frida ont été redirigés avec ADB.

```powershell
adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043
```

📸 **Preuve :**

![ADB forwarding](screenshots/adb_forwarding.png)

---

## 12. Liste des applications Android avec Frida

La commande suivante permet de lister les applications installées sur l’émulateur.

```powershell
frida-ps -Uai
```

La sortie affichait plusieurs applications, dont :

- Chrome
- Camera
- Settings
- Messages
- Photos

📸 **Preuve :**

![frida-ps -Uai](screenshots/frida-ps_Uai.png)

---

## 13. Injection Java minimale

### 13.1 Création du script `hello.js`

Le script suivant permet de vérifier que Frida peut exécuter du code JavaScript dans le runtime Java de l’application Android.

```javascript
Java.perform(function () {
  console.log("[+] Frida Java.perform OK");
});
```

Fichier créé :

```text
scripts/hello.js
```

### 13.2 Injection dans Chrome

Commande utilisée :

```powershell
frida -U -f com.android.chrome -l .\scripts\hello.js
```

Résultat attendu :

```text
[+] Frida Java.perform OK
```

📸 **Preuve :**

![Injection hello.js](screenshots/hello-js_injection.png)

---

## 14. Injection native avec hook sur `recv`

### 14.1 Création du script `hello_native.js`

Le script suivant intercepte la fonction native `recv`, utilisée lors de certaines réceptions réseau.

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

### 14.2 Injection dans Chrome

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

Ce résultat confirme que :

- Frida a bien lancé l’application cible.
- Le script natif a été chargé.
- La fonction `recv` a été localisée.
- Le hook a intercepté des appels réseau.

📸 **Preuve :**

![Injection hello_native.js](screenshots/hello_native-js_injection.png)

---

## 15. Dépannage : simulation d’une erreur Frida / ADB

### 15.1 Simulation de l’erreur

Pour simuler une panne de communication entre Frida et l’émulateur, le serveur ADB a été arrêté.

```powershell
adb disconnect
adb kill-server
frida-ps -U
```

Résultat observé :

```text
Waiting for USB device to appear...
```

Cette sortie montre que Frida ne parvient plus à détecter l’appareil Android.

📸 **Preuve :**

![Erreur Frida](screenshots/erreur_frida.png)

---

### 15.2 Diagnostic

Le problème vient de l’interruption de la communication ADB.  
Sans ADB fonctionnel, Frida ne peut plus établir correctement la connexion avec l’émulateur Android.

Commande de diagnostic :

```powershell
adb devices
```

---

### 15.3 Correction

La correction a consisté à redémarrer ADB, vérifier l’appareil, rétablir l’accès root, relancer `frida-server`, puis restaurer les redirections de ports.

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

La commande finale `frida-ps -Uai` a confirmé que Frida fonctionnait de nouveau.

📸 **Preuve :**

![Correction dépannage](screenshots/correction_depannage.png)

---

## 16. Résultat final

À la fin du lab :

- Frida est installé sur Windows.
- Les outils CLI Frida fonctionnent.
- ADB détecte correctement l’émulateur Android.
- L’architecture Android a été identifiée comme `x86_64`.
- Le bon `frida-server` a été téléchargé et déployé.
- La connexion Frida avec l’émulateur est fonctionnelle.
- Un script Java a été injecté avec succès.
- Un hook natif sur `recv` a été testé avec succès.
- Une erreur de communication a été simulée, diagnostiquée et corrigée.

---

## 17. Commandes principales utilisées

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
```

---

## 18. Bonnes pratiques de sécurité

Frida est un outil puissant d’instrumentation dynamique.  
Il doit être utilisé uniquement dans un cadre autorisé :

- sur ses propres applications ;
- sur des applications de laboratoire ;
- sur des environnements de test ;
- avec l’autorisation explicite du propriétaire de l’application ou du système.

Dans ce lab, tous les tests ont été réalisés dans un environnement contrôlé sur un émulateur Android.

---

## 19. Conclusion

Ce laboratoire m’a permis de mettre en place un environnement Frida complet pour l’analyse dynamique Android.

J’ai installé les outils côté PC, déployé `frida-server` sur l’émulateur, validé la communication avec `frida-ps`, puis réalisé deux injections :

- une injection au niveau Java avec `Java.perform` ;
- une injection au niveau natif avec un hook sur la fonction `recv`.

La partie dépannage a également permis de comprendre l’importance d’ADB et des redirections de ports dans la communication entre Frida et l’appareil Android.
