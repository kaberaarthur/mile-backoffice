import { useState, ChangeEvent, useEffect } from "react";
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
import LoadingIcon from "../../base-components/LoadingIcon";

import { db, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";

interface CompanyData {
  companyName: string;
  dateCreated: firebase.firestore.Timestamp;
  email: string;
  phone: string;
  totalWallet: number;
}

function Main() {
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCompany = async () => {
    setIsLoading(true);
    try {
      const dateCreated = firebase.firestore.Timestamp.now();
      const totalWallet = 0;

      const companyData: CompanyData = {
        companyName,
        dateCreated,
        email,
        phone,
        totalWallet,
      };

      await db.collection("companies").add(companyData);

      // Reset form fields after successful addition
      setCompanyName("");
      setEmail("");
      setPhone("");

      console.log("Company added successfully");
    } catch (error) {
      console.error("Error adding company:", error);
    }
    setIsLoading(false);
  };

  // Handle Details Change
  const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-6">
          {/* BEGIN: Horizontal Form */}
          <PreviewComponent className="mt-5 intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">Add Company</h2>
                </div>
                <div className="p-5">
                  <Preview>
                    <FormInline>
                      <FormLabel
                        htmlFor="horizontal-form-1"
                        className="sm:w-20"
                      >
                        Company Name
                      </FormLabel>
                      <FormInput
                        id="horizontal-form-1"
                        type="text"
                        placeholder="Mile Taxi Services Ltd"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                      />
                    </FormInline>
                    <FormInline className="mt-5">
                      <FormLabel
                        htmlFor="horizontal-form-2"
                        className="sm:w-20"
                      >
                        Phone
                      </FormLabel>
                      <FormInput
                        id="horizontal-form-2"
                        type="text"
                        placeholder="+254790485731"
                        value={phone}
                        onChange={handlePhoneChange}
                      />
                    </FormInline>
                    <FormInline className="mt-5">
                      <FormLabel
                        htmlFor="horizontal-form-2"
                        className="sm:w-20"
                      >
                        Email
                      </FormLabel>
                      <FormInput
                        id="horizontal-form-2"
                        type="text"
                        placeholder="hi@safaricom.co.ke"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </FormInline>

                    <div className="mt-5 sm:ml-20 sm:pl-5">
                      <Button variant="primary" onClick={handleAddCompany}>
                        {isLoading ? (
                          <LoadingIcon
                            icon="oval"
                            className="w-8 h-8"
                            color="white"
                          />
                        ) : (
                          "Add Company"
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
