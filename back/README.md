# BackEnd - API
Pour utiliser notre API vous pouvez utiliser notre système grâce aux systèmes d'envoie POST et GET.

## User Routes - '/'

 **‘/register’ : permet de register un user**

    POST
    Body : id, email, password, username, token, refreshToken
    Return value : renvoie 200 avec le user et un bearer token si celui ci a bien été ajouté et login ou 400 avec le message d’erreur si il y a eu une erreur

<br>

 **‘/login’ : permet de login un user**

    POST
    Body : email, password
    Return value : 201 avec le user et un bearer token si l’email et mot de passe sont valide et que le user existe, 400 sinon

 <br>

**‘/mobileRegistration : permet de register/login un user pour oauth mobile**
    POST
    BODY : id, email, displayName, token, refreshToken
    Return value: 201 avec le user et un bearer token si le user a bien été enregistré ou qu'il a bien été login

**‘/getUserInfo’ : permet de récupéré les info du user**

    GET
    Header: nécessite un bearer token
    Valeur de retour : renvoie le user
<br>

**‘/getServiceToken’: récupère tous les token de service du user**

    GET
    Header : nécessite un bearer token
    Valeur de retour : un tableau contenant dans chaque case le nom du service, le token et une data lié au token (un mail dans le cas de outlook et google par exemple)

<br>


**‘/removeServiceToken’ : retire un token de service du user**

    POST
    Header : nécessite un bearer token
    Body : le nom du service
    Valeur de retour : 200 avec comme contenu “success” en cas de réussite et 404 sinon

<br>

**‘/addServiceToken’ : ajoute un token de service au user**

    POST
    Header : nécessite un bearer token
    Body : un nom de service, un token d’accès, un token de refresh et un mail si besoins
    Valeur de retour : 200 avec “success” si l’ajout marche et 404 sinon

<br>

 **‘/addIntraToken’: ajoute un token de service ‘Intra’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token trouvable sur l’intranet (lien d’autologin) et un email (celui de l’utilisateur)
    Valeur de Retour : 200 avec “success” si l’ajout marche et que le token est valide, 401 si le token ou l’adresse est invalide ou que l’ajout ne marche pas

<br>

 **‘/addOutlookToken: ajoute un token de service ‘Outlook’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email et un refresh token
    Valeur de Retour : 200 avec “success” si l’ajout marche, 404 si l’ajout ne marche pas

<br>

**‘/addOutlookToken’ : ajoute un token de service ‘Outlook’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

<br>


**‘/addGoogleToken’ : ajoute token de service ‘Google’ au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

<br>


**‘/addSpotifyToken’ : ajoute token de service Spotify au user**

    POST
    Header : nécessite un bearer token
    Body : un token, un email
    Valeur de Retour : 200 avec “success” si l’ajout marche 401 sinon

<br>

**‘/removeUserById’: retire un user par rapport à son ID**

    POST
    Header : nécessite un bearer token
    Body : l’id du user que l’on veut supprimer
    Valeur de retour : 200 si le user a bien été retiré, 404 sinon

 <br>

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

<br>

**‘/removeArea’ : retire une Area à un user**

    POST
    Header : nécessite un bearer token
    Body : l’id de l’Area à retirer
    Valeur de retour : 200 avec un json “success” si l’Area a bien été retiré et 400 sinon

<br>

**‘/modifyArea’: modifie une Area d’un user**

    POST
    Header : nécessite un bearer token
    Body : L'ID de l'Area, le nom de service d’Action, les paramètre de l’action (actionParameter), le nom du service de Reaction et les paramètre de la réaction (reactionParameter)
    Valeur de retour : 200 et un json de l’Area si la modification a marché, 400 sinon

<br>

**‘/getArea’ : renvoie les détails d’une Area**

    GET
    Header : nécessite un bearer token
    Body : l’id de l’Area dont on veut les détails
    Valeur de retour : 200 avec les détails de l’area ou 400 sinon

<br>

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
