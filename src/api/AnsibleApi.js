export default class AnsibleApi {
    static baseUrl = `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api`;

    static runPlaybook(body) {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };
        return fetch(`${this.baseUrl}/playbook`, requestOptions)
            .then(response => response.json());
    }

    static addClient(body) {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };
        return fetch(`${this.baseUrl}/client`, requestOptions)
            .then(response => response.json());
    }

    static editClient(body) {
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };
        return fetch(`${this.baseUrl}/client`, requestOptions)
            .then(response => response.json());
    }

    static deleteClient(publicKey) {
        const requestOptions = {
            method: "DELETE"
        };
        return fetch(`${this.baseUrl}/client/${encodeURIComponent(publicKey)}`, requestOptions)
            .then(response => response.json());
    }

    static getPlaybookOutput(taskId) {
        return fetch(`${this.baseUrl}/playbook/${taskId}`)
            .then(response => response.json());
    }

    static getWireGuardConfig(publicKey) {
        return fetch(`${this.baseUrl}/config/${encodeURIComponent(publicKey)}`)
            .then(response => response.text());
    }
}
