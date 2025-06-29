import Cookies from "js-cookie";

const tokenAcess = Cookies.get("token-news-access");

export const UploadImage = {

    async upload(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenAcess}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar imagem");
        }

        return await response.json();
    }
}