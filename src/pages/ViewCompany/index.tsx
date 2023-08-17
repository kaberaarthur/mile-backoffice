import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { Tab } from "../../base-components/Headless";
import Pagination from "../../base-components/Pagination";
import Table from "../../base-components/Table";
import {
  FormInput,
  FormInline,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import fakerData from "../../utils/faker";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormSwitch } from "../../base-components/Form";
import { Menu, Dialog } from "../../base-components/Headless";

import _ from "lodash";
import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";

import { db, auth } from "../../../firebaseConfig";
import { DocumentData } from "firebase/firestore";
import firebase from "firebase/compat/app";

type RiderData = { [key: string]: any };

function Main() {
  const { id } = useParams();
  const [ride, setRide] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [headerFooterModalPreview, setHeaderFooterModalPreview] =
    useState(false);
  const sendButtonRef = useRef(null);
  const [searchedState, setSearchedState] = useState<boolean>(false);
  const [riders, setRiders] = useState<RiderData[]>([]);
  const [rider, setRider] = useState<DocumentData[]>([]);
  const [email, setEmail] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [walletAmount, setWalletAmount] = useState<number | string>("");

  // Handle Email Input
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle Wallet Amount Input
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletAmount(e.target.value);
  };

  // Search Riders to Add Them
  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResults(""); // Reset previous search results
    setRider([]); // Clear rider data
    setSearchError(""); // Clear search error

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if email is empty or formatted correctly
    if (!emailPattern.test(email)) {
      setSearchError("Invalid email format");
      return;
    } else {
      setSearchError("");
    }

    try {
      let querySnapshot;

      // Search based on email
      querySnapshot = await db
        .collection("riders")
        .where("email", "==", email)
        .where("companyWalletUser", "==", false)
        .get();

      if (querySnapshot.empty) {
        setSearchError("User with that Email Not Found");
      } else {
        setSearchedState(true);
        const results: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          data.id = doc.id; // Include doc.id in the data object
          results.push(data);
        });

        if (results.length > 0) {
          setRider([results[0]]); // Set the rider state with the first document found
        }
      }
    } catch (error) {
      setSearchError("An error occurred during search.");
      console.error("Error occurred during search:", error);
      setSearchedState(false);
    }

    setIsLoading(false);
  };

  // Subtract the Amount given to the New Rider Added to Company's Wallet
  const updateCompanyDocument = async () => {
    try {
      const companyDocRef = db.collection("companies").doc(id);
      const companyDoc = await companyDocRef.get();

      if (!companyDoc.exists) {
        console.error("Company document not found");
        return;
      }

      const numericWalletAmount =
        typeof walletAmount === "string"
          ? parseFloat(walletAmount)
          : walletAmount;

      const companyData = companyDoc.data();

      const updatedTotalWallet = companyData?.totalWallet - numericWalletAmount;

      await companyDocRef.update({
        totalWallet: updatedTotalWallet,
      });

      console.log("Company document updated successfully");
      // Handle other logic as needed
    } catch (error) {
      console.error("Error updating company document:", error);
    }
  };

  const updateRiderDocument = async () => {
    setIsLoading(true);
    if (rider.length === 0) {
      setAmountError("No User has been Selected");
      return; // Exit the function if no rider is found
    }

    // Ensure amount is not Empty or Below 100
    const numericWalletAmount =
      typeof walletAmount === "string"
        ? parseFloat(walletAmount)
        : walletAmount;

    if (numericWalletAmount < 100 || numericWalletAmount === 0) {
      setAmountError("The Amount must be above 100");
      return;
    }

    try {
      // Update the rider document in Firestore
      await db.collection("riders").doc(rider[0].id).update({
        companyWalletUser: true,
        companyWalletID: id,
        companyWalletBalance: numericWalletAmount,
      });

      // Update the company document by subtracting walletAmount
      await updateCompanyDocument();

      // Log success or perform other actions
      console.log("Rider document updated successfully");
      setHeaderFooterModalPreview(false);
      setAmountError("");
      setSearchResults(""); // Reset previous search results
      setRider([]); // Clear rider data
      setSearchError(""); // Clear search error
      setEmail(""); // Clear Email Address
      setWalletAmount(""); // Clear Wallet Amount
    } catch (error) {
      console.error("Error updating rider document:", error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("riders")
      .where("companyWalletID", "==", id)
      .onSnapshot((snapshot) => {
        const fetchedRiders: RiderData[] = [];
        snapshot.forEach((doc) => {
          const riderData = doc.data();
          fetchedRiders.push({
            id: doc.id, // Add the document ID to the rider object
            ...riderData, // Spread the rest of the rider data
          });
        });
        setRiders(fetchedRiders);
        console.log("Company Riders: ", fetchedRiders);
      });

    return () => unsubscribe();
  }, [id]);

  const formatDate = (timestamp: any) => {
    const firebaseTimestamp = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return firebaseTimestamp.toLocaleDateString(undefined, options);
  };

  const [categories, setCategories] = useState([
    "Photography",
    "christianbale@left4code.com",
    "angelinajolie@left4code.com",
    "brucewillis@left4code.com",
    "nicolascage@left4code.com",
  ]);

  useEffect(() => {
    const fetchRiderProfile = async () => {
      try {
        var docRef = db.collection("companies").doc(id);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Rider Profile Data: ", doc.data());
              const data = doc.data() as DocumentData | undefined; // Explicitly cast to DocumentData or undefined
              if (data) {
                setRide([data]); // Update the state with the array containing the single data element
              } else {
                console.log("No such document Exists!");
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } catch (error) {
        console.error("Error fetching ride Data:", error);
      }
    };

    fetchRiderProfile();
  }, [id]);

  return (
    <>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Product Detail Side Menu */}
        <div className="col-span-12 2xl:col-span-3">
          <div className="p-5 box intro-y">
            <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div className="text-base font-medium truncate">
                {ride[0]?.companyName}
              </div>
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Phone Number: {" " + ride[0]?.phone}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Email Address: {" " + ride[0]?.email}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Created:{" "}
              {ride[0]?.dateCreated
                ? formatDate(ride[0]?.dateCreated)
                : "Unknown"}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Remaining Balance: {" " + ride[0]?.totalWallet}
            </div>
          </div>
        </div>
        {/* END: Product Detail Side Menu */}
        <div className="col-span-12 intro-y lg:col-span-12">
          {/* BEGIN: Responsive Table */}
          <PreviewComponent className="mt-5 intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
                  <h2 className="mr-auto text-base font-medium">
                    Registered Riders
                  </h2>
                  <FormSwitch className="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                    <Preview>
                      {/* BEGIN: Modal Toggle */}
                      <div className="text-center">
                        <Button
                          as="a"
                          href="#"
                          variant="warning"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setHeaderFooterModalPreview(true);
                          }}
                        >
                          Add Rider
                        </Button>
                      </div>
                      {/* END: Modal Toggle */}
                      {/* BEGIN: Modal Content */}
                      <Dialog
                        open={headerFooterModalPreview}
                        onClose={() => {
                          setHeaderFooterModalPreview(false);
                        }}
                        initialFocus={sendButtonRef}
                      >
                        <Dialog.Panel>
                          <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                              Search & Add Riders
                            </h2>
                            <Menu className="sm:hidden">
                              <Menu.Button className="block w-5 h-5">
                                <Lucide
                                  icon="MoreHorizontal"
                                  className="w-5 h-5 text-slate-500"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-40">
                                <Menu.Item>
                                  <Lucide
                                    icon="File"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Download Docs
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </Dialog.Title>

                          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                            <div className="col-span-12 sm:col-span-12">
                              <FormLabel htmlFor="modal-form-1">
                                Email Address
                              </FormLabel>
                              <FormInput
                                id="modal-form-1"
                                type="text"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={handleEmailChange}
                              />
                              <p className="text-xs text-red-600">
                                {searchError}
                              </p>
                            </div>
                            <div className="col-span-12 sm:col-span-12 mt-4">
                              <FormLabel htmlFor="modal-form-1">
                                <span className="text-primary">
                                  {"User Found: "}
                                  {rider[0]?.phone}
                                </span>
                              </FormLabel>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                              <FormLabel htmlFor="modal-form-1">
                                Wallet Amount
                              </FormLabel>
                              <FormInput
                                id="modal-form-1"
                                type="text"
                                placeholder="100"
                                value={walletAmount}
                                onChange={handleAmountChange}
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                              <p className="text-xs text-red-600 mb-2">
                                {amountError}
                              </p>
                              <Button
                                type="button"
                                variant="pending"
                                className="w-full mr-1"
                                disabled={rider.length === 0}
                                onClick={updateRiderDocument}
                              >
                                {isLoading ? (
                                  <LoadingIcon
                                    icon="oval"
                                    className="w-8 h-8"
                                    color="white"
                                  />
                                ) : (
                                  "Add Rider"
                                )}
                              </Button>
                            </div>
                          </Dialog.Description>
                          <Dialog.Footer>
                            <Button
                              type="button"
                              variant="outline-secondary"
                              onClick={() => {
                                setHeaderFooterModalPreview(false);
                                setSearchResults(""); // Reset previous search results
                                setRider([]); // Clear rider data
                                setSearchError(""); // Clear search error
                                setEmail("");
                                setWalletAmount("");
                              }}
                              className="w-20 mr-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              type="button"
                              className="w-20"
                              ref={sendButtonRef}
                              onClick={handleSearch}
                            >
                              {isLoading ? (
                                <LoadingIcon
                                  icon="oval"
                                  className="w-8 h-8"
                                  color="white"
                                />
                              ) : (
                                "Search"
                              )}
                            </Button>
                          </Dialog.Footer>
                        </Dialog.Panel>
                      </Dialog>
                      {/* END: Modal Content */}
                    </Preview>
                  </FormSwitch>
                </div>
                <div className="p-5">
                  <Preview>
                    <div className="overflow-x-auto">
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th className="whitespace-nowrap">#</Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Name
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Phone Number
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Email
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Wallet Ballance
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Action
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {riders.map((rider, index) => (
                            <Table.Tr key={index}>
                              <Table.Td className="whitespace-nowrap">
                                {index + 1}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {rider?.name}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {rider?.phone}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {rider?.email}
                              </Table.Td>

                              <Table.Td className="whitespace-nowrap">
                                {rider?.companyWalletBalance}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                <a href={"/view-rider-activity/" + rider?.id}>
                                  <Button variant="primary">
                                    Rider Activity
                                  </Button>
                                </a>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </Preview>
                  <Source>
                    <Highlight>
                      {`
                <div className="overflow-x-auto">
                  <Table>
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
                        <Table.Th className="whitespace-nowrap">
                          Email
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Address
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td className="whitespace-nowrap">1</Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Angelina
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Jolie
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          @angelinajolie
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          angelinajolie@gmail.com
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          260 W. Storm Street New York, NY 10025.
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td className="whitespace-nowrap">2</Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Brad
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Pitt
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          @bradpitt
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          bradpitt@gmail.com
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          47 Division St. Buffalo, NY 14241.
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td className="whitespace-nowrap">3</Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Charlie
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          Hunnam
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          @charliehunnam
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          charliehunnam@gmail.com
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          8023 Amerige Street Harriman, NY 10926.
                        </Table.Td>
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
          {/* END: Responsive Table */}
        </div>
      </div>
    </>
  );
}

export default Main;
