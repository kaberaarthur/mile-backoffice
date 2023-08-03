import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormHelp,
  FormCheck,
  FormSwitch,
  FormInline,
  InputGroup,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import Litepicker from "../../base-components/Litepicker";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

import LoadingIcon from "../../base-components/LoadingIcon";

function Main() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [couponPercent, setCouponPercent] = useState(0);

  const [daterange, setDaterange] = useState("");
  const [datepickerModalPreview, setDatepickerModalPreview] = useState(false);
  const cancelButtonRef = useRef(null);

  function validateCouponPercent(
    setInputError: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const inputElement = document.getElementById(
      "horizontal-form-2"
    ) as HTMLInputElement;
    const couponPercent = inputElement?.value?.trim() || "";

    // Step 1: Check if the value contains any special characters
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(couponPercent)) {
      setInputError(true); // Set inputError to true
      return false;
    }

    // Step 2: Check if the number is not above 100
    const parsedValue = parseInt(couponPercent, 10);
    if (isNaN(parsedValue) || parsedValue > 100) {
      setInputError(true); // Set inputError to true
    }

    // If everything is valid, reset inputError to false and return true
    setInputError(false);
  }

  // Function to create a coupon in Firestore
  const createCoupon = () => {
    setIsLoading(true);
    // Convert date strings to Firestore Timestamps
    const startDateTimestamp = firebase.firestore.Timestamp.fromDate(
      new Date(startDate)
    );
    const endDateTimestamp = firebase.firestore.Timestamp.fromDate(
      new Date(endDate)
    );

    // Assuming you have initialized Firebase with your config
    const db = firebase.firestore();

    // Create the coupon object
    const couponData = {
      couponTitle: inputValue,
      couponPercent: couponPercent,
      createdDate: startDateTimestamp,
      expiryDate: endDateTimestamp,
      couponType: "percent",
    };

    // Save the coupon to the 'coupons' collection in Firestore
    db.collection("coupons")
      .add(couponData)
      .then(() => {
        console.log("Coupon created successfully!");
        // You can add any additional code here after the coupon has been saved.
      })
      .catch((error) => {
        console.error("Error creating coupon:", error);
      });

    setIsLoading(false);
    navigate("/coupons");
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-12">
          {/* BEGIN: Horizontal Form */}
          <PreviewComponent className="mt-5 intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">Add Coupon</h2>
                </div>
                <div className="p-5">
                  <Preview>
                    <FormInline>
                      <FormLabel
                        htmlFor="horizontal-form-1"
                        className="sm:w-20"
                      >
                        Coupon Title
                      </FormLabel>
                      <FormInput
                        id="horizontal-form-1"
                        type="text"
                        placeholder="NEWCLIENT"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </FormInline>
                    <FormInline className="mt-5">
                      <FormLabel
                        htmlFor="horizontal-form-2"
                        className="sm:w-20"
                      >
                        Coupon Percent
                      </FormLabel>
                      <FormInput
                        id="horizontal-form-2"
                        type="text"
                        placeholder="20"
                        value={couponPercent}
                        onChange={(e) =>
                          setCouponPercent(parseInt(e.target.value, 10))
                        }
                      />
                    </FormInline>
                    <FormInline className="mt-5">
                      <FormLabel
                        htmlFor="horizontal-form-2"
                        className="sm:w-20"
                      >
                        Start Date
                      </FormLabel>
                      <Litepicker
                        value={startDate}
                        onChange={setStartDate}
                        options={{
                          autoApply: false,
                          showWeekNumbers: true,
                          dropdowns: {
                            minYear: 2023,
                            maxYear: null,
                            months: true,
                            years: true,
                          },
                        }}
                        className="block w-56 mx-auto"
                      />
                    </FormInline>
                    <FormInline className="mt-5">
                      <FormLabel
                        htmlFor="horizontal-form-2"
                        className="sm:w-20"
                      >
                        Expiry Date
                      </FormLabel>
                      <Litepicker
                        value={endDate}
                        onChange={setEndDate}
                        options={{
                          autoApply: false,
                          showWeekNumbers: true,
                          dropdowns: {
                            minYear: 2023,
                            maxYear: null,
                            months: true,
                            years: true,
                          },
                        }}
                        className="block w-56 mx-auto"
                      />
                    </FormInline>
                    {inputError && (
                      <p className="text-red-600 text-sm mt-5">
                        One of your values is incorrect.
                      </p>
                    )}
                    <div className="mt-5 sm:ml-20 sm:pl-5">
                      <Button
                        variant="primary"
                        disabled={inputError}
                        onClick={createCoupon}
                      >
                        {isLoading ? (
                          <LoadingIcon
                            icon="oval"
                            className="w-8 h-8"
                            color="white"
                          />
                        ) : (
                          "Create Coupon"
                        )}
                      </Button>
                    </div>
                  </Preview>
                  <Source>
                    <Highlight>
                      {`
                <FormInline>
                  <FormLabel
                    htmlFor="horizontal-form-1"
                    className="sm:w-20"
                  >
                    Email
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-1"
                    type="text"
                    placeholder="example@gmail.com"
                  />
                </FormInline>
                <FormInline className="mt-5">
                  <FormLabel
                    htmlFor="horizontal-form-2"
                    className="sm:w-20"
                  >
                    Password
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-2"
                    type="password"
                    placeholder="secret"
                  />
                </FormInline>
                <FormCheck className="mt-5 sm:ml-20 sm:pl-5">
                  <FormCheck.Input
                    id="horizontal-form-3"
                    type="checkbox"
                    value=""
                  />
                  <FormCheck.Label htmlFor="horizontal-form-3">
                    Remember me
                  </FormCheck.Label>
                </FormCheck>
                <div className="mt-5 sm:ml-20 sm:pl-5">
                  <Button variant="primary">Login</Button>
                </div>
                `}
                    </Highlight>
                  </Source>
                </div>
              </>
            )}
          </PreviewComponent>
          {/* END: Horizontal Form */}
        </div>
      </div>
    </>
  );
}

export default Main;
