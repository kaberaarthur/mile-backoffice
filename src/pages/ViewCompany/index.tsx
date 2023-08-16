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
import { useState, useEffect, useRef } from "react";
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

function Main() {
  const { id } = useParams();
  const [ride, setRide] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [headerFooterModalPreview, setHeaderFooterModalPreview] =
    useState(false);
  const sendButtonRef = useRef(null);

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

  // Function to convert Firestore timestamp to a human-readable date
  /*
  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // You can use other date formatting methods as well
  };
  */

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
                          variant="primary"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setHeaderFooterModalPreview(true);
                          }}
                        >
                          Show Modal
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
                              Broadcast Message
                            </h2>
                            <Button
                              variant="outline-secondary"
                              className="hidden sm:flex"
                            >
                              <Lucide icon="File" className="w-4 h-4 mr-2" />{" "}
                              Download Docs
                            </Button>
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
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-1">From</FormLabel>
                              <FormInput
                                id="modal-form-1"
                                type="text"
                                placeholder="example@gmail.com"
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-2">To</FormLabel>
                              <FormInput
                                id="modal-form-2"
                                type="text"
                                placeholder="example@gmail.com"
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-3">
                                Subject
                              </FormLabel>
                              <FormInput
                                id="modal-form-3"
                                type="text"
                                placeholder="Important Meeting"
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-4">
                                Has the Words
                              </FormLabel>
                              <FormInput
                                id="modal-form-4"
                                type="text"
                                placeholder="Job, Work, Documentation"
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-5">
                                Doesn't Have
                              </FormLabel>
                              <FormInput
                                id="modal-form-5"
                                type="text"
                                placeholder="Job, Work, Documentation"
                              />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-6">Size</FormLabel>
                              <FormSelect id="modal-form-6">
                                <option>10</option>
                                <option>25</option>
                                <option>35</option>
                                <option>50</option>
                              </FormSelect>
                            </div>
                          </Dialog.Description>
                          <Dialog.Footer>
                            <Button
                              type="button"
                              variant="outline-secondary"
                              onClick={() => {
                                setHeaderFooterModalPreview(false);
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
                            >
                              Send
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
                              Total Rides
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
                          <Table.Tr>
                            <Table.Td className="whitespace-nowrap">1</Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              Angelina Jolie
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              +254790485731
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              angelinajolie@gmail.com
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              27
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              860
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              <Button variant="primary">
                                {isLoading ? (
                                  <LoadingIcon
                                    icon="oval"
                                    className="w-8 h-8"
                                    color="white"
                                  />
                                ) : (
                                  "View Company"
                                )}
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td className="whitespace-nowrap">2</Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              Jane Wo
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              +14695818834
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              wo@gmail.com
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              13
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              1650
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              <Button variant="primary">
                                {isLoading ? (
                                  <LoadingIcon
                                    icon="oval"
                                    className="w-8 h-8"
                                    color="white"
                                  />
                                ) : (
                                  "View Company"
                                )}
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td className="whitespace-nowrap">3</Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              Brad Pitt
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              +254703557082
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              pittb@gmail.com
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">2</Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              2910
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap">
                              <Button variant="primary">
                                {isLoading ? (
                                  <LoadingIcon
                                    icon="oval"
                                    className="w-8 h-8"
                                    color="white"
                                  />
                                ) : (
                                  "View Company"
                                )}
                              </Button>
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
