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

## Remarque importante
- **L'adresse IP de l'API doit être changée dans le fichier `api_constant.ts` selon votre configuration réseau locale.**
- Ce projet est réalisé dans le cadre d'un travail d'équipe et respecte les consignes de l'évaluation.

*Merci de consulter le code source pour plus de détails sur l'implémentation.* 