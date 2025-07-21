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

  getAllByUser: async () => {
    const response = await fetch("http://localhost:3000/post/by-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAcess}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar posts");
    }
    return response.json();
  },

  delete: async (postId: number) => {
    const response = await fetch(`http://localhost:3000/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAcess}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar post");
    }
    return response.json();
  },

  update: async (postId: number, data: any) => {
    const response = await fetch(`http://localhost:3000/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAcess}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar post");
    }
    return response.json();
  },

  getAll: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await fetch(`http://localhost:3000/post?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAcess}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar todos os posts");
    }
    return response.json();
  }
};
