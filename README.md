# Sniper Post Prompt (SPP)

Une application moderne de création et d'export de prompts stylisés pour les réseaux sociaux et présentations.

## 🎯 Fonctionnalités

### Interface
- **Éditeur de texte** avec barre d'outils markdown (gras, italique, souligné, listes, titres)
- **Prévisualisation en temps réel** des modifications
- **Interface responsive** - desktop et mobile
- **Sauvegarde automatique** dans le localStorage

### Personnalisation
- **5 polices de caractères** : Monospace, Serif, Sans-serif, Cursive, Fantasy
- **3 arrière-plans dégradés** : Blue, Green, Pink
- **3 styles de carte** : Modern White, Dark Theme, Subtle Gradient
- **Tailles de police séparées** pour chaque format d'export (8 tailles disponibles)

### Export d'images
- **Format 16:9** (1920x1080) - Parfait pour présentations, YouTube thumbnails
- **Format 9:16** (1080x1920) - Optimisé pour Instagram Stories, TikTok, Snapchat
- **Formats de fichier** : PNG et JPEG
- **Export natif** sans déformation - logique spécifique par format
- **Haute qualité** avec texte parfaitement lisible

## 🚀 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd prompt-styler

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **shadcn/ui** - Composants UI modernes
- **html2canvas-pro** - Capture d'écran HTML vers canvas
- **Lucide React** - Icônes

## 📝 Utilisation

### 1. Création du contenu
1. Tapez votre texte dans la zone de saisie (gauche)
2. Utilisez la barre d'outils pour styliser :
   - **B** : Gras (**texte**)
   - **I** : Italique (*texte*)
   - **U** : Souligné (_texte_)
   - **Liste** : Puces (•)
   - **1.** : Liste numérotée
   - **H1/H2/H3** : Titres de différentes tailles

### 2. Personnalisation
- **Police** : Choisir le style de police
- **Arrière-plan** : Sélectionner le dégradé
- **Style de carte** : Modifier l'apparence de la carte
- **Tailles de police** : Ajuster séparément pour 16:9 et 9:16

### 3. Export
1. Choisir le **format** (16:9 ou 9:16)
2. Sélectionner le **type de fichier** (PNG ou JPEG)
3. Cliquer sur **"Exporter en [FORMAT]"**

## 🎨 Formats d'export optimisés

### Format 16:9 (1920x1080)
- **Usage** : Présentations, YouTube, écrans larges
- **Card** : 75% de largeur
- **Texte** : 36px, espacement horizontal optimisé
- **Idéal pour** : Contenu professionnel, tutorials

### Format 9:16 (1080x1920)
- **Usage** : Stories, TikTok, contenu mobile
- **Card** : 95% de largeur
- **Texte** : 44px, espacement vertical optimisé
- **Idéal pour** : Réseaux sociaux, mobile-first

## 🔧 Architecture technique

### Composants principaux
- `PromptStyler.tsx` - Composant principal de l'application
- Export natif avec logique séparée par format
- Sauvegarde automatique des préférences utilisateur

### Export d'images
```typescript
// Logique séparée pour chaque format
if (format === '9:16') {
  await exportToImage9_16(config);
} else {
  await exportToImage16_9(config);
}
```

## 📱 Responsive Design

- **Desktop** : Layout horizontal (gauche/droite)
- **Mobile** : Layout vertical (haut/bas)
- **Tablette** : Grille adaptative des paramètres
- **Hauteurs garanties** : Pas de contenu masqué

## 🎯 Cas d'usage

### Professionnels
- Création de quotes pour présentations
- Templates pour formations
- Contenu éducatif stylisé

### Réseaux sociaux
- Stories Instagram optimisées
- Posts TikTok accrocheurs
- Citations LinkedIn professionnelles

### Marketing
- Visuels promotionnels
- Messages de marque
- Contenu viral

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
# Déployer sur Vercel
```

### Autre plateforme
```bash
npm run build
npm start
```

## 📄 License

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Reporter des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Soumettre des pull requests

---

**Créé avec ❤️ pour simplifier la création de contenu visuel stylisé**
