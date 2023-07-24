import { useState, useEffect } from "react";
import logoUrl from "../../assets/images/logo.svg";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import Button from "../../base-components/Button";
import { FormInput, FormCheck } from "../../base-components/Form";
import LoadingIcon from "../../base-components/LoadingIcon";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

import { useNavigate } from "react-router-dom";

function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState("");

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

  const navigateToSignIn = () => {
    navigate("/login");
  };

  const registerUser = () => {
    setIsLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        if (user) {
          // Check if user is not null
          user
            .updateProfile({
              displayName: `${firstName} ${lastName}`,
            })
            .then(function () {
              // Update successful.
              console.log("User Profile Updated Successfully");
              setNewUser(JSON.stringify(user));
              createAdminProfile(user); // Pass user object directly
            })
            .catch(function (error) {
              // An error happened.
              console.error("User Profile Update Error", error);
            });
        } else {
          console.error("User is null");
        }
      })
      .catch((error) => {
        console.error("User Registration Error", error);
      });
  };

  const createAdminProfile = (user: any) => {
    // Use passed user object
    const uid = user.uid;
    firebase
      .firestore()
      .collection("admins")
      .doc(uid)
      .set({
        phone: phone,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        level: 3,
        name: firstName + " " + lastName,
        email: email,
      })
      .then(function () {
        setIsLoading(false);
        console.log("New admin document successfully created!");
      })
      .catch(function (error) {
        console.error("Error creating admin document: ", error);
      });
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
              Register a New Account
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block px-4 py-3"
                placeholder="First Name"
              />
              <FormInput
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block px-4 py-3 mt-4"
                placeholder="Last Name"
              />
              <FormInput
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-4 py-3 mt-4"
                placeholder="Email"
              />
              <FormInput
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block px-4 py-3 mt-4"
                placeholder="Phone - +254790485731"
              />
              <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3">
                <div className="h-full col-span-3 rounded bg-success"></div>
                <div className="h-full col-span-3 rounded bg-success"></div>
                <div className="h-full col-span-3 rounded bg-success"></div>
                <div className="h-full col-span-3 rounded bg-slate-100 dark:bg-darkmode-800"></div>
              </div>
              <a
                href=""
                className="block mt-2 text-xs text-slate-500 sm:text-sm"
              >
                What is a secure password?
              </a>
              <FormInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-4 py-3 mt-4"
                placeholder="Password"
              />

              <FormInput
                type={showPassword ? "text" : "password"}
                className="block px-4 py-3 mt-4"
                placeholder="Password Confirmation"
              />
              <button
                onClick={toggleShowPassword}
                className="block mt-2 text-xs text-slate-500"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <div className="flex items-center mt-4 text-xs text-slate-500 sm:text-sm">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  className="mr-2 border"
                />
                <label
                  className="cursor-pointer select-none"
                  htmlFor="remember-me"
                >
                  I agree to the Mile Taxi
                </label>
                <a
                  className="ml-1 text-primary dark:text-slate-200"
                  href="https://mile.ke/privacy-policy"
                >
                  Privacy Policy
                </a>
                .
              </div>
              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="w-full xl:mr-3"
                  onClick={registerUser}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingIcon
                      icon="oval"
                      className="w-8 h-8"
                      color="white"
                    />
                  ) : (
                    "Register"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-full mt-3"
                  disabled={isLoading}
                  onClick={navigateToSignIn}
                >
                  Sign in
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
