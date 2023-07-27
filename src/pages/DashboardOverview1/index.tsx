import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Menu, Tab } from "../../base-components/Headless";
import { FormSelect } from "../../base-components/Form";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Litepicker from "../../base-components/Litepicker";
import fakerData from "../../utils/faker";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _ from "lodash";
import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { db, auth } from "../../../firebaseConfig";

function Main() {
  const [generalReportFilter, setGeneralReportFilter] = useState<string>();
  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const [riders, setRiders] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [ridersCount, setRidersCount] = useState<number>(0);
  const [ridesCount, setRidesCount] = useState<number>(0);

  const [totalBeforeDeductionTotal, setTotalBeforeDeductionTotal] =
    useState<number>(0);
  const [netRevenues, setNetRevenues] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);

  const logDates = (value: any) => {
    if (value) {
      // Get Dates for the Specific Dates
      let dates = value.split(" - ");

      let queryStartDate = moment(dates[0], "DD MMM, YYYY").toDate();
      let queryEndDate = moment(dates[1], "DD MMM, YYYY").toDate();

      console.log(queryStartDate, queryEndDate);

      // Get Riders
      db.collection("riders")
        .where("dateRegistered", ">=", queryStartDate)
        .where("dateRegistered", "<=", queryEndDate)
        .get()
        .then((querySnapshot) => {
          const newRiders: any[] = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            newRiders.push(doc.data());
          });
          setRiders(newRiders);
          setRidersCount(querySnapshot.size);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      // Get Rides
      db.collection("rides")
        .where("dateCreated", ">=", queryStartDate)
        .where("dateCreated", "<=", queryEndDate)
        .get()
        .then((querySnapshot) => {
          const newRides: any[] = [];
          let totalBeforeReduction = 0;
          let totalReductions = 0;

          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            newRides.push(doc.data());

            console.log(
              "Type Of: " + typeof doc.data().totalFareBeforeDeduction
            );

            if (typeof doc.data().totalFareBeforeDeduction === "number") {
              totalBeforeReduction += doc.data().totalFareBeforeDeduction;
            }

            if (typeof doc.data().totalDeduction === "number") {
              totalReductions += doc.data().totalDeduction;
            }
          });
          setRides(newRides);
          setRidesCount(querySnapshot.size);
          setTotalBeforeDeductionTotal(totalBeforeReduction);
          setTotalDeductions(totalReductions);

          // Set Net Revenues
          // 15% of all Revenues Minus Deductions
          let nr = 0.15 * totalBeforeReduction;
          setNetRevenues(nr - totalReductions);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  const salesPerformance = () => {
    return [
      "bg-opacity-60",
      "bg-opacity-40",
      "bg-opacity-30",
      "bg-opacity-20",
      "bg-opacity-10",
    ][_.random(0, 4)];
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-6">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                General Report
              </h2>
              <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                <Lucide
                  icon="Calendar"
                  className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
                />
                <Litepicker
                  value={generalReportFilter}
                  onChange={(value) => {
                    setGeneralReportFilter(value);
                    logDates(value);
                  }}
                  options={{
                    autoApply: false,
                    singleMode: false,
                    numberOfColumns: 1,
                    numberOfMonths: 1,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 2022,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }}
                  className="pl-10 sm:w-56 !box"
                />
              </div>
            </div>
            <div
              className={clsx([
                "relative mt-12 intro-y sm:mt-4",
                "before:content-[''] before:w-[96%] before:shadow-[0px_3px_5px_#0000000b] before:h-full before:bg-slate-50 before:border before:border-slate-200 before:mt-3 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60",
              ])}
            >
              <div className="grid grid-cols-12 gap-0 py-0 divide-x divide-y box xl:py-5 xl:divide-y-0 divide-dashed divide-slate-200 dark:divide-white/5">
                <div
                  className={clsx([
                    "relative col-span-12 px-5 py-5 xl:py-0 sm:col-span-6 xl:col-span-3",
                    "[&:not(:last-child)]:before:content-[''] [&:not(:last-child)]:before:hidden [&:not(:last-child)]:xl:before:block [&:not(:last-child)]:before:w-[13px] [&:not(:last-child)]:before:h-[12px] [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:rounded-full [&:not(:last-child)]:before:bg-slate-200 [&:not(:last-child)]:before:top-0 [&:not(:last-child)]:before:right-0 [&:not(:last-child)]:before:-mr-[7px] [&:not(:last-child)]:before:-mt-[25px] [&:not(:last-child)]:before:dark:bg-darkmode-500",
                    "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:hidden [&:not(:last-child)]:xl:after:block [&:not(:last-child)]:after:w-[11px] [&:not(:last-child)]:after:h-[14px] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:rounded-full [&:not(:last-child)]:after:bg-slate-100 [&:not(:last-child)]:after:top-0 [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:-mr-[6px] [&:not(:last-child)]:after:-mt-[28px] [&:not(:last-child)]:after:dark:bg-darkmode-700",
                    "[&:not(:last-child)>[data-content]]:before:content-[''] [&:not(:last-child)>[data-content]]:before:hidden [&:not(:last-child)>[data-content]]:xl:before:block [&:not(:last-child)>[data-content]]:before:w-[13px] [&:not(:last-child)>[data-content]]:before:h-[12px] [&:not(:last-child)>[data-content]]:before:absolute [&:not(:last-child)>[data-content]]:before:rounded-full [&:not(:last-child)>[data-content]]:before:bg-slate-200 [&:not(:last-child)>[data-content]]:before:bottom-0 [&:not(:last-child)>[data-content]]:before:right-0 [&:not(:last-child)>[data-content]]:before:-mr-[7px] [&:not(:last-child)>[data-content]]:before:-mb-[25px] [&:not(:last-child)>[data-content]]:before:dark:bg-darkmode-700/60",
                    "[&:not(:last-child)>[data-content]]:after:content-[''] [&:not(:last-child)>[data-content]]:after:hidden [&:not(:last-child)>[data-content]]:xl:after:block [&:not(:last-child)>[data-content]]:after:w-[11px] [&:not(:last-child)>[data-content]]:after:h-[14px] [&:not(:last-child)>[data-content]]:after:absolute [&:not(:last-child)>[data-content]]:after:rounded-full [&:not(:last-child)>[data-content]]:after:bg-slate-50 [&:not(:last-child)>[data-content]]:after:bottom-0 [&:not(:last-child)>[data-content]]:after:right-0 [&:not(:last-child)>[data-content]]:after:-mr-[6px] [&:not(:last-child)>[data-content]]:after:-mb-[28px] [&:not(:last-child)>[data-content]]:after:dark:bg-darkmode-600",
                  ])}
                >
                  <div data-content>
                    <div className="flex">
                      <div className="flex items-center justify-center border rounded-full w-[2.2rem] h-[2.2rem] text-primary bg-primary/20 border-primary/20">
                        <Lucide
                          className="w-[1.3rem] h-[1.3rem]"
                          icon="PieChart"
                        />
                      </div>
                      {/*<div className="ml-auto">
                        <Tippy
                          as="div"
                          className="flex items-center pl-2 cursor-pointer text-success"
                          content="5.2% Higher than last month"
                        >
                          +5.2%
                          <Lucide icon="ArrowUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                </div>*/}
                    </div>
                    <div className="mt-6 text-2xl font-medium leading-7">
                      {totalBeforeDeductionTotal}
                    </div>
                    <div className="mt-1 text-slate-500">Total Payments</div>
                  </div>
                </div>
                <div
                  className={clsx([
                    "relative py-5 xl:py-0 px-5 sm:!border-t-0 col-span-12 sm:col-span-6 xl:col-span-3",
                    "[&:not(:last-child)]:before:content-[''] [&:not(:last-child)]:before:hidden [&:not(:last-child)]:xl:before:block [&:not(:last-child)]:before:w-[13px] [&:not(:last-child)]:before:h-[12px] [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:rounded-full [&:not(:last-child)]:before:bg-slate-200 [&:not(:last-child)]:before:top-0 [&:not(:last-child)]:before:right-0 [&:not(:last-child)]:before:-mr-[7px] [&:not(:last-child)]:before:-mt-[25px] [&:not(:last-child)]:before:dark:bg-darkmode-500",
                    "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:hidden [&:not(:last-child)]:xl:after:block [&:not(:last-child)]:after:w-[11px] [&:not(:last-child)]:after:h-[14px] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:rounded-full [&:not(:last-child)]:after:bg-slate-100 [&:not(:last-child)]:after:top-0 [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:-mr-[6px] [&:not(:last-child)]:after:-mt-[28px] [&:not(:last-child)]:after:dark:bg-darkmode-700",
                    "[&:not(:last-child)>[data-content]]:before:content-[''] [&:not(:last-child)>[data-content]]:before:hidden [&:not(:last-child)>[data-content]]:xl:before:block [&:not(:last-child)>[data-content]]:before:w-[13px] [&:not(:last-child)>[data-content]]:before:h-[12px] [&:not(:last-child)>[data-content]]:before:absolute [&:not(:last-child)>[data-content]]:before:rounded-full [&:not(:last-child)>[data-content]]:before:bg-slate-200 [&:not(:last-child)>[data-content]]:before:bottom-0 [&:not(:last-child)>[data-content]]:before:right-0 [&:not(:last-child)>[data-content]]:before:-mr-[7px] [&:not(:last-child)>[data-content]]:before:-mb-[25px] [&:not(:last-child)>[data-content]]:before:dark:bg-darkmode-700/60",
                    "[&:not(:last-child)>[data-content]]:after:content-[''] [&:not(:last-child)>[data-content]]:after:hidden [&:not(:last-child)>[data-content]]:xl:after:block [&:not(:last-child)>[data-content]]:after:w-[11px] [&:not(:last-child)>[data-content]]:after:h-[14px] [&:not(:last-child)>[data-content]]:after:absolute [&:not(:last-child)>[data-content]]:after:rounded-full [&:not(:last-child)>[data-content]]:after:bg-slate-50 [&:not(:last-child)>[data-content]]:after:bottom-0 [&:not(:last-child)>[data-content]]:after:right-0 [&:not(:last-child)>[data-content]]:after:-mr-[6px] [&:not(:last-child)>[data-content]]:after:-mb-[28px] [&:not(:last-child)>[data-content]]:after:dark:bg-darkmode-600",
                  ])}
                >
                  <div data-content>
                    <div className="flex">
                      <div className="flex items-center justify-center border rounded-full w-[2.2rem] h-[2.2rem] text-pending bg-pending/20 border-pending/20">
                        <Lucide
                          className="w-[1.3rem] h-[1.3rem]"
                          icon="CreditCard"
                        />
                      </div>
                      {/*<div className="ml-auto">
                        <Tippy
                          as="div"
                          className="flex items-center pl-2 cursor-pointer text-danger"
                          content="2% Lower than last month"
                        >
                          -2%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                </div>*/}
                    </div>
                    <div className="mt-6 text-2xl font-medium leading-7">
                      {ridersCount}
                    </div>
                    <div className="mt-1 text-slate-500">
                      New Rider Registrations
                    </div>
                  </div>
                </div>
                <div
                  className={clsx([
                    "relative col-span-12 px-5 py-5 xl:py-0 sm:col-span-6 xl:col-span-3",
                    "[&:not(:last-child)]:before:content-[''] [&:not(:last-child)]:before:hidden [&:not(:last-child)]:xl:before:block [&:not(:last-child)]:before:w-[13px] [&:not(:last-child)]:before:h-[12px] [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:rounded-full [&:not(:last-child)]:before:bg-slate-200 [&:not(:last-child)]:before:top-0 [&:not(:last-child)]:before:right-0 [&:not(:last-child)]:before:-mr-[7px] [&:not(:last-child)]:before:-mt-[25px] [&:not(:last-child)]:before:dark:bg-darkmode-500",
                    "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:hidden [&:not(:last-child)]:xl:after:block [&:not(:last-child)]:after:w-[11px] [&:not(:last-child)]:after:h-[14px] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:rounded-full [&:not(:last-child)]:after:bg-slate-100 [&:not(:last-child)]:after:top-0 [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:-mr-[6px] [&:not(:last-child)]:after:-mt-[28px] [&:not(:last-child)]:after:dark:bg-darkmode-700",
                    "[&:not(:last-child)>[data-content]]:before:content-[''] [&:not(:last-child)>[data-content]]:before:hidden [&:not(:last-child)>[data-content]]:xl:before:block [&:not(:last-child)>[data-content]]:before:w-[13px] [&:not(:last-child)>[data-content]]:before:h-[12px] [&:not(:last-child)>[data-content]]:before:absolute [&:not(:last-child)>[data-content]]:before:rounded-full [&:not(:last-child)>[data-content]]:before:bg-slate-200 [&:not(:last-child)>[data-content]]:before:bottom-0 [&:not(:last-child)>[data-content]]:before:right-0 [&:not(:last-child)>[data-content]]:before:-mr-[7px] [&:not(:last-child)>[data-content]]:before:-mb-[25px] [&:not(:last-child)>[data-content]]:before:dark:bg-darkmode-700/60",
                    "[&:not(:last-child)>[data-content]]:after:content-[''] [&:not(:last-child)>[data-content]]:after:hidden [&:not(:last-child)>[data-content]]:xl:after:block [&:not(:last-child)>[data-content]]:after:w-[11px] [&:not(:last-child)>[data-content]]:after:h-[14px] [&:not(:last-child)>[data-content]]:after:absolute [&:not(:last-child)>[data-content]]:after:rounded-full [&:not(:last-child)>[data-content]]:after:bg-slate-50 [&:not(:last-child)>[data-content]]:after:bottom-0 [&:not(:last-child)>[data-content]]:after:right-0 [&:not(:last-child)>[data-content]]:after:-mr-[6px] [&:not(:last-child)>[data-content]]:after:-mb-[28px] [&:not(:last-child)>[data-content]]:after:dark:bg-darkmode-600",
                  ])}
                >
                  <div data-content>
                    <div className="flex">
                      <div className="flex items-center justify-center border rounded-full w-[2.2rem] h-[2.2rem] text-warning bg-warning/20 border-warning/20">
                        <Lucide
                          className="w-[1.3rem] h-[1.3rem]"
                          icon="ShoppingBag"
                        />
                      </div>
                      {/*<div className="ml-auto">
                        <Tippy
                          as="div"
                          className="flex items-center pl-2 cursor-pointer text-success"
                          content="4.1% Higher than last month"
                        >
                          +4.1%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                </div>*/}
                    </div>
                    <div className="mt-6 text-2xl font-medium leading-7">
                      {ridesCount}
                    </div>
                    <div className="mt-1 text-slate-500">Rides Taken</div>
                  </div>
                </div>
                <div
                  className={clsx([
                    "relative col-span-12 px-5 py-5 xl:py-0 sm:col-span-6 xl:col-span-3",
                    "[&:not(:last-child)]:before:content-[''] [&:not(:last-child)]:before:hidden [&:not(:last-child)]:xl:before:block [&:not(:last-child)]:before:w-[13px] [&:not(:last-child)]:before:h-[12px] [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:rounded-full [&:not(:last-child)]:before:bg-slate-200 [&:not(:last-child)]:before:top-0 [&:not(:last-child)]:before:right-0 [&:not(:last-child)]:before:-mr-[7px] [&:not(:last-child)]:before:-mt-[25px] [&:not(:last-child)]:before:dark:bg-darkmode-500",
                    "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:hidden [&:not(:last-child)]:xl:after:block [&:not(:last-child)]:after:w-[11px] [&:not(:last-child)]:after:h-[14px] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:rounded-full [&:not(:last-child)]:after:bg-slate-100 [&:not(:last-child)]:after:top-0 [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:-mr-[6px] [&:not(:last-child)]:after:-mt-[28px] [&:not(:last-child)]:after:dark:bg-darkmode-700",
                    "[&:not(:last-child)>[data-content]]:before:content-[''] [&:not(:last-child)>[data-content]]:before:hidden [&:not(:last-child)>[data-content]]:xl:before:block [&:not(:last-child)>[data-content]]:before:w-[13px] [&:not(:last-child)>[data-content]]:before:h-[12px] [&:not(:last-child)>[data-content]]:before:absolute [&:not(:last-child)>[data-content]]:before:rounded-full [&:not(:last-child)>[data-content]]:before:bg-slate-200 [&:not(:last-child)>[data-content]]:before:bottom-0 [&:not(:last-child)>[data-content]]:before:right-0 [&:not(:last-child)>[data-content]]:before:-mr-[7px] [&:not(:last-child)>[data-content]]:before:-mb-[25px] [&:not(:last-child)>[data-content]]:before:dark:bg-darkmode-700/60",
                    "[&:not(:last-child)>[data-content]]:after:content-[''] [&:not(:last-child)>[data-content]]:after:hidden [&:not(:last-child)>[data-content]]:xl:after:block [&:not(:last-child)>[data-content]]:after:w-[11px] [&:not(:last-child)>[data-content]]:after:h-[14px] [&:not(:last-child)>[data-content]]:after:absolute [&:not(:last-child)>[data-content]]:after:rounded-full [&:not(:last-child)>[data-content]]:after:bg-slate-50 [&:not(:last-child)>[data-content]]:after:bottom-0 [&:not(:last-child)>[data-content]]:after:right-0 [&:not(:last-child)>[data-content]]:after:-mr-[6px] [&:not(:last-child)>[data-content]]:after:-mb-[28px] [&:not(:last-child)>[data-content]]:after:dark:bg-darkmode-600",
                  ])}
                >
                  <div data-content>
                    <div className="flex">
                      <div className="flex items-center justify-center border rounded-full w-[2.2rem] h-[2.2rem] text-success bg-success/20 border-success/20">
                        <Lucide
                          className="w-[1.3rem] h-[1.3rem]"
                          icon="HardDrive"
                        />
                      </div>
                      {/*<div className="ml-auto">
                        <Tippy
                          as="div"
                          className="flex items-center pl-2 cursor-pointer text-danger"
                          content="1% Lower than last month"
                        >
                          -1%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                </div>*/}
                    </div>
                    <div className="mt-6 text-2xl font-medium leading-7">
                      {netRevenues}
                    </div>
                    <div className="mt-1 text-slate-500">Net Revenues</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
          {/* BEGIN: Riders List */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6 mt-7">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">Riders</h2>
              <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                <Button variant="primary" className="w-24 mb-2 mr-1">
                  All Riders
                </Button>
              </div>
            </div>
            <PreviewComponent className="mt-5 intro-y box">
              <div className="p-5">
                <Preview>
                  <div className="overflow-x-auto">
                    <Table striped>
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
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {riders.map((rider, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td>{index + 1}</Table.Td>
                              <Table.Td>{rider.name}</Table.Td>
                              <Table.Td>{rider.email}</Table.Td>
                              <Table.Td>{rider.phone}</Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </div>
                </Preview>
                <Source>
                  <Highlight>
                    {`
                <div className="overflow-x-auto">
                  <Table striped>
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
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>1</Table.Td>
                        <Table.Td>Angelina</Table.Td>
                        <Table.Td>Jolie</Table.Td>
                        <Table.Td>@angelinajolie</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>2</Table.Td>
                        <Table.Td>Brad</Table.Td>
                        <Table.Td>Pitt</Table.Td>
                        <Table.Td>@bradpitt</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>3</Table.Td>
                        <Table.Td>Charlie</Table.Td>
                        <Table.Td>Hunnam</Table.Td>
                        <Table.Td>@charliehunnam</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                `}
                  </Highlight>
                </Source>
              </div>
            </PreviewComponent>
          </div>
          {/* END: Riders List */}
          {/* BEGIN: Riders List */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6 mt-7">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">Rides List</h2>
              <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                <Button variant="primary" className="w-24 mb-2 mr-1">
                  All Rides
                </Button>
              </div>
            </div>
            <PreviewComponent className="mt-5 intro-y box">
              <div className="p-5">
                <Preview>
                  <div className="overflow-x-auto">
                    <Table striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th className="whitespace-nowrap">#</Table.Th>
                          <Table.Th className="whitespace-nowrap">
                            Rider's Phone
                          </Table.Th>
                          <Table.Th className="whitespace-nowrap">
                            Driver's Phone
                          </Table.Th>
                          <Table.Th className="whitespace-nowrap">
                            Total Amount
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {rides.map((ride, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td>{index + 1}</Table.Td>
                              <Table.Td>{ride.riderPhone}</Table.Td>
                              <Table.Td>{ride.driverPhone}</Table.Td>
                              <Table.Td>
                                {ride.totalFareBeforeDeduction}
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </div>
                </Preview>
                <Source>
                  <Highlight>
                    {`
                <div className="overflow-x-auto">
                  <Table striped>
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
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>1</Table.Td>
                        <Table.Td>Angelina</Table.Td>
                        <Table.Td>Jolie</Table.Td>
                        <Table.Td>@angelinajolie</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>2</Table.Td>
                        <Table.Td>Brad</Table.Td>
                        <Table.Td>Pitt</Table.Td>
                        <Table.Td>@bradpitt</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>3</Table.Td>
                        <Table.Td>Charlie</Table.Td>
                        <Table.Td>Hunnam</Table.Td>
                        <Table.Td>@charliehunnam</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                `}
                  </Highlight>
                </Source>
              </div>
            </PreviewComponent>
          </div>
          {/* END: Rides List */}
        </div>
      </div>
    </div>
  );
}

export default Main;
