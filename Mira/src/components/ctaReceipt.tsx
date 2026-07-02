import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
// import Logo from "@/assets/MiraLogo.png";
import Aqua from "@/assets/IMG-20250906-WA0035.jpg"
import Emtsa from "@/assets/IMG-20250906-WA0036.jpg"
import Geosa from "@/assets/IMG-20250910-WA0200.jpg"
import Colermsa from "@/assets/IMG-20250914-WA0005.jpg"
import Wma from "@/assets/IMG-20250914-WA0009.jpg"
import Sslm from "@/assets/IMG-20250915-WA0001.jpg"
import Pbst from "@/assets/WhatsApp Image 2025-09-18 at 11.07.13 PM.jpeg"
import NAPS from "@/assets/ALPHA TEAM 20230603_181509.jpg"
import Colphyssa from "@/assets/WhatsApp Image 2025-09-28 at 8.06.55 PM.jpeg"
import html2pdf from 'html2pdf.js';
import Fossu from "@/assets/WhatsApp Image 2025-11-25 at 10.05.09 AM.jpeg"
import {QRCodeCanvas} from 'qrcode.react';


 function  Receipt () {
  const {state} = useLocation();
 
  interface PayeeData {
    collegeName?: string
    dateOfPayment?:string
    department?:string
    email?:string
    fresherLevel?:string
    fullname?:string
    isdepartmentPayment?:boolean
    level?:string
    mainLevel?:string
    matricNumber?: string
    paymentStatus?: string
    reference?:string
    amount?:string
    receiptNo?:string
  }
  
  const [payeData, setPayeData] = useState<PayeeData>({}); // State to hold fetched data
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('reference');
  const [okay, notOkay] = useState<boolean>(false);

  const departmentImages: Record<string, string> = {
    "Soil Science & Land Management (SSLM)": Sslm,
    "Aquaculture & Fisheries Management (Fishery)": Aqua,
    "Environmental Management & Toxicology (EMT)": Emtsa,
    "Water Resources Management & Agricultural Meteorology (WMA)": Wma,
    "Geology (GEO)": Geosa,
    "Plant Breeding & Seed Technology (PBST)": Pbst,
    "Plant Physiology & Crop Production (PPCP)": "/WhatsApp Image 2025-09-19 at 08.43.21_d1c86c59.jpg",
    "Physics (PHS)": NAPS
  };
  
  const collegeImages: Record<string, string> = {
    "College of Environmental Resources Management (COLERM)": Colermsa,
    "College of Physical Sciences (COLPHYS)": Colphyssa,
    "Federation of Oyo State Students Union (FOSSU)": Fossu
  };

  const departmentLedByInfo: Record<string, string> = {
    "Soil Science & Land Management (SSLM)": "TEAM ALPHACORE Led by Comr.Salami Akorede(Heskay)",
    "Aquaculture & Fisheries Management (Fishery)": "TEAM ALLAZELOS Led by Comr. Asaolu Emmanuel(ASHA))",
    "Environmental Management & Toxicology (EMT)": "TEAM Valor Led by Lady Commr Momoh-Jimoh Zainab Ohunene p.k.a Nene",
    "Water Resources Management & Agricultural Meteorology (WMA)": "Led by Comrade Lord_Wesley",
    "Geology (GEO)": "Team Threshold Led by Comrade Fhizeey",
    "Plant Breeding & Seed Technology (PBST)": "TEAM DYNAMOS Led by Comr. Kolawole Olamide Oluwajomiloju p.k.a Ollytouch",
    "Plant Physiology & Crop Production (PPCP)": "TEAM IMPACT Led By Comr. ABODERIN ISAAC OLAOLUWA P.k.a Abode",
    "Physics (PHS)": "Team WAVE-MAKERS Led by Comrade .Eniolorunda David Oluwatosin p.k.a Davidgraphix"
  };

  const collegeLedByInfo: Record<string, string> = {
    "College of Environmental Resources Management (COLERM)": "TEAM BEACON Led By Comr. ADEOSO ISEOLUWA DAVID P.ka Icon David",
    "College of Physical Sciences (COLPHYS)": "Team- LIFE Led by Comrade. Jimoh Joseph Itopa p.k.a Jossyreal",
    "Federation of Oyo State Students Union (FOSSU)": "Comr. Salaudeen Rukayat Titilope Farmer Rukkie"
  };

//   const departmentPayments: Record<string, Record<string, number>> = {
//   "Soil Science & Land Management (SSLM)": {
//     "Fresher/ Direct Entry": 6000,
//     "Staylite": 2000,
//   },
//   "Aquaculture & Fisheries Management (Fishery)": {
//    "Fresher/ Direct Entry": 5500,
//     "Staylite": 3500,
//   },
//   "Environmental Management & Toxicology (EMT)": {
//     "Fresher/ Direct Entry": 5000,
//     "Staylite": 3000,
//   },
//   "Water Resources Management & Agricultural Meteorology (WMA)": {
//     "Fresher/ Direct Entry": 5000,
//     "Staylite": 3000,
//   },
//   "Geology (GEO)": {
//     "Fresher/ Direct Entry": 5000,
//     "Staylite": 3500,
//   },
//   // Add more departments here
// };

// const collegePayments: Record<string, Record<string, number>> = {
//   "COLERM": {
//     "Fresher/ Direct Entry": 6000,
//      "Staylite": 3000,
//   },
// }
// const getPaymentAmount = (isDepartmentPayment: boolean | undefined, department: string | undefined, collegeName: string | undefined, mainLevel: string | undefined): number => {
//   if (isDepartmentPayment) {
//     return departmentPayments[department || ""]?.[mainLevel || ""] || 0;
//   } else {
//     return collegePayments[collegeName || ""]?.[mainLevel || ""] || 0;
//   }
// };

const getLogo = (department: string | undefined, collegeName: string | undefined): string => {
  if (collegeName === "None") {
    return departmentImages[department || ""] || "";
  } else {
    return collegeImages[collegeName || ""] || "";
  }
}

const getLedBy = (department: string | undefined, collegeName: string | undefined): string => {
  if (collegeName === "None") {
    return departmentLedByInfo[department || ""] || "";
  } else {
    return collegeLedByInfo[collegeName || ""] || "";
  }
}
  function downloadPDF() {
  const element = document.getElementById('receipt');
  

  const opt = {
    filename:     'Mira_receipt.pdf',
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  };

  // Generate and download
  html2pdf().set(opt).from(element).save();
}


useEffect(() => {
  const fetchData = async () => {
    try {
      notOkay(true); // show loader before fetching

      if (state && state.searchResult) {
        // directly assign the object
        setPayeData(state.searchResult); 
      }

      notOkay(false); 
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      notOkay(false);
    }
  };

  fetchData();
}, [state]);



  
  useEffect(() => {
    if (!payeData) return;

    // Now that payeData is ready, stop loader
    console.log("Payee Data:", payeData);
    
    if (payeData.email && payeData.amount) {
      notOkay(false); // hide loader

    // Generate PDF with real data          
    const timer = setTimeout(() => {
      downloadPDF();
    }, 2000); // wait 2 seconds

    return () => clearTimeout(timer); // cleanup
    }
    
  }, [payeData]);

  return (
    
    <div className="sm:scale-100 h-full w-[794px] md:w-full lg:w-full   p-2 bg-white  font-sans-serif mb-0" id="receipt">
            {okay && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-8 text-center flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-700 text-lg font-medium">
                        Generating your receipt...
                        <br/> automatically downloads in 3 seconds 
                      </p>
                    </div>
                  </div>
                )}
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
 
         
      
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="font-bold text-lg text-primary">  
          </div>
        
        <div><img src={getLogo(payeData.department, payeData.collegeName)} alt="Logo" className="mx-auto w-16 py-1 -mt-auto -mb-auto object-contain" />
        <div className="italic text-xs text-black">{getLedBy(payeData.department, payeData.collegeName)}</div></div>
        
      </div>   
       
<hr className="border-primary"></hr>
<br/>
      {/* Payee Information */}
      <div className="mb-4">
        <div className="text-receipt-text  mb-2 text-black">PAYEE:</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-receipt-text text-black">Name: {payeData.fullname}</div>
          
          </div>
          <div></div>
          <div>
            <div className="text-receipt-text text-black">Matric No: {payeData.matricNumber}</div>
            
          </div><br/>
          <div>
            <div className="text-receipt-text text-black">College: {payeData.collegeName || ""}</div>
            
          </div><br/>
          <div>
            <div className="text-receipt-text text-black">Department: {payeData.department || "None"}</div>
          
          </div>
        </div>
      </div>
<hr className="border-2"></hr>
      {/* Payment Details Table */}
      <div className="mb-2 bg-gray-100 pb-2 mt-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-receipt-light-gray">
              <th className="text-left py-2 px-2 text-receipt-text font-normal text-black">DESCRIPTION</th>
              <th className="text-left py-2 px-2 text-receipt-text font-normal text-black">STUDENT TYPE</th>
              <th className="text-left py-2 px-2 text-receipt-text font-normal text-black">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 text-receipt-text text-black">Payment for {payeData.collegeName === "None" ? payeData.department : payeData.collegeName} due</td>
              <td className=" bg-gray-200 py-4 px-auto  text-black">{payeData.mainLevel}</td>
              <td className="py-2 px-2 bg-primary text-black px-20 py-4 text-center font-semibold">
                  ₦{payeData.amount?.toLocaleString()}
                
              </td>
            </tr>
            <tr className="">
              <td className="py-1 px-2"></td>
              <td className="py-1 px-2 text-receipt-text text-right text-black">SUBTOTAL</td>
              <td className="py-1 px-2 text-receipt-text text-black">₦{payeData.amount?.toLocaleString()}

              </td>
            </tr>
     
            <tr className="">
              <td className="py-1 px-2"></td>
              <td className="py-1 px-2 text-receipt-text text-right text-primary">GRAND TOTAL</td>
              <td className="py-1 px-auto  text-primary">₦{payeData.amount?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
       
      </div>

<br/>
      {/* Transaction Details */}
      <div className="mb-4 bg-gray-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-receipt-light-gray">
              <th className="text-left py-4 px-2 text-receipt-text font-normal text-black">TRANSACTION DATE</th>
              <th className="text-left py-4 px-2 text-receipt-text font-normal text-black">PAYMENT TYPE</th>
              <th className="text-left py-4 px-2 text-receipt-text font-normal text-black">PAYMENT REFERENCE</th>
              <th className="text-left py-4 px-2 text-receipt-text font-normal text-black">RECEIPT NO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 text-receipt-text text-black">{ new Date(payeData.dateOfPayment).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className=" bg-gray-200 py-4 px-auto text-receipt-text text-black">DIGI</td>
          <td className=" py-4 px-10 bg-gray-200 text-receipt-text text-black">{payeData.reference}</td>
              <td className="bg-primary text-black px-auto py-4 text-center font-semibold text-xs text-black">
               
                {payeData.receiptNo}  
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Thank you message */}
      <div className="text-xs text-receipt-text mb-4 text-black">
        Thank you for making your payment through Us!
      </div>
<br/>
      {/* Notice */}
      <div className="mb-4">
        <div className=" p-3 text-xs">
          <div className="border-l-8  p-2 mb-1 text-black border-l-primary text-lg border-b">  NOTICE:  <br/> <div className=" text-black text-xs bottom-0">
            *Any alteration on this receipt will be rendered invalid. Contact us via WhatsApp on 09032751557 for inquiry.
          </div></div>
          <br/>
         
        </div>
      </div>
      {/* qrcode section */}
      <div className="bottom-0 ml-10 mt-10">
        <QRCodeCanvas value={payeData.reference} size={100} bgColor="white"  />
      </div> <br/>
      <br/>
  <div className="text-black  text-left text-sm ml-8">
          <div>NB: This Receipt is rendered invalid without Stamping</div>
        </div>
        <br/>
      {/* footer */}
       <div className="text-right text-xs text-receipt-text text-black">
          <div>Contact:</div>
          <div>(+234) 901 946 9723</div>
          <div>Mirahelp@gmail.com</div>
        </div> 

        <div className="text-center text-gray-500">Mira, creating innovative solutions...</div>
 </div>  
  );
  };
      {/* PAID Stamp */}
      {/* <div className="flex justify-center mb-4">
        <div className="">
          <div className="w-24 h-24 rounded-full border-4 border-receipt-gray flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-100">PAID</div>
              <div className="text-xs text-receipt-gray">STAMP</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* QR Code and Footer */}
   
 


export default Receipt;
