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
    }
}