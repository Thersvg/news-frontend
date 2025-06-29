import Cookies from "js-cookie";

const tokenAcess = Cookies.get("token-news-access");

export const CategoriesAPI = {

    async Create(data: { name: string , description: string}) {
        const response = await fetch('http://localhost:3000/category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAcess}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Não foi possível criar a categoria.');
        }
        return await response.json();
    },

    async GetAll() {
        const response = await fetch('http://localhost:3000/category/', {
            headers: {
                'Authorization': `Bearer ${tokenAcess}`
            }
        });
        if (!response.ok) {
            throw new Error('Não foi possivel buscar as categorias.');
        }
        return await response.json();
    },

    async EditCategory(id: number, data: { name?: string; description?: string }) {
        const response = await fetch(`http://localhost:3000/category/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAcess}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Não foi possível atualizar a categoria.');
        }
        return await response.json();
    },

    async Remove(id: number){
        const response = await fetch(`http://localhost:3000/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenAcess}`
            }
        });
        if (!response.ok) {
            throw new Error('Não foi possível remover a categoria.');
        }
        return await response.json();
    }
}