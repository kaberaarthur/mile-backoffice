import _ from "lodash";
import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Link } from "react-router-dom";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

type Rider = firebase.firestore.DocumentData & { id: string }; // Change this type as per your data model

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [ridersData, setRidersData] = useState<Rider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = db
      .collection("reports")
      .where("resolved", "==", true)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        const fetchedRiders: Rider[] = [];
        snapshot.forEach((doc) => {
          fetchedRiders.push({ ...doc.data(), id: doc.id } as Rider);
        });
        setRidersData(fetchedRiders);
        console.log(fetchedRiders);
      });

    // Clean up function
    return () => unsubscribe();
  }, []); // Empty array means this effect runs once on mount and clean up on unmount.

  const isFirestoreTimestamp = (
    input: any
  ): input is firebase.firestore.Timestamp => {
    return input instanceof firebase.firestore.Timestamp;
  };

  const formatDate = (timestamp: firebase.firestore.Timestamp): string => {
    if (isFirestoreTimestamp(timestamp)) {
      const dateObject = timestamp.toDate();
      return dateObject.toLocaleString(); // Adjust the format as per your requirement
    }
    return "Invalid Timestamp";
  };

  const deleteCoupon = async (riderId: string): Promise<void> => {
    try {
      const firestore = firebase.firestore();
      const couponRef = firestore.collection("reports").doc(riderId);
      await couponRef.delete();
      console.log(`Coupon with ID ${riderId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Ride Reports</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  REPORT ID
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  DRIVER PHONE
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  RIDER PHONE
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  REPORT DATE
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTION
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ridersData.map((rider, riderKey) => (
                <Table.Tr key={riderKey} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      href={"/view-report/" + rider.id}
                      className="text-blue-700"
                    >
                      {rider.id}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      href={"/view-driver/" + rider.driverID}
                      className="text-blue-700"
                    >
                      {rider.driverPhone}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      href={"/view-rider/" + rider.riderID}
                      className="text-blue-700"
                    >
                      {rider.riderPhone}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {formatDate(rider.timeReported)}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      href={"/view-report/" + rider.id}
                      className="text-blue-700"
                    >
                      <Button
                        variant="primary"
                        onClick={() => deleteCoupon(rider.id)}
                      >
                        {isLoading ? (
                          <LoadingIcon
                            icon="oval"
                            className="w-8 h-8"
                            color="white"
                          />
                        ) : (
                          "View Report"
                        )}
                      </Button>
                    </a>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
