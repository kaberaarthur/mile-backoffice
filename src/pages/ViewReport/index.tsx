import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { Disclosure } from "../../base-components/Headless";
import { useParams } from "react-router-dom";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

import fakerData from "../../utils/faker";
import LoadingIcon from "../../base-components/LoadingIcon";

interface ReportData {
  id: string;
  riderID: string;
  driverID: string;
  riderAuthID: string;
  driverAuthID: string;
  riderEmail: string;
  driverEmail: string;
  riderPhone: string;
  driverPhone: string;
  issue: string;
  resolved: boolean;
  timeReported: firebase.firestore.Timestamp;
  // Add other fields if necessary
}

function Main() {
  const { id } = useParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure there's an ID before proceeding
    if (!id) return;

    const unsubscribe = db
      .collection("reports")
      .doc(id)
      .onSnapshot((snapshot) => {
        const data = snapshot.data() as ReportData;
        setReportData(data);
      });

    return () => unsubscribe();
  }, [id]);

  const markResolved = async () => {
    if (!id) {
      console.error("No document ID provided.");
      return;
    }

    setIsLoading(true);

    try {
      const db = firebase.firestore();
      const reportRef = db.collection("reports").doc(id);

      // Update the 'resolved' field to true
      await reportRef.update({
        resolved: true,
      });

      console.log("Document marked as resolved.");
    } catch (error) {
      console.error("Error marking document as resolved:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Report</h2>
      </div>
      <div className="flex flex-col items-center px-5 pt-16 pb-24 intro-y box mt-7">
        {/* BEGIN: Invoice Title */}
        <div className="text-center">
          <div className="mt-5 text-4xl font-bold">{reportData?.issue}</div>
          <div className="block text-base mt-3 text-primary">
            {"Driver Email: " + reportData?.driverEmail} -{" "}
            {"Rider Email: " + reportData?.riderEmail}
          </div>
          <div className="block text-base mt-3 text-primary">
            {"Driver Phone: " + reportData?.driverPhone} -{" "}
            {"Rider Phone: " + reportData?.riderPhone}
          </div>
          <div className="block mt-3 ">
            <Button variant="primary" onClick={() => markResolved()}>
              {isLoading ? (
                <LoadingIcon icon="oval" className="w-8 h-8" color="white" />
              ) : (
                "Mark Resolved"
              )}
            </Button>
          </div>
        </div>
        {/* END: Invoice Title */}
      </div>
    </>
  );
}

export default Main;
