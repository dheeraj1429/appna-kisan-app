import storage from '@react-native-firebase/storage';
import {ref,uploadBytes,getDownloadURL,deleteObject} from "@react-native-firebase/storage"

  // firebase file upload function 
 export const uploadFileToFirebase = async(path,everyFile)=>{
    // console.log("FILE UPLOADED FUNCTION-----------",everyFile)
    const currentDate = new Date().toUTCString()
    // const fileRef = ref(storage,`${path}${currentDate}--${everyFile?.name}`)
    const fileRef = storage().ref(`${path}${currentDate}--${everyFile?.fileName}`)
    let result;
    // console.log("path->",path)
      //     const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const uploadUri = Platform.OS === 'ios' ? everyFile.uri.replace('file://', '') : everyFile.uri;

    const task = fileRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      // console.log(`${taskSnapshot.bytesTransferred} transferred 
      // out of ${taskSnapshot.totalBytes}`);
    });
    let downloadURL;
    task.then(() => {
      console.log('Image uploaded to the bucket!');
        }).then(async()=>{
          await fileRef.getDownloadURL()
          .then(async resultUrl=>{
            console.log("downloaddownloaddownloaddownload",resultUrl)
            downloadURL= resultUrl
            result =  {image_name:currentDate+"--"+everyFile?.fileName,image_url:downloadURL,path:path}
            console.log("-------------------------------------------------------------------9",result)
             return result;
           })
        })
        
        return result;
  }


// DELETE IMAGE FROM FIREBASE 
export const deleteImageFromFirebase = (path,fileName)=>{
  console.log("DELETE FILE",path,fileName)
  const desertRef = ref(storage, `${path}${fileName}`);
  deleteObject(desertRef).then(() => {
        console.log("File deleted successfully")
     }).catch((error) => {
        console.log("Uh-oh, an error occurred!")
    });

  }


// format date 
export const convertDate = (d)=>{
    return new Date(d).toUTCString()?.slice(0,16);
  }
  
export const convertDateForOrder = (d)=>{
    return new Date(d).toUTCString()?.slice(0,22);
  }