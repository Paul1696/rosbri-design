# Guide de Lancement sous Serveur Local - ROSBRI DESIGN

Ce guide explique comment lancer et tester le site **ROSBRI DESIGN** dans un environnement web local professionnel pour éviter les blocages de sécurité liés au protocole direct `file://`.

---

## Pourquoi utiliser un serveur local ?

Le site utilise des requêtes d'injection de composants et des modules JavaScript. Si vous double-cliquez directement sur un fichier `.html` depuis votre navigateur, le protocole `file://` s'affiche et les navigateurs bloquent certaines fonctionnalités (`CORS`, `fetch`).

---

## 🚀 Méthode 1 : Avec l'extension Live Server dans VS Code (Recommandé)

1. **Ouvrir VS Code** :
   - Lancez VS Code et choisissez **File > Open Folder...**.
   - Sélectionnez le dossier racine du projet `ROSBRI DESIGN`.

2. **Installer l'extension Live Server** :
   - Ouvrez l'onglet Extensions (`Ctrl + Shift + X`).
   - Recherchez **Live Server** (par Ritwick Dey).
   - Cliquez sur **Install**.

3. **Lancer le site** :
   - Faites un clic droit sur le fichier [`index.html`](file:///e:/APPS/ROSBRI%20DESIGN/index.html).
   - Sélectionnez **Open with Live Server** (ou raccourci `Alt + L, Alt + O`).

4. **URL Obtenue** :
   Le navigateur s'ouvre automatiquement sur :
   ```
   http://127.0.0.1:5500/index.html
   ```

---

## 🐍 Méthode 2 : Avec Python (Terminal / Invite de commande)

Si vous avez Python installé sur votre ordinateur :

1. Ouvrez l'invite de commande (CMD ou Terminal) dans le dossier du projet.
2. Saisissez la commande suivante :
   ```bash
   python -m http.server 8080
   ```
3. Ouvrez votre navigateur et accédez à :
   ```
   http://127.0.0.1:8080/index.html
   ```

---

## 📦 Méthode 3 : Avec Node.js (`npx serve`)

Si vous utilisez Node.js :

1. Ouvrez votre terminal dans le dossier du projet.
2. Lancez :
   ```bash
   npx serve -p 8080
   ```
3. Accédez à :
   ```
   http://localhost:8080/index.html
   ```

---

## ✅ Points de Contrôle sous Serveur Local
- Le header, la barre d'annonce, le menu mobile, le panier et le footer se chargent instantanément.
- La recherche redirige vers `boutique.html?recherche=...` sans erreur.
- La fiche produit s'ouvre sur `produit.html?slug=...` au clic sur n'importe quel article.
