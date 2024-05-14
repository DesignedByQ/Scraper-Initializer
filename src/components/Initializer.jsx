import React, { useState } from "react";
//import { v4 as uuidv4 } from 'uuid';
import TableComponent from "./TableComponent";

const Initializer = ({data}) => {

    //console.log(data)

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false);
    const [isErrorGetAll, setIsErrorGetAll] = useState(false);
    const [isLoadingGetData, setIsLoadingGetData] = useState(false);
    const [isErrorGetData, setIsErrorGetData] = useState(false);

    // const generateUUID = () => {
    //     return uuidv4()
    // }

    const [dataFromDB, setDataFromDB] = useState([]);

    const [base64Images, setBase64Images] = useState([]);

    const [allExistingBase64Images, setAllExistingBase64Images] = useState([]);

    //Arrays to separate categories from csv data
    const webpForFootwear = []
    const webpForAccessories = ["https://images.asos-media.com/products/asos-design-smart-leather-belt-with-burnished-silver-buckle-in-black/203859525-1-black"]
    const webpForCoatsandjackets = []

    const getURLs = [webpForFootwear, webpForAccessories, webpForCoatsandjackets];

    const [fetchedImageData, setFetchedImageData] = useState({

        base64DTO: {
            eventID: '',
            date: '',
            supplier: '',
            imageType: '',
            imageData: {
                footwearURLs: [],
                footwear64s: [],
                accessoriesURLs: [],
                accessories64s: [],
                coatsandjacketsURLs: [],
                coatsandjackets64s: [],
                footwearCaptions: [], 
                accessoriesCaptions: ["ASOS DESIGN extreme oversized leather look wrap jacket in black"], 
                coatsandjacketsCaptions: []   
            }

        }

    });

    const handleFileChange = async () => {

        //Fetch URLs and product descriptions from csv file and add to separate category arrays
        for(let i = 0; i < data.length; i++){
            if(data[i]["ProductType"] === "footwear"){
                //webpForFootwear.push(`https://${data[i]["ImageURL"]}`)
                //fetchedImageData.base64DTO.imageData.footwearCaptions.push(`https://${data[i]["Name"]}`)
            } else if(data[i]["ProductType"] === "accessories"){
                //webpForAccessories.push(`https://${data[i]["ImageURL"]}`);
                //fetchedImageData.base64DTO.imageData.accessoriesCaptions.push(`https://${data[i]["Name"]}`)
            } else if(data[i]["ProductType"] === "coatsandjackets"){
                //webpForCoatsandjackets.push(`https://${data[i]["ImageURL"]}`)
                //fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions.push(`https://${data[i]["Name"]}`)
            } else {
                console.log(`${data[i]["ID"]} was not assigned a product type.`)
            }
        }
        console.log(webpForAccessories)
        console.log(data)

        // Function to convert URLs to blobs and push into arrays
        const fetchAndPushBlobs = async (urls, blobArray) => {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
               
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image from URL: ${url}`);
                    }

                    const blob = await response.blob();
                    blobArray.push(blob);

                } catch (error) {
                    console.error(error);
                }
            }
        };

        // Define arrays for blobs
        let blob1 = []; //represents footwear
        let blob2 = []; //represents accessories
        let blob3 = []; //represents coatsandjackets

        // Fetch image data for each URL array and push blobs into respective arrays
        await Promise.all([

            fetchAndPushBlobs(getURLs[0], blob1),
            fetchAndPushBlobs(getURLs[1], blob2),
            fetchAndPushBlobs(getURLs[2], blob3)

        ]);

        console.log(blob1)
        console.log(blob2)
        console.log(blob3)

        //Set fetchedImageData object with event data and blob arrays
        fetchedImageData.base64DTO.eventID = data[1]["EventID"] ? data[1]["EventID"] : "Event ID was null"

        // Convert the date string to a Date object
        const dateObject = new Date(data[1]["DateTime"]);

        // Format the date string
        const formattedDate = dateObject.toISOString();

        fetchedImageData.base64DTO.date = formattedDate
        fetchedImageData.base64DTO.supplier = data[1]["Supplier"] ? data[1]["Supplier"] : "Supplier was null"
        fetchedImageData.base64DTO.imageType = blob1[0]?.type ? blob1[0].type : "Image type was null"
        fetchedImageData.base64DTO.imageData.footwearURLs = blob1
        fetchedImageData.base64DTO.imageData.accessoriesURLs = blob2
        fetchedImageData.base64DTO.imageData.coatsandjacketsURLs = blob3

        console.log(fetchedImageData)

        //Function to convert blobs to base64 using FileReader
        const blobsToBase64 = async (blobs) => {
            const base64Array = [];
            for (const blob of blobs) {
            // Create a FileReader object
            const reader = new FileReader();
            // Wrap FileReader in a Promise
            const base64Promise = new Promise((resolve, reject) => {
                // Set up the onloadend event handler to convert blob to base64
                reader.onloadend = () => {
                // Resolve the promise with the base64 data
                resolve(reader.result);
                };
                // Set up error handling for FileReader
                reader.onerror = (error) => {
                reject(error);
                };
                // Read the blob data as a data URL (base64)
                reader.readAsDataURL(blob);
            });
            // Wait for the promise to resolve and push the base64 data into base64Array
            base64Array.push(await base64Promise);
            }
            return base64Array;
        };        
        
        // Call the function to convert blobs into array of base64
        const conversionFootwearArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.footwearURLs);
        console.log(conversionFootwearArray);

        // Call the function to convert blobs into array of base64
        const conversionAccessoriesArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.accessoriesURLs);
        console.log(conversionAccessoriesArray);
        
        // Call the function to convert blobs into array of base64
        const conversionCoatsandjacketsArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.coatsandjacketsURLs);
        console.log(conversionCoatsandjacketsArray);
        
        //Display images in array on UI - set display size of each in return statement
        setBase64Images([...conversionFootwearArray, ...conversionAccessoriesArray, ...conversionCoatsandjacketsArray]);     

        //Set data to be posted
        fetchedImageData.base64DTO.imageData.footwear64s = conversionFootwearArray
        fetchedImageData.base64DTO.imageData.accessories64s = conversionAccessoriesArray
        fetchedImageData.base64DTO.imageData.coatsandjackets64s = conversionCoatsandjacketsArray

    }

    const persistURLs = `http://localhost:9100/imagehost/persistimagedata` 
    //const persistURLs = `https://image-host-je09.onrender.com/imagehost/persistimagedata`

    //Only sends base64s not URLs
    const handleSubmit = async (event) => {

        event.preventDefault();

        setIsLoading(true);
        setIsError(false);

        try {

            await handleFileChange();

            const footwear64s = fetchedImageData.base64DTO.imageData.footwear64s;

            // Iterate through the array and process each item - remove initial part of base64
            const footwearStringList = footwear64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              //console.log(base64ImageData)
              return base64ImageData;
            });

            const accessories64s = fetchedImageData.base64DTO.imageData.accessories64s;

            // Iterate through the array and process each item
            const accessoriesStringList = accessories64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              return base64ImageData;
            });

            const coatsandjackets64s = fetchedImageData.base64DTO.imageData.coatsandjackets64s;

            // Iterate through the array and process each item
            const coatsandjacketsStringList = coatsandjackets64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              return base64ImageData;
            });

            console.log(footwearStringList.length)
            console.log(accessoriesStringList.length)
            console.log(coatsandjacketsStringList.length)

            // console.log(fetchedImageData.base64DTO.imageData.footwearCaptions)
            // console.log(fetchedImageData.base64DTO.imageData.accessoriesCaptions)
            // console.log(fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions)

            const collectionOfImagesAndEventData = {

                eventID: fetchedImageData.base64DTO.eventID,
                date: fetchedImageData.base64DTO.date,
                supplier: fetchedImageData.base64DTO.supplier,
                imageType: fetchedImageData.base64DTO.imageType,
                footwear64s: footwearStringList,
                accessories64s: accessoriesStringList,
                coatsandjackets64s: coatsandjacketsStringList,
                footwearCaptions: fetchedImageData.base64DTO.imageData.footwearCaptions,
                accessoriesCaptions: fetchedImageData.base64DTO.imageData.accessoriesCaptions,
                coatsandjacketsCaptions: fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions

            }

            console.log(JSON.stringify(collectionOfImagesAndEventData))
            //console.log(collectionOfImagesAndEventData)

            const response = await fetch(persistURLs, {

                method: 'POST',
                headers: {
    
                    'Content-Type': 'application/json',
    
                },
                
                body: JSON.stringify(collectionOfImagesAndEventData)
              
            });
    
            if (!response.ok) {
              
              setIsError(true);
              
            } else {

                const data = response.json();
                console.log(data)
                console.log(response.status)  

            }


        } catch (error) {

                setIsError(true);
                console.log(error);
    
        }
    
            setIsLoading(false); 

    }

    const renderImage = (base64Strings) => {
          
        setAllExistingBase64Images([...base64Strings]);  

    }

    const getAllImages = `http://localhost:9100/imagehost/getallimages`
    //const getAllImages = `https://image-host-je09.onrender.com/imagehost/getallimages`
   
    const displayAllImages = async (event) => {

        event.preventDefault()

        setIsLoadingGetAll(true);
        setIsErrorGetAll(false);

        try {

            const response = await fetch(getAllImages, {

                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }

            });

            if(!response.ok){

                setIsErrorGetAll(true);

            } else {

                const images = await response.json()
                console.log(images)
                renderImage(images)

            }

        } catch(error){

            setIsErrorGetAll(true);
            console.log(error);

        }

        setIsLoadingGetAll(false); 
    
    }
    
    const getAllData = `http://localhost:9100/imagehost/getallentries`
    //const getAllData = `https://image-host-je09.onrender.com/imagehost/getallentries`

    const getDBData = async (event) => {

        event.preventDefault()

        setIsLoadingGetData(true)
        setIsErrorGetData(false)

        try {

            const response = await fetch(getAllData,{

                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }

            });

            if(!response.ok){
                setIsErrorGetData(true)
            } else {
                const data = await response.json()
                console.log(data)
                setDataFromDB(data)
            }

        } catch(error){
            setIsErrorGetData(true)
            console.log(error)
        }

        setIsLoadingGetData(false)

    }


    return(

        <div> 
            
            <h1>User Interface</h1>
            
            {/* Display converted images */}
            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error getting or posting images</div>}
                <button type="submit" onClick={handleSubmit}>Post Content</button>
                <h2>Images that were posted to instagram</h2>
                <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'  }}>
                    {base64Images.map((base64, index) => (
                        <div key={index}>
                            <img src={base64} alt={`Converted Image ${index + 1}`} style={{ width: '50px' }}/>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {isLoadingGetAll && <div>Loading...</div>}
                {isErrorGetAll && <div>Error fetching images</div>}
                <button type="submit" onClick={displayAllImages}>Get All Images</button>
                <h2>Images that exist in the database</h2>
                <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'  }}>
                    {allExistingBase64Images.map((base64String, index) => (
                        <div key={index} >
                            <img src={`data:image/jpeg;base64,${base64String}`} alt={`Image ${index}`} style={{ width: '50px' }}/>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {isLoadingGetData && <div>Loading...</div>}
                {isErrorGetData && <div>Error fetching DB Data</div>}
                <button type="submit" onClick={getDBData}>Get DB Data</button>
                <div>
                    <h2>All data in the database</h2>
                    <TableComponent data={dataFromDB} />
                </div>

            </div>

        </div>
  
    )

}

export default Initializer;