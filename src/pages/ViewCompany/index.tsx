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
  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // You can use other date formatting methods as well
  };

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
              Created: {" " + ride[0]?.phone}
            </div>
          </div>
        </div>
        {/* END: Product Detail Side Menu */}
      </div>
    </>
  );
}

export default Main;
