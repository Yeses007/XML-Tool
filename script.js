let input = document.querySelector("input");
input.addEventListener("change", () => {
  let files = input.files;
  if (files.length == 0) return;
  var strXML = files[0];

  let reader = new FileReader();

  reader.onload = (e) => {
    strXML = e.target.result;
    var doc;
    var parser = new DOMParser();
    doc = parser.parseFromString(strXML, "text/xml");
    /**************************************************************************
     * Variable Declaration ******************************************************
     ****************************************************************************/
    var output = document.getElementById("textarea");
    var fileNameOutput = document.getElementById("dload-fn");
    var extractedData = [];
    var authorExtractedData = [];

    /**************************************************************************
     * Reusable Functions ******************************************************
     ****************************************************************************/
    /*   getValue function is used to get value of perticular Tag */
    const getValue = function (tag) {
      try {
        return doc.getElementsByTagName(`${tag}`)[0].childNodes[0].nodeValue;
      } catch {
        return " ";
      }
    };
    /************************************************************************************** */
    /*****************************Take other Basic Information by using getValue Function **************************/
    /************************************************************************************** */

    const doi_batch_id = getValue("journal-id");
    const registrant =
      getValue("publisher-name") + ", " + getValue("publisher-loc");
    const first_page = getValue("fpage");

    const last_page = getValue("lpage");
    const language = getValue("language");
    const article_title = getValue("article-title");
    const article_id = getValue("article-id");
    /************************************************************************************** */
    /*****************************Printing modified and extracted Data **************************/
    /************************************************************************************** */

    output.value += `
<doi_batch xmlns="http://www.crossref.org/schema/4.3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="4.3.0" xsi:schemaLocation="http://www.crossref.org/schema/4.3.0 http://www.crossref.org/schema/deposit/crossref4.3.0.xsd">
<head>
<doi_batch_id>${doi_batch_id}</doi_batch_id>
<timestamp> </timestamp>
<depositor>
<name> </name>
<email_address> </email_address>
</depositor>
<registrant>${registrant}</registrant>
</head>
<body>
<journal>
<journal_metadata language="${language}">
<full_title> </full_title>
<abbrev_title> </abbrev_title>
<issn media_type="print"> </issn>
<issn media_type="electronic"> </issn>
<doi_data>
<doi> </doi>
<resource> </resource>
</doi_data>
</journal_metadata>
<journal_issue>
<publication_date media_type=" ">
<month> </month>
<day> </day>
<year> </year>
</publication_date>
<journal_volume>
<volume> </volume>
</journal_volume>
<issue> </issue>
</journal_issue>
<journal_article publication_type=" ">
<titles>
<title>${article_title}</title>
</titles>
<contributors>
<person_name contributor_role=" " sequence=" ">
<given_name> </given_name>
<surname> </surname>
</person_name>
</contributors>
<publication_date media_type=" ">
<month> </month>
<day> </day>
<year> </year>
</publication_date>
<pages>
<first_page>${first_page} </first_page>
<last_page>${last_page}</last_page>
</pages>
<doi_data>
<doi>${article_id}</doi>
<resource> </resource>
</doi_data>
<citation_list>
`;

    /*************************************************************************** */
    /**********   FUNCTION TO Extract  DATA FROM main-tag in FILE */
    /********************************************************************************* */

    var extractDataFrom = function (mainTag) {
      //var x = doc.querySelectorAll("jnref");
      var x = doc.getElementsByTagName(`${mainTag}`);

      for (i = 0; i < x.length; i++) {
        var obj = {
          refId: "",
          journalTitle: "",
          author: "",
          volume: "",
          firstPage: "",
          year: "",
          uri: "",
        };

        //Will get refID Numbering from data
        try {
          obj.refId = x[i].getAttribute("numbering");
        } catch {}

        //Will get subtitle from main-tag from data
        try {
          obj.journalTitle = x[i].getElementsByTagName(
            "subtitle"
          )[0].childNodes[0].nodeValue;
        } catch {}
        // will get publisher name for journal-title
        try {
          obj.journalTitle = x[i].getElementsByTagName(
            "pubname"
          )[0].childNodes[0].nodeValue;
        } catch {}

        //Will get Journal-title from data
        try {
          obj.journalTitle = x[i].getElementsByTagName(
            "journal-title"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // will get volume from data
        try {
          obj.volume = x[i].getElementsByTagName(
            "volume"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // Will get year from data
        try {
          obj.year = x[i].getElementsByTagName(
            "year"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // will get firstPage From Data
        try {
          obj.firstPage = x[i].getElementsByTagName(
            "fpage"
          )[0].childNodes[0].nodeValue;
        } catch {}
        //will get <ti> tag  as unstructured citation
        try {
          obj.uri = x[i].getElementsByTagName("ti")[0].childNodes[0].nodeValue;
        } catch {}

        // will get uri of unstructured data
        try {
          obj.uri = x[i].getElementsByTagName("uri")[0].childNodes[0].nodeValue;
        } catch {}

        extractedData.push(obj); //will push every object created to extractedDataList
      }

      /**************************************************************************************************
       * ********************** Code to extract all authors Data****************************
       **************************************************************************************/
      let main_Tag = doc.querySelectorAll(`${mainTag}`);
      main_Tag.forEach((element) => {
        var x = element.querySelectorAll("name");
        var auth = {
          author: "",
        };
        try {
          auth.author +=
            element.getElementsByTagName("collab-name")[0].childNodes[0]
              .nodeValue + ", ";
        } catch {}
        x.forEach((ele) => {
          try {
            auth.author +=
              ele.getElementsByTagName("given-names")[0].childNodes[0]
                .nodeValue + " ";
          } catch {}
          try {
            auth.author +=
              ele.getElementsByTagName("middle-name")[0].childNodes[0]
                .nodeValue + " ";
          } catch {}
          try {
            auth.author +=
              ele.getElementsByTagName("surname")[0].childNodes[0].nodeValue +
              ", ";
          } catch {}
        });
        authorExtractedData.push(auth);
      });
    };
    /**************************************************************************************************************************************************Calling function with tag-names to extract data**********************************
     * ***********************************************************************************************************
     */
    extractDataFrom("jnref");
    extractDataFrom("otherref");
    extractDataFrom("bkref");

    /***********************************************************************
     * ******************************************************************************************************
     * ********** Below Code will add authors to ExtractedData List *************************
     *************************************************************************************/

    for (let i = 0; i < extractedData.length; i++) {
      extractedData[i].author = authorExtractedData[i].author;
    }
    /*******************************************************************************************************************************************************************************************************************************************************Below code will sort the Extracted Data List Based on RefId or Numbering
     * ******************************************************************************
     */

    function sortByrefId(a, b) {
      if (Number(a.refId) < Number(b.refId)) {
        return -1;
      }
      if (Number(a.refId) > Number(b.refId)) {
        return 1;
      }
      return 0;
    }
    try {
      extractedData.sort(sortByrefId);
    } catch {}

    /******************************************************************************************************************************Below code will remove comma at the end of author  ******************************************/
    for (let i = 0; i < extractedData.length; i++) {
      try {
        var str = extractedData[i].author;
        extractedData[i].author = str.substring(0, str.length - 2);
      } catch {}
    }
    /**********************************************************************************************************************************Below Code will Print all citation and otherref citations in an order********************************************************************************************** */

    for (let num = 0; num < extractedData.length; num++) {
      output.value += `
<citation key="ref${extractedData[num].refId}">
${
  (extractedData[num].journalTitle.length == 0 ||
    extractedData[num].author.length == 0) &&
  extractedData[num].uri.length > 0
    ? `<unstructured_citation>${extractedData[num].uri}</unstructured_citation>
`
    : ``
}${
        extractedData[num].journalTitle.length > 0
          ? `<journal_title>${extractedData[num].journalTitle}</journal_title>
    `
          : ``
      }${
        extractedData[num].author.length > 0
          ? `<author>${extractedData[num].author}</author>
    `
          : ``
      }${
        extractedData[num].volume.length > 0
          ? `<volume>${extractedData[num].volume}</volume>
    `
          : ``
      }${
        extractedData[num].firstPage.length > 0
          ? `<first_page>${extractedData[num].firstPage}</first_page>
    `
          : ``
      }${
        extractedData[num].year.length > 0
          ? `<cYear>${extractedData[num].year}</cYear>`
          : ``
      }
</citation>
`;
    }

    //console.log(extractedData);
    output.value += `
   
</citation_list>
</journal>
</body>
</doi_batch>
`;

    /************************************************************************************
     * ************** Below code adds doi-batch-id as filename to output*****************
     */
    var fileNameOutput = document.getElementById("dload-fn");

    fileNameOutput.value = `${doi_batch_id}.xml`;
    /****************************************************************/
  };

  reader.onerror = (e) => alert(e.target.error.name);

  reader.readAsText(strXML);
  /******************************************************************************************************************************************Below Code will make download button appear ***************************************/
  const element = document.getElementById("dload");
  element.classList.remove("hidden");
  const secElement = document.getElementById("dload-fn");
  secElement.classList.remove("hidden");
});

/********************************************************************************************
 ****************************************************************************************************************
 ****************Below code performs download of extracted text *******************************/
document.getElementById("dload").onclick = function () {
  var l = document.createElement("a");
  l.href =
    "data:text/plain;charset=UTF-8," +
    document.getElementById("textarea").value;
  l.setAttribute("download", document.getElementById("dload-fn").value);
  l.click();
};
