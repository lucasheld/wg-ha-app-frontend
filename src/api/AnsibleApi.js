export default class AnsibleApi {
    static baseUrl = `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api`;

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

    static editClient(clientId, body) {
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };
        return fetch(`${this.baseUrl}/client/${clientId}`, requestOptions)
            .then(response => response.json());
    }

    static deleteClient(clientId) {
        const requestOptions = {
            method: "DELETE"
        };
        return fetch(`${this.baseUrl}/client/${clientId}`, requestOptions);
    }

    static getPlaybookOutput(taskId) {
        return fetch(`${this.baseUrl}/playbook/${taskId}`)
            .then(response => response.json());
    }

    static getWireGuardConfig(clientId) {
        return fetch(`${this.baseUrl}/config/${clientId}`)
            .then(response => response.text());
    }
}
