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
      .collection("coupons")
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

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Coupons</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  COUPON ID
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  COUPON TITLE
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  COUPON PERCENT
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  START DATE
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  END DATE
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
                    {rider.id}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a href="" className="font-medium whitespace-nowrap">
                      {rider.couponTitle}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {rider.couponPercent}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {formatDate(rider.createdDate)}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {formatDate(rider.expiryDate)}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <Button variant="primary">
                      {isLoading ? (
                        <LoadingIcon
                          icon="oval"
                          className="w-8 h-8"
                          color="white"
                        />
                      ) : (
                        "Delete Coupon"
                      )}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
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
