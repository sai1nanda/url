import React, { useState, useEffect, useRef } from 'react';
import useSemiPersistentState from '../customHooks/useSemiPersistentState';
import ShorteningForm from './ShorteningForm';
import ShortenedUrls from './ShortenedUrls';
const API_URL = 'https://api.shrtco.de/v2/shorten?url=';


export default function ShorteningApp() {
  const [urlError, setUrlError] = useState({
    message: '',
    isError: false
  });
  const [shortenedUrls, setShortenedUrls] = useSemiPersistentState(
    'shortenedUrl',
    {
      shortLinkList:[],
      originalUrl: ""
    }
  );
  const [url, setUrl] = useState( shortenedUrls.originalUrl);
  const isMounted = useRef(false);

  useEffect(() => {
    // fetch data.
    // console.log("Effect");
    async function fetchUrls() {
      if(isMounted.current){
        const data = await getUrl(url);
        setShortenedUrls(data);
      } else {
        isMounted.current = true;
      }
    }
    fetchUrls();
  }, [url, setShortenedUrls]);

  function handleSubmit(inputUrl) {
    let urlValidation = isUrlValid(inputUrl);
    // console.log(urlValidation);

    setUrlError({
      isError: !urlValidation.isValid,
      message: urlValidation.errorMessage,
    });

    if( inputUrl === shortenedUrls.originalUrl) {
      return;
    }

    if(urlValidation.isValid) {
      setUrl(inputUrl);
    } else {
      // console.log('url is invalid');
    }

  }

  // console.log('Rendered');
  return (
    <>
      <ShorteningForm 
        currentInput={url}
        onFormSubmission={handleSubmit}
        error={urlError.isError}
        errorMessage={urlError.message}
      />
      <ShortenedUrls shortenedUrls={shortenedUrls}/>
    </>
  );
}

function isUrlValid(url) {
  // const urlRe = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{1,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const urlRe = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{1,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

  if (url==="") {
    // console.log('Invalid url');
    return {
      isValid: false,
      errorMessage: 'Please add a link',
    };
  }
  if(!urlRe.test(url)) {
    // console.log("Invalid url");
    return {
      isValid: false,
      errorMessage: "Enter a correctly formatted url",
    }
  }

  return {
    isValid: true,
    errorMesage: ""
  };
}

// get shortened url
async function getUrl(url="https://shrtco.de/9EzyfB") {
    try {
        const response = await fetch(`${API_URL}${url}`);
        const data = await response.json();
        // console.log(data);
        const linkData = {
            originalUrl: data.result["original_link"],
            shortLinkList: [
                data.result["full_short_link"],
                // data.result["full_short_link2"],
                // data.result["full_short_link3"],
            ]
        }
        localStorage.setItem('shortenedUrl', JSON.stringify(linkData));
        // console.log(linkData);
        return linkData;
    } catch (e) {
        console.log(e);
    }
}
