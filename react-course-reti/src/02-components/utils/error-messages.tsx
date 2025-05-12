export enum ErrorMessage {
  GENERIC_ERROR = "Si è verrificato un errore",
  FETCH_ERROR = "Si è verificato un errore nel recupero dei dati",
  ADD_ERROR = "Si è verificato un errore durante l'aggiunta dei dati",
  EDIT_ERROR = "Si è verificato un errore durante la modifica dei dati",
  DELETE_ERROR = "Si è verificato un errore durante la cancellazione dei dati",
	UPLOAD_FILE = "Impossibile caricare il file. Il server è up and running?",
	DOWNLOAD_FILE = "Impossibile scaricare il file. Il server è up and running?",
	DELETE_FILE = "Impossibile eliminare il file. Il server è up and running?",
}

export enum WarningMessage {
  USER_ALREADY_EXISTS = "Esiste già un utente con questo indirizzo email",
  DELETE_WARNING = "Sei sicuro di voler eliminare questo elemento?",
}