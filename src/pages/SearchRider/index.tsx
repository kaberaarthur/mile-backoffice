import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import { useState, useEffect } from "react";

import Table from "../../base-components/Table";
import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import { FormSwitch } from "../../base-components/Form";
import { Link } from "react-router-dom";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

import { DocumentData } from "firebase/firestore";

function Main() {
  // State to hold the form input values
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [inputEmpty, setInputEmpty] = useState(false);

  // State to hold the search results
  const [searchResults, setSearchResults] = useState("");

  const [riderProfile, setRiderProfile] = useState<DocumentData[]>([]);

  // Function to handle form submission
  const handleSearch = async () => {
    // Reset previous search results
    setSearchResults("");
    setRiderProfile([]);

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

    // Firebase Firestore query
    try {
      let querySnapshot;

      if (email !== "" && phoneNumber !== "") {
        // If both email and phoneNumber are provided, search with both criteria
        querySnapshot = await db
          .collection("riders")
          .where("email", "==", email)
          .where("phone", "==", phoneNumber)
          .get();
      } else if (email !== "") {
        // If only email is provided, search with email
        querySnapshot = await db
          .collection("riders")
          .where("email", "==", email)
          .get();
      } else {
        // If only phoneNumber is provided, search with phoneNumber
        querySnapshot = await db
          .collection("riders")
          .where("phone", "==", phoneNumber)
          .get();
      }

      // Process the search results
      if (querySnapshot.empty) {
        console.log("No User Found");
        setSearchResults("No User Found");
      } else {
        // If there are results, you can loop through the documents and handle them accordingly.
        const results: any[] = [];
        querySnapshot.forEach((doc) => {
          const riderData = doc.data() as DocumentData;
          riderData.id = doc.id; // Include doc.id in the data object
          results.push(riderData);

          const data = doc.data() as DocumentData | undefined; // Explicitly cast to DocumentData or undefined
          if (riderData) {
            setRiderProfile([riderData]); // Update the state with the array containing the single data element
          } else {
            console.log("No such document Exists!");
          }
        });
        console.log(results);

        // Set Results
      }
    } catch (error) {
      console.error("Error occurred during search:", error);
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

      <div>
        {/* Conditionally render elements based on whether riderProfile is empty */}
        {riderProfile.length === 0 ? (
          <div className="flex flex-col items-center px-5 pt-16 pb-24 text-center intro-y box mt-7">
            <div className="mt-5 text-2xl font-bold">No Users Found</div>
          </div>
        ) : (
          <div>
            {/* Render other elements based on the properties in the riderProfile object */}

            {/* BEGIN: Striped Rows */}
            <PreviewComponent className="mt-5 intro-y box">
              {({ toggle }) => (
                <>
                  <div className="p-5">
                    <Preview>
                      <div className="overflow-x-auto">
                        <Table striped>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th className="whitespace-nowrap">
                                ID
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Rider Name
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Rider Email
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Rider Phone
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Referral Code
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Status
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Action
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            <Table.Tr>
                              <Table.Td>{riderProfile[0].id}</Table.Td>
                              <Table.Td>{riderProfile[0].name}</Table.Td>
                              <Table.Td>{riderProfile[0].email}</Table.Td>
                              <Table.Td>{riderProfile[0].phone}</Table.Td>
                              <Table.Td>
                                {riderProfile[0].referralCode || "None"}
                              </Table.Td>
                              <Table.Td>
                                {riderProfile[0].activeUser
                                  ? "Active"
                                  : "Inactive"}
                              </Table.Td>
                              <Table.Td>
                                <Link to={`/view-rider/${riderProfile[0].id}`}>
                                  <Button
                                    variant="primary"
                                    className="w-24 ml-2"
                                  >
                                    View Rider
                                  </Button>
                                </Link>
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </div>
                    </Preview>
                    <Source>
                      <Highlight>
                        {`
                <div className="overflow-x-auto">
                  <Table striped>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="whitespace-nowrap">#</Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          First Name
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Last Name
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Username
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>1</Table.Td>
                        <Table.Td>Angelina</Table.Td>
                        <Table.Td>Jolie</Table.Td>
                        <Table.Td>@angelinajolie</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>2</Table.Td>
                        <Table.Td>Brad</Table.Td>
                        <Table.Td>Pitt</Table.Td>
                        <Table.Td>@bradpitt</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>3</Table.Td>
                        <Table.Td>Charlie</Table.Td>
                        <Table.Td>Hunnam</Table.Td>
                        <Table.Td>@charliehunnam</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                `}
                      </Highlight>
                    </Source>
                  </div>
                </>
              )}
            </PreviewComponent>
            {/* END: Striped Rows */}
          </div>
        )}
      </div>

      {/* No Users Found */}

      {/* No Users Found */}
    </>
  );
}

export default Main;
