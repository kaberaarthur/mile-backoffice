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
  const [rider, setRider] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [headerFooterModalPreview, setHeaderFooterModalPreview] =
    useState(false);
  const sendButtonRef = useRef(null);
  const [searchedState, setSearchedState] = useState<boolean>(false);
  const [riders, setRiders] = useState<RiderData[]>([]);
  const [email, setEmail] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [walletAmount, setWalletAmount] = useState<number | string>("");

  // Format Date from Timestamp to Human Readable Format
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

  // Get Details about the Rider
  useEffect(() => {
    const fetchRiderProfile = async () => {
      try {
        var docRef = db.collection("riders").doc(id);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Rider Profile Data: ", doc.data());
              const data = doc.data() as DocumentData | undefined; // Explicitly cast to DocumentData or undefined
              if (data) {
                setRider([data]); // Update the state with the array containing the single data element
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
                {rider[0]?.name}
              </div>
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Phone Number: {" " + rider[0]?.phone}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Email Address: {" " + rider[0]?.email}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Wallet Balance: {" " + rider[0]?.companyWalletBalance}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Wallet Balance: {" " + rider[0]?.companyWalletID}
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
                    Company Wallet Rides
                  </h2>
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
                          {/*riders.map((rider, index) => (
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
                                <Button variant="primary">
                                  Rider Activity
                                </Button>
                              </Table.Td>
                            </Table.Tr>
                          ))*/}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </Preview>
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
