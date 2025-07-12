# MyRPGLife-Pr-f

Mon app gamifiée pour suivre ma productivité de manière ludique.

Cette version fournit une configuration **Electron** afin de transformer l'application web en application desktop.

## Lancer en mode développement

```bash
npm install
npm start
```

## Générer l'exécutable Windows

```bash
npm run dist
```

Cela produira un installeur `.exe` dans le dossier `dist/`.

## Structure des dossiers

```
MyRPGLife-Pr-f/
├── assets/             # ressources (icône ...)
│   └── icon.ico        # votre icône personnalisée
├── index.html          # votre application web existante
├── styles.css
├── script.js
├── main.js             # processus principal Electron
├── package.json
└── README.md
```

Placez votre icône personnalisée dans `assets/icon.ico` puis lancez `npm run dist` pour créer un installeur Windows avec cette icône.
