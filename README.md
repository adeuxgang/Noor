# NOOR — application islamique (prototype PWA)

## Lancer
- Décompressez le dossier.
- Hébergez son contenu sur un hébergeur HTTPS statique (GitHub Pages, Cloudflare Pages ou Netlify).
- Ouvrez l'adresse sur iPhone/Android et choisissez « Ajouter à l'écran d'accueil ».

## Fonctions présentes
- Horaires de prière calculés selon la position (API AlAdhan, méthode 3).
- Compte à rebours avant la prochaine prière.
- Lecture du Coran arabe par sourate (API AlQuran Cloud).
- Calcul de la direction de la Qibla.
- Tasbih numérique.
- Date hégirienne locale.
- Mode concentration interne à NOOR.

## Limites à connaître
Cette version est un prototype web/PWA. Elle ne peut pas verrouiller les autres applications du téléphone ni imposer un écran de blocage système.
- Android : il faut une application native (Kotlin) et des permissions/services adaptés; l'accès à l'usage des applications et les mécanismes de contrôle sont soumis aux règles Android et Google Play.
- iOS : le blocage réel passe par les API Screen Time d'Apple (FamilyControls, ManagedSettings, DeviceActivity), avec les autorisations et entitlements Apple requis.
Les horaires d'iqama et l'annuaire de mosquées nécessitent une source de données fiable et des partenariats/accords éventuels. Toujours vérifier les horaires auprès de la mosquée locale.

## Coûts de publication
Le site/PWA peut être hébergé gratuitement selon les quotas de l'hébergeur. La publication sur les stores n'est pas gratuite : Google Play facture des frais d'inscription et Apple Developer Program un abonnement annuel. Les règles et tarifs peuvent évoluer.


## Nouveautés de la version 2
- Profil facultatif : prénom, tranche d'âge, habitudes de prière, prière la plus difficile, objectif.
- Programme quotidien personnalisé avec cases à cocher.
- Sélection des catégories d'applications à mettre en pause.
- Les réponses et préférences sont stockées localement dans le navigateur de l'appareil.
- Les heures de prière restent calculées selon la géolocalisation et la méthode de calcul choisie; vérifie le réglage de méthode avec ta mosquée locale.

## Blocage réel des applications
Les catégories choisies sont actuellement enregistrées comme préférences, mais le navigateur ne peut pas identifier ni suspendre les applications installées. Une prochaine version native devra demander les autorisations dans les réglages système, expliquer précisément leur usage et laisser l'utilisateur choisir les applications via les sélecteurs officiels. Sur iOS, cela passe par les API Screen Time et les autorisations/entitlements Apple; sur Android, par des mécanismes natifs soumis aux règles Google Play. Ne jamais demander le mot de passe du téléphone ni contourner les protections du système.
