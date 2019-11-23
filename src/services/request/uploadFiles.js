export function AJAXSubmit (oFormElement, url) {
  console.log('formelement at ajaz submit is: ', oFormElement);
  return new Promise((resolve, reject) => {
    var oReq = new XMLHttpRequest();
    oReq.onload = () => {
      if (oReq.status >= 200 && oReq.status < 300) {
        console.log('about to request oReq reqponse which is', oReq.response);
        resolve(oReq.response);
      } else {
         console.log('rejecting', oReq.statusText);
        reject({
          status: oReq.status,
          statusText: oReq.statusText
        });
      }
    };
    if (oFormElement.method.toLowerCase() === "post") {
      console.log('post');
      oReq.open("post", url);
      var formData = new FormData(oFormElement)
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
      oReq.send(formData);
    } else {
      console.log('not post');
      var oField, sFieldType, nFile, sSearch = "";
      for (var nItem = 0; nItem < oFormElement.elements.length; nItem++) {
        oField = oFormElement.elements[nItem];
        if (!oField.hasAttribute("name")) { continue; }
        sFieldType = oField.nodeName.toUpperCase() === "INPUT" ?
        oField.getAttribute("type").toUpperCase() : "TEXT";
        if (sFieldType === "FILE") {
          for (nFile = 0; nFile < oField.files.length;
            sSearch += "&" + escape(oField.name) + "=" + escape(oField.files[nFile++].name));
        } else if ((sFieldType !== "RADIO" && sFieldType !== "CHECKBOX") || oField.checked) {
          sSearch += "&" + escape(oField.name) + "=" + escape(oField.value);
      }
    }
    oReq.open("get", url.replace(/(?:\?.*)?$/, sSearch.replace(/^&/, "?")), true);
    oReq.send(null);
    }
  });
}
