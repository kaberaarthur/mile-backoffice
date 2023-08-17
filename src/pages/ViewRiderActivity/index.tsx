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
type RideData = { [key: string]: any };

function Main() {
  const { id } = useParams();
  const [rider, setRider] = useState<DocumentData[]>([]);
  const [rides, setRides] = useState<RiderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Get All Rides associated with the Rider and Company
  const getRides = async (companyWalletID: string): Promise<void> => {
    console.log(companyWalletID);

    try {
      const ridesSnapshot = await db
        .collection("rides")
        .where("companyWalletID", "==", companyWalletID)
        .where("riderId", "==", id)
        .get();

      const fetchedRides: RideData[] = [];
      ridesSnapshot.forEach((doc) => {
        fetchedRides.push({ id: doc.id, ...doc.data() });
      });

      setRides(fetchedRides);
      console.log("Fetched Rides: ", fetchedRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
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

                getRides(data.companyWalletID);
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
                              Origin
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Destination
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                              Date
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {rides.map((ride, index) => (
                            <Table.Tr key={index}>
                              <Table.Td className="whitespace-nowrap">
                                {index + 1}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {ride?.rideOrigin[0].description}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {ride?.rideDestination[0].description}
                              </Table.Td>
                              <Table.Td className="whitespace-nowrap">
                                {formatDate(ride?.dateCreated)}
                              </Table.Td>

                              <Table.Td className="whitespace-nowrap">
                                {ride?.totalClientPays}
                              </Table.Td>
                            </Table.Tr>
                          ))}
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
