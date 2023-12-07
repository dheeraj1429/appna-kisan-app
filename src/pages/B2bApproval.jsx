import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  approveUserInformation,
  getSingleB2bAccountDetails,
} from "src/api/b2bApproval";
import LoadingSpinner from "src/components/Spinner";
import classes from "./B2bApproval.module.css";
import { FormControlLabel, Stack } from "@mui/material";
import Switch from "@mui/material/Switch";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function B2bApproval() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInformation, setUserInformation] = useState();
  const params = useParams();

  const getUserAccountInfo = async function () {
    try {
      setIsLoading(true);
      const response = await getSingleB2bAccountDetails({ userId: params?.id });
      setIsLoading(false);
      if (response && response?.data?.success) {
        const { data } = response.data;
        setUserInformation(data);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const approveHandler = function (value) {
    const paramId = params?.id;
    if (paramId) {
      approveUserInformation({ userId: paramId, is_approved: value });
    }
  };

  const downloadHandler = function (url) {
    console.log(url);
  };

  useEffect(() => {
    if (params && params?.id) {
      getUserAccountInfo();
    }
  }, [params]);

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      {userInformation ? (
        <div>
          <h1 className={classes["heading"]}>Account approval</h1>
          <p className={classes["para"]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut in
            ipsam asperiores, est iusto deserunt amet voluptatibus ipsum
            incidunt explicabo?
          </p>
          <div className={classes["container"]}>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Owner name</h5>
              </div>
              <p>{userInformation?.owner_name}</p>
            </div>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Email</h5>
              </div>
              <p>{userInformation?.email}</p>
            </div>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Mobile</h5>
              </div>
              <p>{userInformation?.mobile}</p>
            </div>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Address</h5>
              </div>
              <p>{userInformation?.address}</p>
            </div>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Company name</h5>
              </div>
              <p>{userInformation?.company_name}</p>
            </div>
            <div className={classes["box"]}>
              <div className={classes["wd_container"]}>
                <h5>Created At</h5>
              </div>
              <p>
                {dayjs(userInformation?.createdAt).format(
                  "MMM DD YYYY hh:mm:ss A"
                )}
              </p>
            </div>
            {userInformation?.aadhaar?.number ? (
              <div>
                <h1 className={classes["heading"]}>Aadhaar</h1>
                <div className={classes["box"]}>
                  <div className={classes["wd_container"]}>
                    <h5>Number</h5>
                  </div>
                  <Stack spacing={2} direction="row" alignItems={"center"}>
                    <p>{userInformation.aadhaar.number}</p>
                    {/* <Link
                                    to={userInformation?.aadhaar?.images?.[0]?.image_url}
                                    download="document_1"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Download file
                                </Link> */}
                  </Stack>
                </div>
              </div>
            ) : null}
            {userInformation?.gstNo?.number ? (
              <div>
                <h1 className={classes["heading"]}>GST</h1>
                <div className={classes["box"]}>
                  <div className={classes["wd_container"]}>
                    <h5>Number</h5>
                  </div>
                  <Stack spacing={2} direction="row" alignItems={"center"}>
                    <p>{userInformation.gstNo.number}</p>
                    {/* <Link
                                    to={userInformation.gstNo.images?.[0]?.image_url}
                                    download="document_1"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Download file
                                </Link> */}
                  </Stack>
                </div>
              </div>
            ) : null}
            {userInformation?.pan?.number ? (
              <div>
                <h1 className={classes["heading"]}>PAN</h1>
                <div className={classes["box"]}>
                  <div className={classes["wd_container"]}>
                    <h5>Number</h5>
                  </div>
                  <Stack spacing={2} direction="row" alignItems={"center"}>
                    <p>{userInformation.pan.number}</p>
                    {/* <Link
                                    to={userInformation.pan.images?.[0]?.image_url}
                                    download="document_2"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Download file
                                </Link> */}
                  </Stack>
                </div>
              </div>
            ) : null}
            <Stack margin={1} width={100}>
              <FormControlLabel
                onChange={(event) => approveHandler(event.target.checked)}
                control={
                  <Switch defaultChecked={userInformation?.is_approved} />
                }
                label="Approval"
              />
            </Stack>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default B2bApproval;
