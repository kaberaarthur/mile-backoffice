import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import fakerData from "../../utils/faker";
import _ from "lodash";
import preview16Url from "../../assets/images/fakers/preview-16.jpg";
import preview12Url from "../../assets/images/fakers/profile-12.jpg";
import Table from "../../base-components/Table";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

function Main() {
  const { id } = useParams();
  const [riderProfile, setRiderProfile] = useState<DocumentData[]>([]);
  const [rides, setRides] = useState<DocumentData[]>([]);

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
                setRiderProfile([data]); // Update the state with the array containing the single data element
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
        console.error("Error fetching rider profile:", error);
      }
    };

    fetchRiderProfile();
  }, [id]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Get the Firestore instance
        // const db = getFirestore();

        if (riderProfile.length > 0) {
          console.log(riderProfile[0].authID);

          // Prepare an array to hold the rides with IDs
          const ridesWithIds: DocumentData[] = [];

          db.collection("rides")
            .where("riderId", "==", riderProfile[0].authID)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());

                const rideData = doc.data();
                const rideId = doc.id;
                ridesWithIds.push({ id: rideId, ...rideData });
              });

              // Set the theRides state with the fetched rides
              setRides(ridesWithIds);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        } else {
          console.log("An Error");
        }
      } catch {
        console.error("Error fetching rides:");
      }
    };

    fetchRides();
  }, [riderProfile]);

  // Function to convert Firestore timestamp to a human-readable date
  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // You can use other date formatting methods as well
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="flex items-center mr-auto text-lg font-medium">
          Profile
        </h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button variant="primary" className="mr-2 shadow-md">
            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Update Profile
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Profile Cover */}
        <div className="col-span-12">
          <div className="px-3 pt-3 pb-5 box intro-y">
            <div className="image-fit h-80 before:content-[''] before:absolute before:w-full before:h-full before:bg-gradient-to-b from-black/20 to-black before:rounded-md before:z-10">
              <img
                alt="Rocketman - HTML Admin Template"
                className="rounded-md md:object-[0px_-170px]"
                src={preview16Url}
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center 2xl:flex-row 2xl:text-left">
              <div className="z-20 -mt-20 2xl:-mt-10 2xl:ml-10">
                <div className="w-40 h-40 overflow-hidden border-4 border-white rounded-full shadow-md image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    src={preview12Url}
                  />
                </div>
              </div>
              <div className="2xl:ml-5">
                <h2 className="mt-5 text-2xl font-medium">
                  {riderProfile[0]?.name || "Loading..."}
                </h2>
              </div>
              <div className="grid h-20 grid-cols-2 px-10 mx-auto mt-5 mb-6 border-dashed gap-y-2 md:gap-y-0 gap-x-5 2xl:border-l 2xl:border-r border-slate-200 2xl:mb-0">
                <div className="flex items-center justify-center col-span-2 md:col-span-1 2xl:justify-start">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {riderProfile[0]?.email || "Loading..."}
                </div>
                <div className="flex items-center justify-center col-span-2 md:col-span-1 2xl:justify-start">
                  <Lucide icon="Phone" className="w-4 h-4 mr-2" />{" "}
                  {riderProfile[0]?.phone || "Loading..."}
                </div>
                <div className="flex items-center justify-center col-span-2 md:col-span-1 2xl:justify-start">
                  <Lucide icon="Speaker" className="w-4 h-4 mr-2" />
                  {riderProfile[0]?.language || "Loading..."}
                </div>
                <div className="flex items-center justify-center col-span-2 md:col-span-1 2xl:justify-start">
                  <Lucide icon="DollarSign" className="w-4 h-4 mr-2" />
                  {riderProfile[0]?.partnerCode || "Loading..."}
                </div>
              </div>
              <div className="flex mt-5 2xl:mr-10">
                <Button variant="primary" className="w-32 mr-2">
                  <Lucide icon="UserPlus" className="w-4 h-4 mr-2" /> Following
                </Button>
                <Button variant="outline-secondary" className="w-32">
                  <Lucide icon="UserCheck" className="w-4 h-4 mr-2" /> Add
                  Friend
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* END: Profile Cover */}
        {/* BEGIN: Profile Content */}
        <div className="col-span-12 xl:col-span-8">
          <div className="p-5 box intro-y">
            <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div className="text-base font-medium truncate">Rides</div>
            </div>
            <div className="leading-relaxed">
              {/* Start Table */}
              <div className="overflow-x-auto">
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="whitespace-nowrap">#</Table.Th>
                      <Table.Th className="whitespace-nowrap">Origin</Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Destination
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Client Fee
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">Date</Table.Th>
                      <Table.Th className="whitespace-nowrap">Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {rides.map((ride, index) => (
                      <Table.Tr key={ride.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>
                          {ride.rideOrigin[0].description.split(",")[0]}
                        </Table.Td>
                        <Table.Td>
                          {ride.rideDestination[0].description.split(",")[0]}
                        </Table.Td>
                        <Table.Td>{ride.totalClientPays}</Table.Td>
                        <Table.Td>{formatDate(ride.dateCreated)}</Table.Td>
                        <Table.Td>
                          {/* Link to the ride details page with the specific ride ID */}
                          <Link to={`/view-ride/${ride.id}`}>
                            <Button variant="primary" className="w-32 mr-2">
                              <Lucide
                                icon="UserPlus"
                                className="w-4 h-4 mr-2"
                              />
                              View More
                            </Button>
                          </Link>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              {/* End Table */}
              {/* 
              <Button
                variant="outline-secondary"
                className="flex w-full mt-5 border-slate-200/60"
              >
                View More
              </Button>
              */}
            </div>
          </div>
        </div>
        {/* END: Profile Content */}
        {/* BEGIN: Profile Side Menu */}
        <div className="col-span-12 xl:col-span-4">
          <div className="p-5 box intro-y">
            <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div className="text-base font-medium truncate">Wallet</div>
            </div>
            <div>
              <div className="flex pb-5 mb-5 border-b border-dashed border-slate-200 last:border-b-0 last:pb-0 last:mb-0">
                <div className="">
                  <div className="text-4xl text-blue-900 font-medium">
                    Kshs. 1350
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 mt-5 box intro-y">
            <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div className="text-base font-medium truncate">Total Spent</div>
            </div>
            <div>
              <div className="flex pb-5 mb-5 border-b border-dashed border-slate-200 last:border-b-0 last:pb-0 last:mb-0">
                <div className="">
                  <div className="text-4xl text-blue-900 font-medium">
                    Kshs. 6870
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Profile Side Menu */}
      </div>
    </>
  );
}

export default Main;
