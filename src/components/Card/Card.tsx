import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface ICardProps {
  title: string;
  description: string;
  containerClass?: string;
  participants: string;
  point: string;
  buttonTitle: string;
  onButtonClick: () => void;
  disabled?: boolean;
}

const Card: React.FC<ICardProps> = ({
  point,
  participants,
  title,
  description,
  containerClass,
  buttonTitle,
  onButtonClick,
  disabled,
}) => {
  const { data: session } = useSession();
  const [loggedIn, setLoggedIn] = useState(false);
  const [buttonTitles, setButtonTitles] = useState(buttonTitle);

  useEffect(() => {
    if (session) {
      setLoggedIn(true);
      setButtonTitles(buttonTitle);
    } else {
      setLoggedIn(false);
      setButtonTitles("Sign in");
    }
  }, [session, buttonTitle]);

  return (
    <div className={`card ${containerClass}`}>
      <div
        className={`card flex-row max-w-50 bg-black min-w-60 mt-6 mr-4 ml-4 border border-white/[0.2] rounded-lg ${containerClass}`}
      >
        <div className="flex justify-between subpixel-antialiased card-body py-4 px-6">
          <div>
            <div className="flex justify-between">
              <h2 className="text-white flex text-lg sm:text-xl card-title">
                {title}
              </h2>
              <button
                className="rounded-xl border max-w-20 sm:max-w-40 sm:max-h-15 max-h-12 border-white/[0.4] bg-black px-3 py-2 font-semibold text-wrap md:text-balance  md:text-sm text-xs text-white transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                onClick={onButtonClick}
                disabled={!loggedIn || disabled}
              >
                {buttonTitles}
              </button>
            </div>

            <div className="flex mt-2">
              {/* <div className="text-gray-300 text-sm font-bold">
                {/* {participants} */}
              {/* </div> */}
              <p className="text-white text-sm text-balance text-left">
                {description}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center text-gray-300 text-xl gap-1 font-semibold">
            <div className="min-w-7 min-h-7">
              <Image
                src="/astreoidpoint.png"
                width={50}
                height={50}
                alt="Asteroid point"
                className="mr-2"
              />
            </div>
            <div>{point}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
