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

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to a different page (let's say '/dashboard')
        navigate("/");
      } else {
        // No user is signed in, remain on the current page or redirect to a specific page
        // history.push('/login');
      }
    });
  }, [navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigateToSignUp = () => {
    navigate("/register");
  };

  const handleSignIn = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log("User signed in successfully");
      // Navigate to Dashboard
      navigate("/");
    } catch (err) {
      // Handle Errors here.
      if (err instanceof Error) {
        // check that err is an instance of Error
        console.log(err.message);
        setErrMessage(err.message);
      } else {
        console.log(err);
      }
    }
    setIsLoading(false);
  };

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
              Login to Your Account!
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-4 py-3"
                placeholder="Email"
              />
              <FormInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-4 py-3 mt-4"
                placeholder="Password"
              />
              <button
                onClick={toggleShowPassword}
                className="block mt-2 text-xs text-slate-500"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <div className="flex mt-4 text-xs text-slate-500 sm:text-sm">
                <div className="flex items-center mr-auto">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <a href="">Forgot Password?</a>
              </div>
              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <label className="block mt-2 text-xs text-red-500">
                  {errMessage}
                </label>
                <Button
                  variant="primary"
                  className="w-full xl:mr-3"
                  onClick={handleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingIcon
                      icon="oval"
                      className="w-8 h-8"
                      color="white"
                    />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-full mt-3"
                  onClick={navigateToSignUp}
                  disabled={isLoading}
                >
                  Sign up
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
