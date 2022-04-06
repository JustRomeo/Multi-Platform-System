# Actions.

**Actions.** est la plateforme créer pour le projet  {EPITECH.} - AREA. Un clone d'IFTTT. Le but de ce projet est de créer une plateforme dans laquelle on peut créer des modules d'Actions-Réaction.

Le projet est développé 6 étudiants d'{EPITECH.} :
- Alexandre PEREIRA
- Hugo POISOT
- Roméo TALOVICI
- Sitpi RAJENDRAN
- Thomas DALEM
- Tony MARINI


Il est composé de trois parties:
 1. BackEnd
 2. Application Web
 3. Application Mobile

Les différentes parties sont basé sur différentes technologie :`NodeJs` pour le serveur backend, `ReactJS` l'application FrontEnd, et `Flutter` pour l'application mobile.

# BackEnd - API
Pour utiliser notre API vous pouvez utiliser notre système grâce aux systèmes d'envoie POST et GET.

## User Routes - '/'

 **‘/register’ : permet de register un user**

    POST
    Body : id, email, password, username, token, refreshToken
    Return value : renvoie 200 avec le user et un bearer token si celui ci a bien été ajouté et login ou 400 avec le message d’erreur si il y a eu une erreur

  /

 **‘/login’ : permet de login un user**

    POST
    Body : email, password
    Return value : 201 avec le user et un bearer token si l’email et mot de passe sont valide et que le user existe, 400 sinon

 /

**‘/mobileRegistration : permet de register/login un user pour oauth mobile**
    POST
    BODY : id, email, displayName, token, refreshToken
    Return value: 201 avec le user et un bearer token si le user a bien été enregistré ou qu'il a bien été login

**‘/getUserInfo’ : permet de récupéré les info du user**

    GET
    Header: nécessite un bearer token
    Valeur de retour : renvoie le user
/

**‘/getServiceToken’: récupère tous les token de service du user**

    GET
    Header : nécessite un bearer token
    Valeur de retour : un tableau contenant dans chaque case le nom du service, le token et une data lié au token (un mail dans le cas de outlook et google par exemple)

/


**‘/removeServiceToken’ : retire un token de service du user**

    POST
    Header : nécessite un bearer token
    Body : le nom du service
    Valeur de retour : 200 avec comme contenu “success” en cas de réussite et 404 sinon

/

**‘/addServiceToken’ : ajoute un token de service au user**

    POST
    Header : nécessite un bearer token
    Body : un nom de service, un token d’accès, un token de refresh et un mail si besoins
    Valeur de retour : 200 avec “success” si l’ajout marche et 404 sinon

/

 **‘/addIntraToken’: ajoute un token de service ‘Intra’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token trouvable sur l’intranet (lien d’autologin) et un email (celui de l’utilisateur)
    Valeur de Retour : 200 avec “success” si l’ajout marche et que le token est valide, 401 si le token ou l’adresse est invalide ou que l’ajout ne marche pas

/

 **‘/addOutlookToken: ajoute un token de service ‘Outlook’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email et un refresh token
    Valeur de Retour : 200 avec “success” si l’ajout marche, 404 si l’ajout ne marche pas

/

**‘/addOutlookToken’ : ajoute un token de service ‘Outlook’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

/


**‘/addGoogleToken’ : ajoute token de service ‘Google’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

/


**‘/addSpotifyToken’ : ajoute token de service Spotify au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

  /

**‘/removeUserById’: retire un user par rapport à son ID**

    POST
    Header : nécessite un bearer token
    Body : l’id du user que l’on veut supprimer
    Valeur de retour : 200 si le user a bien été retiré, 404 sinon

  /

**‘/removeUserByEmail’: retire un user par rapport à son mail**

    POST
    Header : nécessite un bearer token
    Body : le mail du user que l’on veut supprimer
    Valeur de retour : 200 si le user a bien été retiré, 404 sinon

## Area Routes - **‘/area’**
**‘/addArea’ : ajoute une Area à un user**

    POST
    Header : nécessite un bearer token
    Body : Le nom de service d’Action, les paramètre de l’action (actionParameter), le nom du service de Reaction et les paramètre de la réaction (reactionParameter)
    Valeur de retour : 201 et un json de l’Area si l’ajout a marché, 400 sinon

/

**‘/removeArea’ : retire une Area à un user**

    POST
    Header : nécessite un bearer token
    Body : l’id de l’Area à retirer
    Valeur de retour : 200 avec un json “success” si l’Area a bien été retiré et 400 sinon

/

**‘/modifyArea’: modifie une Area d’un user**

    POST
    Header : nécessite un bearer token
    Body : L'ID de l'Area, le nom de service d’Action, les paramètre de l’action (actionParameter), le nom du service de Reaction et les paramètre de la réaction (reactionParameter)
    Valeur de retour : 200 et un json de l’Area si la modification a marché, 400 sinon

/

**‘/getArea’ : renvoie les détails d’une Area**

    GET
    Header : nécessite un bearer token
    Body : l’id de l’Area dont on veut les détails
    Valeur de retour : 200 avec les détails de l’area ou 400 sinon

/

**‘/getUserArea’: renvoie toute les Area d’un user**

    GET
    Header : nécessite un bearer token
    Valeur de retour : 200 avec les une liste avec les détails de toutes les area associé au user ou 400 sinon


## Oauth 2.0 - **‘/oauth’**

**‘/login/outlook’ :** Permet de se login avec outlook, retourne vers ‘localhost:3000’ quand l’authentification est finis et ajoute le user si il n’existait pas ou le login

**‘/login/google’ :** Permet de se login avec google, retourne vers ‘localhost:3000’ quand l’authentification est finis et ajoute le user si il n’existait pas ou le login

**‘/login/spotify’ :** Permet de se login avec spotify, retourne vers ‘localhost:3000’ quand l’authentification est finis et ajoute le user si il n’existait pas ou le login

**‘/getTempUser’ :** Permet de récupérer un user stocker temporairement suite à l’utilisation d’un login oauth (les 3 requêtes au dessus)

## Outlook route : ‘/outlook’

**‘/getUserEmailFolder’ :** renvoie tout les dossier de la boit email outlook du user (qui possède un service outlook)

    GET
    Header: nécessite un bearer token
    Valeur de retour: un tableau contenant le nom du dossier et son id

##   Google route : ‘/google’
**‘/getAllSubscription’ :** renvoie tous les abonnements d’un utilisateur (qui possède un service google)

    GET
    Header: nécessite un bearer token
    Valeur de retour : renvoie une liste avec le nom de la chaîne, son id et un lien vers sont thumbnails


# Web Application

Afin d'utiliser l'application WEB il vous faut créer un compte et être connecté.

## Créer un compte
Il y'a trois manière de créer un compte sur notre plateforme WEB :
 - Mail + Mot de Passe
	 -
	Arrivé sur la page d'accueil vous pouvez cliquer sur le bouton en haut à droite ***"S'Inscrire"*** 
	*ou* allez sur la page `/register`
	Il vous faudra :

		  - Un Nom d'utilisateur
		  - Un Email
		  - Un Mot de passe
- Crée un compte Google
	-
	Vous n'avez pas besoin de créer un compte, il va être automatiquement créé lors de la première connexion
- Crée un compte Outlook
	-
	Vous n'avez pas besoin de créer un compte, il va être automatiquement créé lors de la première connexion


## Se connecter

Pour la connexion, il faut être sur la page d'accueil, vous aurez trois façons de vous connecter :
- **Mail et Mot de Passe**

    Remplir les deux champs présents avec le mail et le mot de passe utilisé lors de l'inscription

- **Connexion avec Google**

    Cliquer sur le bouton "Se connecter avec Google", et accepter les conditions sur les pages de Google

- **Connexion avec Outlook**

    Cliquer sur le bouton "Se connecter avec Outlook", et accepter les conditions sur les pages de Outlook



## Créer un AREA

**Une fois connecté,** vous arrivez sur la page avec touts vos AREAs. Dans le menu à gauche, vous trouverez le menu dans laquelle se trouve le bouton `Créer une AREA`
> **Note:** Vous ne pouvez **pas accéder ** à la page si vous n'êtes pas connecté.

Vous choisissez votre Actions, parmi la liste proposé, celle-ci peut varier en fonction des services auquelles vous êtes abonnés *(cf : S'abonner aux Services)*

Ensuite, vous devez remplir les paramètres nécessaires

> **Note:** Certaines n'ont pas de paramètres 😉

Désormais, vous pouvez choisir votre réactions, que doit-il se passer lorsque votre actions est activé : vous choisissez la réaction que vous souhaites dans la liste proposé. Et remplissez les paramètres demandés.

## Modifier une AREA

Pour modifier une AREA, selectionnez l'icone "edit" représenté par un stylo sur l'area souhaité, puis modifiez la à votre guise.

> **Note:** La modification d'une AREA peut prendre du temps à être effective, jusqu'à environ 30min - 1H.

## Supprimer une AREA
Pour modifier une AREA, selectionnez l'icone "supprimer" représenté par une poubelle sur l'area souhaité, puis modifiez la à votre guise.

> **Note:** Supprimer une AREA est définitif, pour la récupérer vous devrez la recréer entièrement.

## S'abonner et se Désabonner des services
Pour s'abonner, et donc acceder aux AREAS d'un ou plusieurs services, rendez vous dans la page mes services.
Cliquez sur le service souhaité, si vous ne l'êtes pas déjà, connectez vous, vous aurez par la suite la possibilitée de créer des AREAS liés à ces services !!

> **Note:** Gardez à l'esprit que si vous vchoisissez de vous déconnecter d'un service dont vous utilisez les AREAS, celles-ci ne fonctionneront plus.

# Application Mobile


## Créer un compte
Si vous n'avez pas de compte créez en un ! Il vous faudra pour cela remplir seulement 3 champs. Votre Nom, Mail et votre mot de passe. Ne vous inquietez pas, il est impossible pour nous de voir votre mot de passe, il est crypté par l'application mobile, juste après votre validation.

> **Note:** Si vous n'avez pas de compte, mais que vous souhaitez vous connectez avec par exemple votre compte Google, ne créez PAS de compte, connectez vous directement avec votre compte Google.

![Alt text](Documentations/resources/register.png?raw=true "Register")

## Se connecter
Si vous avez créé un compte, connectez vous avec les champs textes. Si vous voulez vous connecter avec un autre compte comme Google, assurez vous que le bouton soit disponible en dessous du bouton Login. Si c'est le cas vous pourrez cliquez dessus, une invitation à vous connecter sur une page internet s'ouvrira, connectez vous.

![Alt text](Documentations/resources/signin.png?raw=true "Sign In")

> **Note:** Pour le moment seulement la connection avec Google est authorisé.

## Ajouter une AREA
Pour ajouter une AREA, cliquez sur le bouton en bas a droite représentant un '+'. Une page va alors s'ouvrir. Dans le champs "quand" selectionnez l'acttion qui lancera votre AREA, et dans la rubrique "alors" selectionnez ce qui devra se passer lorsque votre "quand" se produira.

![Alt text](Documentations/resources/creation.png?raw=true "Création")

## Modifier une AREA
Pour modifier une AREA, appuyez sur l'AREA souhaité. Modifiez la à votre guise, puis terminez.

> **Note:** Il peut y avoir un temps entre la modification d'une AREA et la modification effective.

## Supprimer une AREA
Sur l'AREA souhaité, cliquez sur l'icone "supprimer" représenté par une poubelle.

> **Note:** Supprimer une AREA est définitif, pour la récupérer vous devrez la recréer entièrement.

## S'abonner à un service
Pour s'abonner à un service, rendez vous dans l'onglet service, pui selectionnez, et connectez vous au service souhaité.

> **Note:** Il est possible qu'il y'ai un temps d'attente avant que vous ne puissiez utiliser les AREA de ce service.

![Alt text](Documentations/resources/messervices.png?raw=true "Mes Services")

