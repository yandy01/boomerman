// store.js
export class Store {
    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    // Méthode pour mettre à jour l'état du jeu
    updateState(newState) {
        this.state = newState;
        // Appeler tous les écouteurs enregistrés pour informer du changement d'état
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(newState) {
        this.state = newState;
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
