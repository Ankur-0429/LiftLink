"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <section className="px-3 py-36 mx-auto max-w-screen-lg flex-grow">
        <div className="mt-3 whitespace-pre-line text-center text-5xl font-bold tracking-tight">
          Your Commute, Simplified: Find and Share Rides Instantly with{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            LiftLink
          </span>
        </div>
        <div className="mt-8 flex justify-center gap-x-5 gap-y-3 max-sm:flex-col">
          <Button
            className="h-11 px-8"
            onClick={() => {
              signIn("google");
            }}>
            Get Started
          </Button>
          <a
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8"
            href="https://github.com/ixartz/Next-js-Boilerplate"
            target="_blank"
            rel="noopener">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 size-5">
              <path
                d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"></path>
            </svg>
            Star on GitHub
          </a>
        </div>
      </section>

      <footer className="w-full border-t border-gray-300 py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center text-sm text-gray-600">
          <div className="flex flex-wrap space-x-4 mb-2 md:mb-0">
            <a href="https://portfolio-ankur-0429.vercel.app/" className="hover:underline">
              © 2024 Ahir
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                BETA
              </div>
              <span>•</span>
              <p className="hidden sm:visible">Limited to UCSC students</p>
              <span className="hidden sm:visible">•</span>
              <a href="mailto:ankurahir0429@gmail.com" className="text-blue-500 hover:underline">
                Send Feedback
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
