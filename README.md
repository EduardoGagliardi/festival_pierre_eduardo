# Festival App – Projet d'équipe

**Membres du groupe :**
- Eduardo Gagliardi
- Pierre Gervais

## Description
Ce projet est une application mobile réalisée dans le cadre d'une évaluation en groupe (2/3 élèves maximum). L'application permet de :
- Afficher une carte interactive (Leaflet) centrée sur la ville d'Albi, avec un marqueur.
- Filtrer les artistes d'une scène (champ de recherche et affichage dynamique).
- Afficher l'entrée "Comment venir ?" dans le menu, avec un contenu accordéon.

## Fonctionnalités principales
- **Affichage d'une carte** : Utilisation de l'extension `react-native-leaflet-view` pour afficher une carte interactive sur l'écran Plan, avec un marqueur sur Albi.
- **Filtrage des artistes d'une scène** : Ajout d'un champ de saisie pour filtrer dynamiquement les artistes par nom sur la scène sélectionnée.
- **Affichage de l'entrée "Comment venir ?"** : Présentation de l'entrée dans le menu, avec un contenu affiché sous forme d'accordéon (`react-native-collapsible`).

## Installation & Lancement
1. Cloner le dépôt
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Lancer l'application sur Android :
   ```sh
   npx expo run:android
   ```
   (Pour iOS, voir la documentation Expo/EAS Build et les prérequis MacOS)

## Prérequis techniques
- Node.js
- Expo CLI
- Android Studio (pour l'émulateur Android)
- (iOS : Mac + Xcode ou EAS Build)

## Remarques
- Le fichier `leaflet.html` doit être copié dans `android/app/src/main/assets/` pour le bon fonctionnement de la carte sur Android.
- Ce projet est réalisé dans le cadre d'un travail d'équipe et respecte les consignes de l'évaluation.

---

*Merci de consulter le code source pour plus de détails sur l'implémentation.* 