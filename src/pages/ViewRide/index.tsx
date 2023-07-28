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
import _ from "lodash";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../../firebaseConfig";
import { DocumentData } from "firebase/firestore";
import firebase from "firebase/compat/app";

function Main() {
  const { id } = useParams();
  const [ride, setRide] = useState<DocumentData[]>([]);

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
        var docRef = db.collection("rides").doc(id);

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
  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // You can use other date formatting methods as well
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="flex items-center mr-auto text-lg font-medium">
          View Ride
          <Lucide icon="ArrowDown" className="w-4 h-4 mx-2 !stroke-2" />
        </h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          {/*
          <Button variant="primary" className="mr-2 shadow-md">
            <Lucide icon="FileText" className="w-4 h-4 mr-2" /> View Full Report
          </Button>
          */}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Product Detail Side Menu */}
        <div className="col-span-12 2xl:col-span-3">
          <div className="p-5 box intro-y">
            <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div className="text-base font-medium truncate">Ride Details</div>
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Rider: {ride[0]?.riderName}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Driver: {ride[0]?.driverName}
            </div>
            <div className="flex items-center">
              <Lucide icon="Map" className="w-4 h-4 mr-2 text-slate-500" />
              Origin: {ride[0]?.rideOrigin[0].description}
            </div>
            <div className="flex items-center">
              <Lucide icon="Map" className="w-4 h-4 mr-2 text-slate-500" />
              Destination: {ride[0]?.rideDestination[0].description}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Rider Phone: {ride[0]?.riderPhone}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="Clipboard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Driver Phone: {ride[0]?.driverPhone}
            </div>
            <div className="flex items-center mt-3">
              <Lucide
                icon="CreditCard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Payment Method:
              <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                {ride[0]?.paymentMethod.text}
              </span>
            </div>
            <div className="flex items-center mt-3">
              <Lucide
                icon="CreditCard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Total Before Deduction: {ride[0]?.totalFareBeforeDeduction}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="CreditCard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Total Deduction: {ride[0]?.totalDeduction}
            </div>
            <div className="flex items-center">
              <Lucide
                icon="CreditCard"
                className="w-4 h-4 mr-2 text-slate-500"
              />
              Total Client Paid: {ride[0]?.totalClientPays}
            </div>
            <div className="flex items-center mt-3">
              <Lucide icon="Clock" className="w-4 h-4 mr-2 text-slate-500" />
              Start Time:
              <a href="" className="ml-1 underline">
                {ride[0]?.startTime
                  ? formatDate(ride[0].startTime)
                  : "Start time not available"}
              </a>
            </div>
            <div className="flex items-center">
              <Lucide icon="Clock" className="w-4 h-4 mr-2 text-slate-500" />
              End Time:
              <a href="" className="ml-1 underline">
                {ride[0]?.endTime
                  ? formatDate(ride[0].endTime)
                  : "End time not available"}
              </a>
            </div>
          </div>
        </div>
        {/* END: Product Detail Side Menu */}
      </div>
    </>
  );
}

export default Main;
