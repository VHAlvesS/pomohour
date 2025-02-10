import React from "react";
import Header from "../../components/header";
import Accordion from "@/components/accordion";
import SettingsProvider from "../../components/settingsWrapper";

function about() {
  return (
    <div className="grid items-center justify-items-center mt-3 pb-20 font-[family-name:var(--font-geist-sans)] w-11/12 m-auto">
      <SettingsProvider>
        <Header />
      </SettingsProvider>
      <div className="mt-16 bg-white bg-opacity-5 rounded-lg p-4 pb-16">
        <div className="max-w-5xl m-auto">
          <span className="w-full text-center inline-block font-extralight mb-2 mt-2">
            POMOHOUR COMMON FAQS
          </span>
          <h1 className="w-full text-center text-3xl mb-8">
            Frequently Asked Questions
          </h1>
          <div className="mt-20">
            <Accordion
              className="border-b border-t border-opacity-30 border-white p-4"
              title="What is Pomohour?"
              description="Pomohour is an application based on the Pomodoro productivity technique, designed to help you manage your time efficiently during studies or work. It allows you to divide tasks into time blocks with breaks, promoting focus and healthy pauses."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="What is a Pomodoro?"
              description=" Pomodoro is a time unit used in the Pomodoro technique, usually lasting 25 minutes, during which you focus on a specific task without interruptions. After each Pomodoro, there is a short 5-minute break."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="Why study using the Pomodoro method?"
              description="Studying using the Pomodoro method helps increase focus, improve productivity, and reduce mental fatigue. It divides time into manageable blocks, making the learning process more efficient and less stressful."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="Can I use the app offline?"
              description="Yes, the app can be used offline as long as it has been previously loaded on your browser or device. This means you can continue using it without an active internet connection."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="Is the app free?"
              description="Yes, the app is completely free to use. There are no hidden costs, and you can enjoy all its features without paying anything."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="Does the app support other devices?"
              description="Yes, the app is compatible with various devices. As long as you are using a browser, you can access it on mobile phones, tablets, computers, and other devices."
            />
            <Accordion
              className="border-b border-opacity-30 border-white p-4"
              title="Who owns Pomohour, and how can I contribute?"
              description="Pomohour is a personal project of mine, Vitor Hugo, a Software Engineering student. It reflects my passion for creating practical digital solutions. If you enjoyed the app, I invite you to follow me on social media, share Pomohour, and recommend my work. I’m always looking for new opportunities in software development and technology. I truly appreciate your support!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default about;
