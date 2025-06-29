import Cookies from "js-cookie";

const tokenAcess = Cookies.get("token-news-access");

export const PostAPI = {
  create: async (data: any, CategoryId: number) => {
    const response = await fetch(`http://localhost:3000/post/${CategoryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAcess}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar post");
    }
    return response.json();
  },
};
