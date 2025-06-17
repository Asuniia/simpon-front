import { TypewriterEffectSmooth } from "~/components/ui/typewriter-effect";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export type Joke = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export default function Home() {
    const [joke, setJoke] = useState<Joke>();
    const [showContent, setShowContent] = useState(false);
    const [allowClick, setAllowClick] = useState(false);

    const fetchJoke = async () => {
        try {
            setAllowClick(false);
            setShowContent(false);
            const res = await fetch("http://127.0.0.1:3000/api/v1/jokes/random");
            if (!res.ok) {
                throw new Error("Failed to fetch joke");
            }

            const data = (await res.json()) as Joke;

            if (!data) {
                throw new Error("No joke found");
            }

            setJoke(data);
        } catch (error) {
            //todo: mettre un toast
            console.log("err", error);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-[40rem]  ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">Une blague pour égayer ta journée.</p>
            <div className="flex flex-col items-center justify-center space-y-4 p-6">
                <TypewriterEffectSmooth
                    key={joke?.title}
                    className="my-1"
                    words={joke ? [{ text: joke.title }] : [{ text: "Loading..." }]}
                    onComplete={() => setAllowClick(true)}
                />
                {showContent && (
                    <TypewriterEffectSmooth key={joke?.content} className="my-1 text-xs" words={joke ? [{ text: joke.content }] : [{ text: "Loading..." }]} />
                )}
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <Button variant={"outline"} size={"lg"} onClick={() => fetchJoke()} className="rounded-full">
                    Elle est nulle, une autre !
                </Button>

                <Button
                    variant={"default"}
                    size={"lg"}
                    className="rounded-full"
                    disabled={allowClick === false ? true : false}
                    onClick={() => setShowContent(true)}
                >
                    Je sais pas
                </Button>
            </div>
        </div>
    );
}
