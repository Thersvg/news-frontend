import Cookies from "js-cookie";

const tokenAcess = Cookies.get("token-news-access");

export const CategoriesAPI = {

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
    }
}