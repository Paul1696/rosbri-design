# Guide de Lancement et Serveur Local - ROSBRI DESIGN

Ce guide explique comment lancer le site **ROSBRI DESIGN** en environnement de développement local de manière optimale.

---

## ⚡ Pourquoi utiliser un serveur HTTP local plutôt que `file://` ?

Lors de l'ouverture directe d'un fichier `.html` en double-cliquant dessus (`file://`), les navigateurs web appliquent des restrictions de sécurité strictes (politique CORS). Cela peut bloquer le chargement dynamique des composants HTML partagés (`components/header.html`, `components/footer.html`, etc.) via `fetch()`.

*Note : Un mécanisme de secours (fallback) est intégré dans `js/components.js` pour permettre un affichage fluide même sous `file://`, mais l'utilisation d'un serveur HTTP local reste la méthode recommandée.*

---

## 🚀 Méthodes de Lancement Recommandées

### Option 1 : VS Code Live Server (Recommandé)

1. Ouvrez le dossier `ROSBRI DESIGN` dans **Visual Studio Code**.
2. Installez l'extension **Live Server** (par Ritwick Dey).
3. Faires un clic droit sur `index.html` puis sélectionnez **"Open with Live Server"**.
4. Le site s'ouvrira automatiquement sur `http://127.0.0.1:5500/index.html`.

---

### Option 2 : Python (Sans installation supplémentaire)

Si vous disposez de Python installé sur votre machine :

```bash
# Ouvrir le terminal dans le dossier du projet
python -m http.server 5500
```

Accédez ensuite à : `http://localhost:5500/index.html` dans votre navigateur.

---

### Option 3 : Node.js `npx serve`

Si vous utilisez Node.js :

```bash
npx serve . -p 5500
```

Accédez ensuite à : `http://localhost:5500/index.html`.

---

## 🔍 Vérification & Console de Développement

1. Ouvrez la console du navigateur (`F12` ou `Ctrl + Maj + I` -> onglet **Console**).
2. Vérifiez le message de confirmation :
   `ROSBRI DESIGN - Composants chargés avec succès.`
3. Le script de diagnostic automatisé `js/qa-check.js` analysera automatiquement la structure DOM et affichera tout avertissement éventuel.
