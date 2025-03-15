import Counter from "../components/counter";
import Tasks from "../components/tasks";
import Header from "../components/header";
import TimerSession from "../components/sessionHolder";
import SettingsProvider from "../components/settingsWrapper";
import { auth } from "../lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="grid items-center justify-items-center mt-3 pb-20 font-[family-name:var(--font-geist-sans)] w-11/12 m-auto">
      <SettingsProvider session={session}>
        <Header session={session} />
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-12 overflow-hidden w-full max-w-2xl">
          <TimerSession session={session}>
            <Counter session={session} />
            <Tasks />
          </TimerSession>
        </main>
      </SettingsProvider>
    </div>
  );
}
