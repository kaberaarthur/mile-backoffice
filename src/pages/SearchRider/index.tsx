import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import { useState, useEffect } from "react";

function Main() {
  // State to hold the form input values
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [inputEmpty, setInputEmpty] = useState(false);

  // State to hold the search results
  const [searchResults, setSearchResults] = useState("");

  // Function to handle form submission
  const handleSearch = () => {
    // Reset previous search results
    setSearchResults("");

    // Email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Phone number validation regex pattern
    const phonePattern = /^\+254\d{9}$/;

    // Check if email is empty or formatted correctly
    if (email !== "" && !emailPattern.test(email)) {
      console.log("Invalid email format");
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }

    // Check if phone number is empty or formatted correctly
    if (phoneNumber !== "" && !phonePattern.test(phoneNumber)) {
      console.log("Invalid phone number format");
      setPhoneError("Invalid phone number format");
      return;
    } else {
      setPhoneError("");
    }

    // If both email and phoneNumber are empty, return without performing the search
    if (email === "" && phoneNumber === "") {
      console.log("Please enter an email address or phone number.");
      setInputEmpty(true);
      return;
    } else {
      setInputEmpty(false);
    }

    // Firestore Query End
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium intro-y">Search Rider</h2>
      </div>
      {/* BEGIN: Wizard Layout */}
      <div className="py-10 mt-2 intro-y box sm:py-20">
        <div className="px-5 mt-2">
          <div className="text-4xl font-medium text-center">Search Rider</div>
          {inputEmpty && ( // Conditionally show the message if inputEmpty is true
            <div className="mt-2 text-center text-red-600">
              Please enter an email address or phone number.
            </div>
          )}
        </div>
        <div className="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
          <div className="text-base font-medium">Profile Settings</div>
          <div className="grid grid-cols-12 gap-4 mt-5 gap-y-5">
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">Email Address</FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-red-600 mt-2">{emailError}</p>
            </div>
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-2">Phone Number</FormLabel>
              <FormInput
                id="input-wizard-2"
                type="text"
                placeholder="+254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-red-600 mt-2">{phoneError}</p>
            </div>
            <div className="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
              <Button
                variant="primary"
                className="w-24 ml-2"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* END: Wizard Layout */}
    </>
  );
}

export default Main;
