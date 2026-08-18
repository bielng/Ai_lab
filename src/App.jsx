import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.jsx";
import StudioLayout from "./components/studio/StudioLayout.jsx";
import StudioHome from "./components/studio/StudioHome.jsx";
import StudioChat from "./components/studio/StudioChat.jsx";
import StudioTranslate from "./components/studio/StudioTranslate.jsx";
import StudioVoice from "./components/studio/StudioVoice.jsx";
import StudioTTS from "./components/studio/StudioTTS.jsx";

function useHashPath() {
  const [path, setPath] = useState(() => window.location.hash.replace(/^#/, "") || "/");

  useEffect(() => {
    const onHashChange = () => setPath(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return path;
}

const STUDIO_PAGES = {
  home: StudioHome,
  chat: StudioChat,
  translate: StudioTranslate,
  voice: StudioVoice,
  tts: StudioTTS,
};

export default function App() {
  const path = useHashPath();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  if (path.startsWith("/studio")) {
    const segment = path.split("/")[2] || "home";
    const Page = STUDIO_PAGES[segment] || StudioHome;
    return (
      <StudioLayout active={segment in STUDIO_PAGES ? segment : "home"}>
        <Page />
      </StudioLayout>
    );
  }

  return <HomePage />;
}
