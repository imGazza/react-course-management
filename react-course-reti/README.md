# Course Managemenet

Candidato Luca Gazzardi

## Istruzioni per l'avvio

Per avviare l'applicazione è sufficiente spostarsi nella cartella del progetto con:

```cd .\react-course-reti\```

ed eseguire ```npm install```.
Non dovrebbero esserci problemi di dipendenze, nel caso provare con ```npm install --force```.

Dopo l'installazione dei pacchetti, digitare il comando:

```npm run dev:all```

Questo lancerà automaticamente:

1. Json-server per la simulazione del database (file db.json)
2. Il server javascript utilizzato per upload e download dei file
3. L'app di React

Se qualcosa non dovesse funzionare, questi sono i comandi singoli rispettivi:

1. ```npx json-server db.json```
2. ```node src/servers/file-upload.js```
3. ```npm run dev```

## Informazioni

- Per testare la constraint sull'inserimento delle valutazioni solo entro 30 giorni dalla data di chiusura, una volta chiuso un corso, è presente la possibilità di modificare la data di chiusura nella relativa card.
- Si è scelto di dividere la pagina del profilo dalla pagina di visualizzazione dei propri corsi da studente per maggiore chiarezza.
- Al momento dell'avvio solo 3 file relativi a materiali sono caricati, nello specifico per il Corso React (anno 2025), ma è possibile caricare altri materiali per ogni corso, a piacere.
- L'applicazione è responsive, le esperienze migliori sono desktop e mobile.
- Per comodità sono stati generati sempre gli stessi 10 corsi per tutti gli anni, è possibile crearne di diversi.
- Per difficoltà a generare un alto numero di dati d'esempio, alcuni utenti hanno nella pagina "I miei corsi" lo stesso corso frequentato in diversi anni, anche se poco sensato in un contesto reale.
- L'unica utenza presente come Amministratore è "luca.gazzardi@email.com", è possibile aggiungerne altre. Per simulare il login con uno studente, è sufficiente prendere un indirizzo email dalla pagina degli utenti. Tutte le password sono "password".
- E' possibile caricare gli avatar dal profilo dell'utente.
- **Fortemente consigliato provare a mandare l'applicazione in 404 e Non autorizzato.**

## Repository

E' stata usata una repository Github durante lo sviluppo, disponibile a <https://github.com/imGazza/react-course-reti.git>

