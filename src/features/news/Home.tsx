import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { PostAPI } from "../../services/post";

type NewsItem = {
    id: number;
    title: string;
    content: string;
    // add other fields as needed based on your API response
};

export default function Home() {
    const [news, setNews] = useState<NewsItem[]>([]);
    

    async function loadData() {
        const allNews = await PostAPI.getAll();
        setNews(allNews.data);
    }

    useEffect(() => {
        loadData();
    }, [news]);
    

    return (
        <>
            <NavBar />
            <main className="bg-white min-h-screen py-8">
                <section className="container mx-auto">
                </section>
            </main>
        </>
    );
}
