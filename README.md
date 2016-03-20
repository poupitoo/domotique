# Domotic

Une application de domotique simple, permettant depuis un smartphone de
controller des lampes, un chauffage et des portes.

## Dev Stack

### Frontend : React Native

L'application mobile est écrite en réact-native et redux, technologies
permettant de creer tres rapidement des applications fonctionelles et stable.

### Backend : Python

Un serveur écrit en python est utilisé. Il permet de transferer les actions
effectues sur le telephone aux bons appareils, grace a une API HTTP utilisant
les librairies Flask et SQLAlchemy.

### Scheduling : Cron

Le daemon cron est utilise pour gerer les schedule. Il permet de demander au
systeme d'exploitation de lancer un script a une date et heure donnee.

## Screenshots


