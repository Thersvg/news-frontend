export const AuthAPI = {
    
    async auth(email: string, password: string) {
        const response = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Acesso não autorizado.');
        }

        const data = await response.json();
        return data;
    },

    async createUser(data: {name: string, role: string, email: string, password: string}) {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar usuário.');
        }

        return await response.json();
    },

    async getAllUsers() {
        const response = await fetch('http://localhost:3000/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar usuários.');
        }

        return await response.json();
    },

    async updateUser(id: number, data: Partial<{name: string; role: string; email: string; password: string}>) {
        const response = await fetch(`http://localhost:3000/auth/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar usuário.');
        }

        return await response.json();
    },

    async deleteUser(id: number) {
        const response = await fetch(`http://localhost:3000/auth/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir usuário.');
        }

        return await response.json();
    },
}