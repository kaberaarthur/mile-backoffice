import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { Disclosure } from "../../base-components/Headless";
import { useParams } from "react-router-dom";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

import fakerData from "../../utils/faker";

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
  timeReported: firebase.firestore.Timestamp;
  // Add other fields if necessary
}

function Main() {
  const { id } = useParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);

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
        </div>
        {/* END: Invoice Title */}
      </div>
      <div className="p-5 mt-5 box intro-y">
        {/* BEGIN: Timeline Wrapper */}
        <div className="pb-20 px-5 mt-5 -mb-5 relative overflow-hidden before:content-[''] before:absolute before:w-px before:bg-slate-200/60 before:dark:bg-darkmode-400 before:mr-auto before:left-0 lg:before:right-0 before:ml-3 lg:before:ml-auto before:h-full before:mt-8">
          <div className="relative z-10 py-2 my-5 text-xs text-center bg-white dark:bg-darkmode-600 text-slate-500">
            March, 2022
          </div>
          {/* BEGIN: Timeline Content Latest */}
          <div className="lg:ml-[51%] pl-6 lg:pl-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:left-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-6 before:h-6 before:bg-primary/20 before:rounded-full before:inset-x-0 lg:before:ml-auto before:mr-auto lg:before:animate-ping after:content-[''] after:absolute after:w-6 after:h-6 after:bg-primary after:rounded-full after:inset-x-0 lg:after:ml-auto after:mr-auto after:border-4 after:border-white/60 after:dark:border-darkmode-300">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[1]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[0].users[0].name}
                </a>
                {fakerData[0].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[0].dates[0]} - {fakerData[0].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content Latest */}
          {/* BEGIN: Timeline Content */}
          <div className="lg:mr-[51%] pl-6 lg:pl-0 lg:pr-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:right-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[2]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[1].users[0].name}
                </a>
                {fakerData[1].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[1].dates[0]} - {fakerData[1].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content */}
          {/* BEGIN: Timeline Content Latest */}
          <div className="lg:ml-[51%] pl-6 lg:pl-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:left-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-6 before:h-6 before:bg-primary/20 before:rounded-full before:inset-x-0 lg:before:ml-auto before:mr-auto lg:before:animate-ping after:content-[''] after:absolute after:w-6 after:h-6 after:bg-primary after:rounded-full after:inset-x-0 lg:after:ml-auto after:mr-auto after:border-4 after:border-white/60 after:dark:border-darkmode-300">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[1]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[0].users[0].name}
                </a>
                {fakerData[0].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[0].dates[0]} - {fakerData[0].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content Latest */}
          <div className="relative z-10 py-2 my-5 text-xs text-center bg-white dark:bg-darkmode-600 text-slate-500">
            April, 2022
          </div>
          {/* BEGIN: Timeline Content */}
          <div className="lg:ml-[51%] pl-6 lg:pl-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:left-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[3]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[2].users[0].name}
                </a>
                {fakerData[2].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[2].dates[0]} - {fakerData[2].times[0]}
                </div>
                <div className="grid grid-cols-12 gap-2 mt-5">
                  <div className="h-16 col-span-6 cursor-pointer image-fit sm:col-span-3 lg:col-span-2">
                    <img
                      alt="Rocketman - HTML Admin Template"
                      className="rounded-md"
                      src={fakerData[0].images[0]}
                    />
                  </div>
                  <div className="h-16 col-span-6 cursor-pointer image-fit sm:col-span-3 lg:col-span-2">
                    <img
                      alt="Rocketman - HTML Admin Template"
                      className="rounded-md"
                      src={fakerData[0].images[1]}
                    />
                  </div>
                  <div className="h-16 col-span-6 cursor-pointer image-fit sm:col-span-3 lg:col-span-2">
                    <img
                      alt="Rocketman - HTML Admin Template"
                      className="rounded-md"
                      src={fakerData[0].images[2]}
                    />
                  </div>
                  <div className="h-16 col-span-6 cursor-pointer image-fit sm:col-span-3 lg:col-span-2">
                    <img
                      alt="Rocketman - HTML Admin Template"
                      className="rounded-md"
                      src={fakerData[0].images[3]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content */}
          {/* BEGIN: Timeline Content */}
          <div className="lg:ml-[51%] pl-6 lg:pl-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:left-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[4]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[3].users[0].name}
                </a>
                {fakerData[3].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[3].dates[0]} - {fakerData[3].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content */}
          {/* BEGIN: Timeline Content */}
          <div className="lg:mr-[51%] pl-6 lg:pl-0 lg:pr-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:right-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[5]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[4].users[0].name}
                </a>
                {fakerData[4].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[4].dates[0]} - {fakerData[4].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content */}
          {/* BEGIN: Timeline Content */}
          <div className="lg:mr-[51%] pl-6 lg:pl-0 lg:pr-[51px] before:content-[''] before:absolute before:w-20 before:h-px before:mt-8 before:right-[60px] before:bg-slate-200 before:dark:bg-darkmode-400 before:rounded-full before:inset-x-0 before:mx-auto before:z-[-1]">
            <div className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 mt-10 before:content-[''] before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-x-0 before:ml-0.5 lg:before:ml-auto before:mr-auto before:dark:bg-darkmode-300 after:content-[''] after:absolute after:w-3 after:h-3 after:bg-slate-50 after:rounded-full after:inset-x-0 after:ml-1.5 lg:after:ml-auto after:mr-auto after:mt-1 after:dark:bg-darkmode-200">
              <div className="mr-3">
                <div className="w-12 h-12 image-fit">
                  <img
                    alt="Rocketman - HTML Admin Template"
                    className="rounded-full"
                    src={fakerData[0].images[6]}
                  />
                </div>
              </div>
              <div>
                <a href="" className="font-medium text-primary">
                  {fakerData[5].users[0].name}
                </a>
                {fakerData[5].news[0].shortContent}.
                <div className="text-slate-500 text-xs mt-1.5">
                  {fakerData[5].dates[0]} - {fakerData[5].times[0]}
                </div>
              </div>
            </div>
          </div>
          {/* END: Timeline Content */}
          <Button
            variant="outline-secondary"
            className="relative z-10 block mx-auto mt-10 bg-white dark:bg-darkmode-400"
          >
            Load More
          </Button>
        </div>
        {/* END: Timeline Wrapper */}
      </div>
    </>
  );
}

export default Main;
