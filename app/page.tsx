"use client";

import React from "react";
import { useMooniversary } from "@/hooks/mooniversary";
import { Background } from "@/components/background";
import { MoonSlider } from "@/components/moon-slider";
import { EditText } from "@/components/edit-text";
import { MoonImage } from "@/components/moon-image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const {
    mooniversaryNumber,
    mooniversaryNumberText,
    mooniversaryNumberTextVerb,
    mooniversaryDateText,
    setMooniversaryNumber,
    nextMooniversaryNumber,
  } = useMooniversary();

  return (
    <>
      <Background />
      <MoonSlider>
        <div className="h-full w-full flex flex-col justify-center items-center overflow-hidden">
          <main
            className="flex flex-col items-center space-y-6 py-4 px-4 w-full max-w-2xl"
            data-test="next-mooniversary"
          >
            <div className="text-center mx-4 mb-6">
              <h1
                className="m-0 leading-[1.15] text-[2.25rem] sm:text-[2.75rem] text-white/90 text-center font-black tracking-wider [text-shadow:_-3px_-3px_0_#000,_3px_-3px_0_#000,_-3px_3px_0_#000,_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]"
                data-test="next-mooniversary-date"
              >
                {mooniversaryDateText}
              </h1>
              <div
                className="text-center leading-relaxed text-[1.2rem] sm:text-xl text-white/90 block mt-4 [text-shadow:_-3px_-3px_0_#000,_3px_-3px_0_#000,_-3px_3px_0_#000,_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]"
                data-test="next-mooniversary-number"
              >
                {mooniversaryNumberTextVerb}{" "}
                <EditText
                  name="mooniversary"
                  type="number"
                  min="1"
                  max="999"
                  required
                  size={3}
                  autoComplete="off"
                  defaultValue={mooniversaryNumber.toString()}
                  label={mooniversaryNumberText}
                  onSave={({ value }: { value: string }) => {
                    const number = parseInt(value);
                    setMooniversaryNumber(number);
                  }}
                />{" "}
                Mooniversary
              </div>
            </div>

            <Button
              onClick={() =>
                setMooniversaryNumber(Math.max(1, mooniversaryNumber - 1))
              }
              disabled={mooniversaryNumber <= 1}
              className="fixed left-4 top-1/2 -translate-y-1/2 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed p-2 h-10 w-12 z-10"
              aria-label="Previous moon"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {mooniversaryNumber > nextMooniversaryNumber && (
              <Button
                onClick={() => setMooniversaryNumber(nextMooniversaryNumber)}
                className="fixed left-4 top-1/2 translate-y-8 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-xs p-2 h-10 w-12 z-10"
              >
                Today
              </Button>
            )}

            {mooniversaryNumber > 1 &&
              mooniversaryNumber <= nextMooniversaryNumber && (
                <Button
                  onClick={() => setMooniversaryNumber(1)}
                  className="fixed left-4 top-1/2 translate-y-8 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-xs p-2 h-10 w-12 z-10"
                >
                  First
                </Button>
              )}

            <Button
              onClick={() =>
                setMooniversaryNumber(Math.min(999, mooniversaryNumber + 1))
              }
              disabled={mooniversaryNumber >= 999}
              className="fixed right-4 top-1/2 -translate-y-1/2 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed p-2 h-10 w-12 z-10"
              aria-label="Next moon"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {mooniversaryNumber < nextMooniversaryNumber && (
              <Button
                onClick={() => setMooniversaryNumber(nextMooniversaryNumber)}
                className="fixed right-4 top-1/2 translate-y-8 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-xs p-2 h-10 w-12 z-10"
              >
                Today
              </Button>
            )}

            <MoonImage
              moonNumber={mooniversaryNumber}
              nextMooniversaryNumber={nextMooniversaryNumber}
            />
          </main>
        </div>
      </MoonSlider>
    </>
  );
}
