import { WordProvider } from "@/lib/word-context";
import WordApp from "@/components/word-app";

export default function Home() {
  return (
    <WordProvider>
      <WordApp />
    </WordProvider>
  );
}
