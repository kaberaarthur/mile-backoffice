import { useState, useEffect } from "react";
import logoUrl from "../../assets/images/logo.svg";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import Button from "../../base-components/Button";
import { FormInput, FormCheck } from "../../base-components/Form";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      await auth.sendPasswordResetEmail(email);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      console.error("Error in password reset", error);
      setMessage("Error in password reset. Try again");
    }
    setIsLoading(false);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <DarkModeSwitcher />
        <MainColorSwitcher />
        <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
          <div className="w-96 intro-y">
            <img
              className="w-16 mx-auto"
              alt="Rocketman - Tailwind HTML Admin Template"
              src={logoUrl}
            />
            <div className="text-2xl font-medium text-center text-white dark:text-slate-300 mt-14">
              Reset your Password!
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-4 py-3"
                placeholder="Enter your Email Address"
              />
              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <label className="block mt-2 text-xs text-blue-500">
                  {message}
                </label>
                <Button
                  variant="primary"
                  className="w-full xl:mr-3"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingIcon
                      icon="oval"
                      className="w-8 h-8"
                      color="white"
                    />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
