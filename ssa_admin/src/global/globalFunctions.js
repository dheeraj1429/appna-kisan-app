import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// firebase file upload function
export const uploadFileToFirebase = async (path, everyFile) => {
  // console.log("FILE UPLOADED FUNCTION",everyFile)
  const currentDate = new Date().toUTCString();
  const fileRef = ref(storage, `${path}${currentDate}--${everyFile?.name}`);
  let result;
  console.log("path->", path);
  await uploadBytes(fileRef, everyFile)
    .then((res) => {
      // console.log("FILENAME++++++",res)
      return getDownloadURL(res.ref);
    })
    .then((downloadURL) => {
      // console.log('Download URL', downloadURL)
      return (result = {
        image_name: currentDate + "--" + everyFile?.name,
        image_url: downloadURL,
        path: path,
      });
    });
  console.log("UPLOADED", result);
  return result;
};

// DELETE IMAGE FROM FIREBASE
export const deleteImageFromFirebase = (path, fileName) => {
  console.log("DELETE FILE", path, fileName);
  const desertRef = ref(storage, `${path}${fileName}`);
  deleteObject(desertRef)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((error) => {
      console.log("Uh-oh, an error occurred!");
    });
};

// FILTER FILE NAME FOR DELETION
export const returnFileName = (fileName) => {
  console.log(fileName);
  const getFilename = fileName?.split("--")[1];
  console.log(getFilename);
  return getFilename;
};

// create slug function
export const splitString = (strings) => {
  const createSplit = strings.replace(/ /g, "-");
  return createSplit;
};

// format date
export const convertDate = (d) => {
  return new Date(d).toUTCString()?.slice(0, 16);
};

export const convertDateForOrder = (d) => {
  return new Date(d).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
  // return new Date(d).toUTCString()?.slice(0,22);
};

//
export const getGapBetweenDates = (date_1, date_2) => {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};
